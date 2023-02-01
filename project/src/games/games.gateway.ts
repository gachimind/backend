import { UseFilters, Next } from '@nestjs/common';
import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { setTimeout } from 'timers/promises';
import {
    SocketException,
    SocketExceptionFilter,
} from 'src/common/exceptionFilters/ws-exception.filter';
import { RoomService } from './room.service';
import { PlayersService } from './players.service';
import { ChatService } from './chat.service';
import { GamesService } from './games.service';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { Room } from './entities/room.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.request.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import { RoomInfoToRoomDto } from './dto/roomInfoToRoom.dto';
import { AuthorizationRequestDto } from 'src/users/dto/authorization.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { EventUserInfoDto } from './dto/evnet-user.info.dto';
import { TurnEvaluateRequestDto } from './dto/evaluate.request.dto';
import { eventUserInfoConstructor } from './util/event.user.info.constructor';
import { updateRoomInfoConstructor } from './util/update-room.info.constructor';
import { gameTimerMap } from './util/game-timer.map';
import { NextFunction } from 'express';
import { GameResult } from './entities/gameResult.entity';
import { gameMap } from './util/game.map';
import { turnMap } from './util/turn.map';

@UseFilters(new SocketExceptionFilter())
@WebSocketGateway({ cors: { origin: '*' } })
export class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly roomService: RoomService,
        private readonly playersService: PlayersService,
        private readonly chatService: ChatService,
        private readonly gamesService: GamesService,
    ) {}

    @WebSocketServer()
    public server: Server;

    afterInit(server: Server): any {
        console.log('webSocketServer init');
    }

    async handleConnection(@ConnectedSocket() socket: Socket) {
        console.log('connected socket', socket.id);
        const data: RoomInfoToMainDto[] = await this.roomService.getAllRoomList();
        socket.emit('room-list', { data });
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        // socketIdMap에서 유저 정보 가져오기
        const requestUser: SocketIdMap = await this.playersService.getUserBySocketId(socket.id);

        // socketIdMap에 유저정보가 없다면 바로 disconnect
        if (!requestUser) return console.log('disconnected socket', socket.id);

        // socketIdMap에서 삭제 -> Player 테이블과 Room 테이블에서 cascade
        await this.playersService.removeSocketBySocketId(socket.id, requestUser.userInfo);

        // player였다면, leave-room 로직 수행
        if (requestUser.player) {
            // request user가 게임 중 자신이 발표자일 때 돌고 있는 timer 종료
            const turn: Turn = requestUser.player.room.turns.at(-1);
            if (
                turn &&
                turn.speechPlayer === requestUser.userInfo &&
                (turn.currentEvent === 'readyTime' || turn.currentEvent === 'speechTime')
            ) {
                await this.handleSpeechPlayerLeaveRoomRequest(turn, socket, Next);
            }

            // leave-room 처리
            socket.leave(`${requestUser.player.roomInfo}`);

            // 유저가 나간 뒤 방 정보 갱신
            const updateRoom: UpdateRoomDto = await this.updateRoom(requestUser.player.roomInfo);

            // 방 정보를 갱신하고, 게임 중이었다면, 다시 게임 시작
            if (updateRoom.room.isGameOn) await this.controlGameTurns(updateRoom.room, Next);

            // 업데이트 된 방 정보 announce
            await this.announceUpdateRoomInfo(updateRoom, requestUser, 'leave');
        }
        return console.log('disconnected socket', socket.id);
    }

    @SubscribeMessage('log-in')
    async socketIdMapToLoginUser(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: { data: AuthorizationRequestDto },
    ) {
        // 토큰 유무 검사
        const token = data.authorization;
        if (!token) {
            throw new SocketException('사용자 인증에 실패했습니다.', 401, 'log-in');
        }
        // 토큰을 가지고 유저 정보를 얻어오기
        const requestUser: User = await this.playersService.getUserIdByToken(token);
        if (!requestUser) {
            throw new SocketException('사용자 정보를 찾을 수 없습니다', 404, 'log-in');
        }
        // userId를 가지고 기존에 동일 유저가 다른 socket으로 로그인했는지 확인 후 있다면 disconnect 처리
        const prevLogInInfo: SocketIdMap = await this.playersService.getUserByUserID(
            requestUser.userId,
        );

        if (prevLogInInfo) {
            await this.playersService.removeSocketBySocketId(
                prevLogInInfo.socketId,
                prevLogInInfo.userInfo,
            );

            const prevSockets = await this.server.in(prevLogInInfo.socketId).fetchSockets();
            if (prevSockets.length) {
                prevSockets[0].emit('error', {
                    error: {
                        errorMessage: '해당 유저가 새로운 socketId로 로그인 하였습니다.',
                        status: 409,
                        event: 'log-in',
                    },
                });
                prevSockets[0].disconnect(true);
            }
        }
        // 로그인을 요청한 유저의 socketId와 userId 정보로 socketIdMap에 맵핑
        await this.playersService.socketIdMapToLoginUser(requestUser.userId, socket.id);

        await this.playersService.createTodayResult(requestUser.userId);
        console.log('로그인 성공!');
        socket.emit('log-in', { message: '로그인 성공!' });
    }

    @SubscribeMessage('log-out')
    async socketIdMapToLogOutUser(@ConnectedSocket() socket: Socket) {
        const event = 'log-out';
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);
        // socketIdMap에서 삭제 -> Player 테이블과 Room 테이블에서 cascade
        await this.playersService.removeSocketBySocketId(socket.id, requestUser.userInfo);

        // request user가 방에 있었다면, 방 나간 후 방 업데이트 & announce
        if (requestUser.player) {
            // request user가 게임 중 자신이 발표자일 때 돌고 있는 timer 종료
            const turn: Turn = requestUser.player.room.turns.at(-1);
            if (
                turn &&
                turn.speechPlayer === requestUser.userInfo &&
                (turn.currentEvent === 'readyTime' || turn.currentEvent === 'speechTime')
            ) {
                await this.handleSpeechPlayerLeaveRoomRequest(turn, socket, Next);
            }

            // leave-room 처리
            socket.leave(`${requestUser.player.roomInfo}`);

            // 유저가 나간 뒤 방 정보 갱신
            const updateRoom: UpdateRoomDto = await this.updateRoom(requestUser.player.roomInfo);

            // 방 정보를 갱신하고, 게임 중이었다면, 다시 게임 시작
            if (updateRoom.room.isGameOn) await this.controlGameTurns(updateRoom.room, Next);

            // 업데이트 된 방 정보 announce
            await this.announceUpdateRoomInfo(updateRoom, requestUser, 'leave');
        }

        console.log('로그아웃 성공!');
        socket.emit('log-out', { message: '로그아웃 성공!' });
    }

    @SubscribeMessage('create-room')
    async handleCreateRoomRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: { data: CreateRoomRequestDto },
    ) {
        const event = 'create-room';
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);

        // 입장을 요청한 유저가 다른 방에 속해있지 않은지 확인
        if (requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, event);
        }

        // 방을 생성한 유저에게 새로 생성된 roomId 전달
        const roomId: number = await this.roomService.createRoom(data);
        socket.emit('create-room', { data: { roomId } });
    }

    @SubscribeMessage('enter-room')
    async handleEnterRoomRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data: requestRoom }: { data: EnterRoomRequestDto },
    ) {
        const event = 'enter-room';
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);

        // 1. 입장을 요청한 유저가 방에 속해있는지 확인 -> player 정보가 있으면 에러
        if (requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, event);
        }

        // 2. 입장을 요청한 유저를 방에 입장 처리
        await this.roomService.enterRoom(requestUser, requestRoom);
        socket.join(`${requestRoom.roomId}`);

        // 3. 방 정보를 업데이트
        const updateRoom: { room: Room; state: string } = await this.updateRoom(requestRoom.roomId);

        // 4. 업데이트 된 방 정보를 announce
        await this.announceUpdateRoomInfo(updateRoom, requestUser, 'enter');
    }

    @SubscribeMessage('valid-room-password')
    async handleValidRoomPassword(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data: { password, roomId } },
    ) {
        await this.socketAuthentication(socket.id, 'valid-room-password');
        await this.roomService.validateRoomPassword(password, roomId);
        //본인에게
        socket.emit('valid-room-password');
    }

    @SubscribeMessage('leave-room')
    async handleLeaveRoomEvent(@ConnectedSocket() socket: Socket, next: NextFunction) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const event = 'leave-room';
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);

        // request user가 player인지 확인 -> 아니면 에러 반환
        if (!requestUser.player) {
            throw new SocketException('잘못된 요청입니다.', 400, event);
        }

        await this.handleLeaveRoomRequest(socket, requestUser);
    }

    @SubscribeMessage('ready')
    async handleReadyEvent(@ConnectedSocket() socket: Socket) {
        const event = 'ready';
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);

        // 1. ready를 요청한 유저가 방에 속해있는지 || 방장인지 확인 -> player 정보가 없거나 방장이라면 에러
        if (!requestUser.player || requestUser.player.isHost) {
            throw new SocketException('잘못된 접근입니다.', 400, event);
        }
        // 2. ready event를 emit한 Player 정보를 업데이트
        await this.playersService.setPlayerReady(requestUser.player);

        // 3. db에서 room 정보를 조회해 player 모두 ready인지 확인
        const room: Room = await this.roomService.updateIsGameReadyToStart(
            requestUser.player.roomInfo,
        );
        // 방 안에 update room info announce
        await this.updateRoomInfoToRoom(room, requestUser, event);
    }

    @SubscribeMessage('start')
    async handleStartEvent(@ConnectedSocket() socket: Socket) {
        const event = 'start';
        const requestUser = await this.socketAuthentication(socket.id, event);
        // requestUser가 방장인지 확인
        if (!requestUser.player.isHost) {
            throw new SocketException('방장만 게임을 시작할 수 있습니다.', 400, event);
        }
        let room: Room = requestUser.player.room;

        // 1. 방 정보 갱신 -> isGameOn : true
        room = await this.roomService.updateIsGameOn(room.roomId);
        // announce to main
        await this.updateRoomListToMain();

        // gameMap[roomId] = { currentTurn: {turnNumber: , turnId}, remainingTurns : userId[](desc order), gameResultIdMap: {userId : gameResultId} }
        // TODO : gameMap interface 만들기
        this.gamesService.createGameMap(room);
        // player별 gameResult 만들기
        const gameResults: GameResult[] = await this.gamesService.createGameResultPerPlayer(
            room.roomId,
        );
        this.gamesService.mapGameResultIdWithUserId(room.roomId, gameResults);

        // 게임 시작
        await this.controlGameTurns(room, Next);

        // TODO : 게임 종료 함수 여기에서 call하기
    }

    @SubscribeMessage('send-chat')
    async sendChatRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: { data: { message: string } },
    ) {
        const event = 'send-chat';
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new SocketException('잘못된 요청입니다.', 400, event);
        }

        const currentTurn = requestUser.player.room.turns.at(-1);

        let type = 'chat';
        // room이 game상태이고, 턴의 currentEvent가 speechTime일때만 정답 처리
        if (
            requestUser.player.room.isGameOn &&
            (currentTurn.currentEvent === 'readyTime' || currentTurn.currentEvent === 'speechTime')
        ) {
            const isAnswer: boolean = this.chatService.checkAnswer(
                data.message,
                requestUser.player.room,
            );

            if (isAnswer && requestUser.userInfo === currentTurn.speechPlayer) {
                throw new SocketException(
                    '발표자는 정답을 채팅으로 알릴 수 없습니다.',
                    400,
                    'send-chat',
                );
            }

            if (currentTurn.currentEvent === 'speechTime') {
                if (isAnswer) {
                    const result: TurnResult = await this.gamesService.recordPlayerScore(
                        requestUser.player.user,
                        requestUser.player.room,
                    );
                    type = 'answer';
                    this.server.to(`${requestUser.player.roomInfo}`).emit('score', {
                        data: { userId: requestUser.userInfo, score: result.score },
                    });
                }
            }
        }
        if (type === 'answer') {
            data.message = `${requestUser.user.nickname}님이 정답을 맞추셨습니다!`;
        }
        const eventUserInfo = eventUserInfoConstructor(requestUser);
        this.server
            .to(`${requestUser.player.roomInfo}`)
            .emit('receive-chat', { data: { message: data.message, eventUserInfo, type } });
    }

    @SubscribeMessage('turn-evaluate')
    async handleTurnEvaluation(
        @ConnectedSocket() socket: Socket,
        @MessageBody()
        { data }: { data: TurnEvaluateRequestDto },
    ) {
        const event = 'turn-evaluate';
        const requestUser = await this.socketAuthentication(socket.id, event);
        const roomId = requestUser.player.roomInfo;
        this.gamesService.saveEvaluationScore(roomId, data);
    }

    @SubscribeMessage('webrtc-ice')
    async handleIce(
        @ConnectedSocket() socket: Socket,
        @MessageBody()
        { data },
    ) {
        const event = 'webrtc-ice';
        const { candidateReceiveSocketId, ice } = data;
        socket.broadcast
            .to(candidateReceiveSocketId)
            .emit(event, { data: { ice, iceSendSocketId: socket.id } });
    }

    @SubscribeMessage('webrtc-offer')
    async handleOffer(@ConnectedSocket() socket: Socket, @MessageBody() { data }) {
        const event = 'webrtc-offer';
        const { sessionDescription, offerReceiveSocketId } = data;
        socket.broadcast
            .to(offerReceiveSocketId)
            .emit(event, { data: { sessionDescription, offerSendSocketId: socket.id } });
    }

    @SubscribeMessage('webrtc-answer')
    async handleAnswer(@ConnectedSocket() socket: Socket, @MessageBody() { data }) {
        const event = 'webrtc-answer';
        const { sessionDescription, answerReceiveSocketId } = data;
        socket.broadcast
            .to(answerReceiveSocketId)
            .emit(event, { data: { sessionDescription, answerSendSocketId: socket.id } });
    }

    @SubscribeMessage('webrtc-leave')
    async handler(@ConnectedSocket() socket: Socket) {
        const event = 'webrtc-leave';
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, event);
        }
        this.server
            .to(`${requestUser.player.roomInfo}`)
            .emit(event, { data: { leaverSocketId: socket.id } });
    }

    @SubscribeMessage('update-userstream')
    async handleChangeStream(@ConnectedSocket() socket: Socket, @MessageBody() { data }) {
        const event = 'update-userstream';
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, event);
        }
        this.server.to(`${requestUser.player.roomInfo}`).emit(event, {
            data: { socketId: socket.id, video: data.video, audio: data.audio },
        });
    }

    // ###################### Authentication ##############################

    async socketAuthentication(socketId: string, event: string) {
        const requestUser: SocketIdMap = await this.playersService.getUserBySocketId(socketId);
        if (!requestUser) {
            throw new SocketException('로그인이 필요한 서비스입니다.', 403, event);
        }
        return requestUser;
    }

    // ###################### ALTER PLAYER ##############################
    // [logic] game state / player state에 따른 player leave-room request handler
    async handleLeaveRoomRequest(socket: Socket, requestUser: SocketIdMap) {
        // request user의 player 정보 삭제
        await this.RemovePlayerFromRoom(requestUser.player.roomInfo, requestUser, socket);

        // player leave 처리 후 방 정보
        const room: Room = await this.roomService.getOneRoomByRoomId(requestUser.player.roomInfo);

        // 게임 중이었다면
        if (room.isGameOn) {
            const allTurns: Turn[] = room.turns;
            // 턴 정보가 존재하고, readyTime 또는 speechTime일때
            if (
                allTurns.length &&
                (allTurns.at(-1).currentEvent === 'readyTime' ||
                    allTurns.at(-1).currentEvent === 'speechTime')
            ) {
                // request user가 speechPlayer일때 -> 타이머/턴정보 삭제 후 게임 로직 재시작
                if (allTurns.at(-1).speechPlayer === requestUser.userInfo) {
                    await this.handleSpeechPlayerLeaveRoomRequest(allTurns.at(-1), socket, Next);

                    // speechPlayer가 나간 후 게임 종료 상황 처리
                    if (room.players.length === allTurns.length || room.players.length < 2) {
                        return await this.handleEndGameByPlayerLeaveEvent(room, Next);
                    }

                    // 남은 플레이어들이 게임을 계속 이어가는 상황 처리
                    await this.controlGameTurns(room, Next);
                }
                // request user가 나간 후 게임 종료 상황 -> 타이머/턴정보 삭제 후 게임 종료
                if (room.players.length === allTurns.length || room.players.length < 2) {
                    return await this.handleEndGameByPlayerLeaveEvent(room, Next);
                }
            }
        }

        // 유저가 나간 뒤 방의 정보 갱신
        const updateRoom: UpdateRoomDto = await this.updateRoom(requestUser.player.roomInfo);

        // 업데이트 된 방 정보 announce
        await this.announceUpdateRoomInfo(updateRoom, requestUser, 'leave');
    }

    async RemovePlayerFromRoom(roomId: number, requestUser: SocketIdMap | null, socket: Socket) {
        // request user를 leave처리
        socket.leave(`${roomId}`);
        // request user를 player 테이블에서 삭제(leave-room 이벤트에만 해당)
        if (requestUser) await this.playersService.removePlayerByUserId(requestUser.userInfo);
    }

    async updateHostPlayer(updateRoom: Room) {
        // updateRoom.players[0]번째 player를 방장으로 갱신
        const newHostPlayer = {
            userInfo: updateRoom.players[0].userInfo,
            isHost: true,
        };
        await this.playersService.updatePlayerStatusByUserId(newHostPlayer);
        return false;
    }

    // ###################### ALTER ROOM ###########################

    // [logic] update room while isGameOn is false
    // enter/leave/log-out/disconnect 이벤트 발생시 방 상태 업데이트 로직
    async updateRoom(roomId: number): Promise<UpdateRoomDto> {
        const room: Room = await this.roomService.getOneRoomByRoomId(roomId);
        // 1. 방에 player가 없다면 방 폭파 -> 폭파한 방의 id 리턴
        if (!room.players.length) {
            await this.roomService.removeRoomByRoomId(roomId);
            return { room, state: 'deleted' };
        }
        // 2. players list의 첫번째 player가 호스트가 아니라면, 호스트 처리
        if (!room.players[0].isHost) {
            await this.updateHostPlayer(room);
        }
        // 3. 방 안에 남은 Player의 ready 상태를 검사해 isGameReadyToStart 트리거
        const updateRoom = await this.roomService.updateIsGameReadyToStart(room.roomId);
        return { room: updateRoom, state: 'updated' };
    }

    //

    // ###################### update Room announcement #######################

    // [logic] 방 정보가 업데이트 되는 여러 이벤트 발생시 room announcement 처리
    async announceUpdateRoomInfo(
        roomUpdate: UpdateRoomDto,
        requestUser: SocketIdMap | null,
        event: string,
    ) {
        if (event === 'game-end') {
            console.log('game-end announcement');
        }
        // updateRoom announce 처리
        if (roomUpdate.state === 'updated') {
            console.log('update state');

            this.updateRoomInfoToRoom(roomUpdate.room, requestUser, event);
        }
        await this.updateRoomListToMain();
    }

    // 업데이트된 방의 정보를 해당 방의 player에게 announce
    updateRoomInfoToRoom(room: Room, requestUser: SocketIdMap | null, event: string) {
        const eventUserInfo: EventUserInfoDto | null = eventUserInfoConstructor(requestUser);
        const updateRoom: RoomInfoToRoomDto = updateRoomInfoConstructor(room);
        this.server.to(`${updateRoom.roomId}`).emit('update-room', {
            data: { room: updateRoom, eventUserInfo, event },
        });
    }

    // main페이지에 있는 유저에게 room의 갱신 정보 announce
    async updateRoomListToMain() {
        // main space에 room-list event emit -> !!!namespace 설정하기!!!
        const roomList: RoomInfoToMainDto[] = await this.roomService.getAllRoomList();
        const roomIdList: string[] = (() => {
            return roomList.map((room) => {
                return `${room.roomId}`;
            });
        })();
        this.server.except(roomIdList).emit('room-list', { data: roomList });
    }

    // ############################## Game ###################################
    // [logic] game controller (게임 시작 ~ 게임 종료 컨트롤
    // !!!!!! TODO : game 중 변경이 발생하면 바로바로 gameMap에 같이 반영되도록 수정!!!!!
    async controlGameTurns(room: Room): Promise<void> {
        // 게임 방 인원 체크
        this.emitCannotStartError(room.roomId);

        // startCount 트리거
        await this.controlTurnTimer(room, 'startCount');

        // remainingSpeeches만큼 턴을 반복
        while (gameMap[room.roomId].remainingSpeeches.length) {
            // create turn -> createTurnMap & updateGameMapCurrentTurn 포함
            let turn: Turn = await this.gamesService.createTurn(room.roomId);

            // readyTimer 시작
            await this.controlTurnTimer(room, 'readyTime', turn);
            // speechTimer 시작
            await this.controlTurnTimer(room, 'speechTime', turn);
            // discussionTimer시작
            await this.controlTurnTimer(room, 'discussionTime', turn);

            // 턴 종료 -> 발표자 최종 점수 처리 & 룸 정보 최신화
            await this.emitSpeechPlayerScoreEvent(room.roomId, turn);
            room = await this.roomService.getOneRoomByRoomId(room.roomId);
        }
        // TODO : 게임 종료 로직은 게임 컨트롤러로 이동!!
        // 현재 턴이 마지막 턴이라면, 게임 종료 처리
        room = await this.gamesService.handleGameEndEvent(room);
        this.announceUpdateRoomInfo({ room, state: 'update' }, null, 'game-end');
    }

    // [Logic] turn controller (턴 시작 ~ 턴 종료 컨트롤, turn event별 처리)
    // TODO : controlTurnTimer에서는 딱 한 턴을 수행하는 타이머를 만들고 실행하는 역할로 한정하고 정리 하기
    async controlTurnTimer(room: Room, eventName: string, turn?: Turn): Promise<void> {
        const roomId = room.roomId;
        const timer = eventName === 'startCount' ? 5000 : room[eventName];
        const event = eventName === 'startCount' ? eventName : `${eventName}r`;

        // 턴이 시작 전 player 수 충족하는지 검사
        this.emitCannotStartError(roomId);

        // update turn currentTime
        if (event != 'startCount') turn = await this.gamesService.updateTurn(turn, eventName);

        // game-info event 처리
        if (event === 'readyTimer') {
            this.emitGameInfo(turn, roomId);
        }

        // time-start event 처리
        this.emitTimeStartEvent(roomId, turn.turn, timer, event);
        // time-start 후 event 별 timer 생성
        await this.gamesService.createTimer(timer, roomId);
        // time-end event 처리
        this.emitTimeEndEvent(roomId, timer, event, turn);
        return;
    }

    // TODO : 게임 중 탈주자 처리 로직 수정할 것!!! (깃헙 이슈 확인!!)

    // [logic] 발표자가 퇴장한 경우,
    async handleSpeechPlayerLeaveRoomRequest(turn: Turn, socket: Socket, next: NextFunction) {
        try {
            gameTimerMap[turn.roomInfo].ac.abort();
        } catch (err) {
            next();
        }
        // 방안에 남은 player에게 에러 메세지 emit
        socket.to(`${turn.roomInfo}`).emit('error', {
            error: {
                errorMessage: '발표자가 나갔어요!',
                status: 400,
                event: 'leave-game',
            },
        });
        // 탈주범의 turn 데이터 & timer 정보 삭제
        await this.gamesService.deleteTurnByTurnId(turn);
    }

    // [logic] 게임 중 플레이어가 퇴장하여 게임을 종료해야 하는 경우
    async handleEndGameByPlayerLeaveEvent(room: Room, next: NextFunction) {
        try {
            gameTimerMap[room.roomId].ac.abort();
        } catch (err) {
            next();
        }
        room = await this.gamesService.handleGameEndEvent(room);
        return this.announceUpdateRoomInfo({ room, state: 'updated' }, null, 'game-end');
    }

    // emit events
    emitCannotStartError(roomId: number) {
        if (gameMap[roomId].currentPlayers < 2) {
            this.server.to(`${roomId}`).emit('error', {
                errorMessage: '게임을 시작할 수 없습니다.',
                status: 400,
                event: 'game',
            });
            throw new SocketException('게임을 시작할 수 없습니다.', 400, 'game');
        }
    }

    emitGameInfo(turn: Turn, roomId: number) {
        const turnInfo = {
            currentTurn: turn.turn,
            speechPlayer: turn.speechPlayer,
            keyword: turn.keyword,
            hint: turn.hint,
        };
        this.server.to(`${roomId}`).emit('game-info', { data: turnInfo });
    }

    emitTimeStartEvent(roomId: number, currentTurn: number, timer: string, event: string) {
        this.server.to(`${roomId}`).emit('time-start', {
            data: {
                currentTurn,
                timer,
                event,
            },
        });
    }

    async emitSpeechPlayerScoreEvent(roomId: number, turn: Turn) {
        // 해당 턴 발표자의 turnResult 생성
        const turnResult = await this.gamesService.recordSpeechPlayerScore(roomId, turn);
        // 해당턴 발표자의 합산 점수 emit
        this.server
            .to(`${roomId}`)
            .emit('score', { data: { userId: turn.speechPlayer, score: turnResult.score } });
    }

    emitTimeEndEvent(roomId: number, timer: number, event: string, turn?: Turn) {
        let nextTurn: number;
        let key = 'currentTurn';
        if (event === 'discussionTimer') {
            nextTurn = gameMap[roomId].remainingTurns.length ? turn.turn + 1 : 0;
            key = 'nextTurn';
        }

        const data = {
            // key 값이 current vs next인지에 따라 정보 입력
            // startCount일때는 turn 정보가 없으므로, 1을 입력
            [key]: key === 'currentTurn' ? (turn ? turn.turn : 1) : nextTurn,
            timer,
            event,
        };

        this.server.to(`${roomId}`).emit('time-end', { data });
    }
}
