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
import { Server, Socket, RemoteSocket } from 'socket.io';
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
import { GameResult } from './entities/gameResult.entity';
import { gameMap } from './util/game.map';

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
            await this.handleLeaveRoomRequest(socket, requestUser);
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
            const prevSockets: RemoteSocket<any, any>[] = await this.server
                .in(prevLogInInfo.socketId)
                .fetchSockets();
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
            await this.handleLeaveRoomRequest(socket, requestUser);
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
        const updateRoom: UpdateRoomDto = await this.updateRoomAfterEnterOrLeave(
            requestRoom.roomId,
        );

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
    async handleLeaveRoomEvent(@ConnectedSocket() socket: Socket) {
        const event = 'leave-room';
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);

        // request user가 player인지 확인 -> 아니면 에러 반환
        if (!requestUser.player) {
            throw new SocketException('잘못된 요청입니다.', 400, event);
        }

        return await this.handleLeaveRoomRequest(socket, requestUser);
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

        // 게임 정보 매핑
        // TODO : gameMap interface 만들기
        await this.gamesService.createGameMap(room);
        // player별 gameResult 만들기
        const gameResults: GameResult[] = await this.gamesService.createGameResultPerPlayer(
            room.roomId,
        );
        await this.gamesService.mapGameResultIdWithUserId(room.roomId, gameResults);

        // 게임 시작
        room = await this.controlGameTurns(room);

        // 모든 턴이 종료되면 게임 종료 처리
        room = await this.gamesService.handleGameEndEvent(room);

        this.announceUpdateRoomInfo({ room, state: 'updated' }, null, 'game-end');
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

        let type = 'chat';
        const room: Room = requestUser.player.room;
        const turn = room.turns.at(-1);

        // room이 game상태일때만 정답 검사
        if (room.isGameOn && turn) {
            const isAnswer: boolean = this.chatService.FilterAnswer(
                turn,
                requestUser.userInfo,
                data.message,
            );

            if (isAnswer && requestUser.player.userInfo != turn.speechPlayer) {
                type = 'answer';
                const turnResult: TurnResult = await this.gamesService.recordPlayerScore(
                    requestUser.userInfo,
                    room,
                );
                this.emitScoreEvent(room.roomId, requestUser.userInfo, turnResult.score);
                data.message = `${requestUser.user.nickname}님이 정답을 맞추셨습니다!`;
            }
        }

        return this.emitReceiveChatEvent(room.roomId, requestUser, data.message, type);
    }

    @SubscribeMessage('turn-evaluate')
    async handleTurnEvaluation(
        @ConnectedSocket() socket: Socket,
        @MessageBody()
        { data }: { data: TurnEvaluateRequestDto },
    ) {
        const event = 'turn-evaluate';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new SocketException('잘못된 요청입니다.', 400, event);
        }
        if (requestUser.player.room.turns.at(-1).currentEvent !== 'discussionTime') {
            throw new SocketException('지금은 발표자를 평가할 수 없습니다.', 400, event);
        }
        const score = this.gamesService.updateTurnMapSpeechScore(
            requestUser.player.roomInfo,
            data.score,
        );
        const speechPlayerId = requestUser.player.room.turns.at(-1).speechPlayer;
        this.emitScoreEvent(requestUser.player.roomInfo, speechPlayerId, score);
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
        const roomId = requestUser.player.roomInfo;

        // 1. player leave 처리
        await this.RemovePlayerFromRoom(requestUser.player.roomInfo, requestUser, socket);

        // [공통] 나간 플레이어 leave 이벤트 emit 처리
        const updateRoom: UpdateRoomDto = await this.updateRoomAfterEnterOrLeave(roomId);
        this.announceUpdateRoomInfo(updateRoom, requestUser, 'leave');

        // 1) 게임 중이라면 -> 턴 종료? -> 게임 지속? or 게임 종료?
        if (requestUser.player.room.isGameOn) {
            // [공통] Map 데이터 갱신
            await this.gamesService.removePlayerFromGameMapRemainingTurns(
                roomId,
                requestUser.userInfo,
            );
            this.gamesService.reduceGameMapCurrentPlayers(roomId);

            if (
                this.gamesService.getGameMapKeywordsCount(roomId) >
                this.gamesService.getGameMapRemainingTurns(roomId)
            ) {
                this.gamesService.popGameMapKeywords(roomId);
            }
            // 발표자가 발표 타임에 나간 경우 : 턴 종료 -> 게임 종료?
            const turn = requestUser.player.room.turns.at(-1);
            if (
                turn &&
                requestUser.player.userInfo === turn.speechPlayer &&
                (turn.currentEvent === 'readyTime' || turn.currentEvent === 'speechTime')
            ) {
                // 턴 종료 처리(타이머/턴 삭제, error 에밋)
                await this.handleEndTurnBySpeechPlayerLeaveEvent(turn, socket);
                // 발표자가 나가고 남은 인원 1명이면 게임 종료
                if (this.gamesService.getGameMapCurrentPlayers(roomId) === 1) {
                    this.emitCannotStartError(roomId);
                    const room = await this.gamesService.handleGameEndEvent(
                        requestUser.player.room,
                    );
                    return this.announceUpdateRoomInfo(
                        { room, state: 'updated' },
                        null,
                        'game-end',
                    );
                }
                // 다음 턴을 생성하여 게임을 지속
                return this.controlGameTurns(updateRoom.room);
            }

            // 발표 타임이 아닐때 발표자가 나가거나, 참여자가 나간 경우 : 게임 종료?
            if (this.gamesService.getGameMapCurrentPlayers(roomId) === 1) {
                // 턴 중 requestUser가 나감으로 게임이 종료됐다면, 남아있던 발표자의 점수 올리기
                if (turn && turn.speechPlayer === requestUser.userInfo) {
                    await this.gamesService.createSpeechPlayerTurnResult(roomId, turn);
                }
                // 게임 종료 처리
                await this.handleEndGameByPlayerLeaveEvent(requestUser.player.room);
            }
        }
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
    async updateRoomAfterEnterOrLeave(roomId: number): Promise<UpdateRoomDto> {
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
        // updateRoom announce 처리
        if (roomUpdate.state === 'updated') {
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
    async controlGameTurns(room: Room): Promise<Room> {
        // startCount 트리거

        await this.controlTurnTimer(room, 'startCount');

        // remainingTurns만큼 턴을 반복
        while (gameMap[room.roomId].remainingTurns.length) {
            // create turn -> createTurnMap 포함
            // 턴 생성 전, 방 안에 남은 인원 검사 -> 1명이면 throw error로 게임 진행 막기
            this.throwCannotStartError(room.roomId);
            let turn = await this.gamesService.createTurn(room.roomId);

            // readyTimer 시작
            await this.controlTurnTimer(room, 'readyTime', turn);

            // speechTimer 시작
            await this.controlTurnTimer(room, 'speechTime', turn);
            // discussionTime 시작 전 발표자 평가할 플레이어 수 기록
            await this.gamesService.updateTurnMapNumberOfEvaluators(room.roomId);

            // discussionTimer시작
            await this.controlTurnTimer(room, 'discussionTime', turn);

            // 턴 종료 -> 룸 정보 최신화
            room = await this.roomService.getOneRoomByRoomId(room.roomId);
        }
        return room;
    }

    // [Logic] turn controller (턴 시작 ~ 턴 종료 컨트롤, turn event별 처리)
    async controlTurnTimer(room: Room, eventName: string, turn?: Turn): Promise<void> {
        const roomId = room.roomId;
        const timer = eventName === 'startCount' ? 5000 : room[eventName];
        const event = eventName === 'startCount' ? eventName : `${eventName}r`;

        // 매 이벤트 타이머 트리거 전 방 인원 체크 -> 2명 미만이면 throw SocketException
        this.throwCannotStartError(room.roomId);

        // update turn currentTime
        if (event != 'startCount') turn = await this.gamesService.updateTurn(turn, eventName);

        // game-info event 처리
        if (event === 'readyTimer') {
            this.emitGameInfo(turn, roomId);
        }

        const currentTurn = event === 'startCount' ? null : turn.turn;
        // time-start event 처리
        this.emitTimeStartEvent(roomId, timer, event, currentTurn);
        // time-start 후 event 별 timer 생성
        await this.gamesService.createTimer(timer, roomId);

        // 발표자의 추가 점수 처리
        if (event === 'discussionTimer') {
            const extraScore: number = await this.gamesService.createSpeechPlayerTurnResult(
                roomId,
                turn,
            );
            this.emitScoreEvent(roomId, turn.speechPlayer, extraScore);
        }
        // time-end event 처리
        this.emitTimeEndEvent(roomId, timer, event, currentTurn);
        return;
    }

    // TODO : 게임 중 탈주자 처리 로직 수정할 것!!! (깃헙 이슈 확인!!)
    // [logic] 발표자가 퇴장한 경우,
    async handleEndTurnBySpeechPlayerLeaveEvent(turn: Turn, socket: Socket) {
        this.gamesService.breakTimer(turn.roomInfo, Next);
        // 방안에 남은 player에게 에러 메세지 emit
        socket.to(`${turn.roomInfo}`).emit('error', {
            error: {
                errorMessage: '발표자가 나갔어요!',
                status: 400,
                event: 'leave-game',
            },
        });
        // 탈주범의 turn 데이터 & timer 정보 삭제
        await this.gamesService.deleteTurnByTurnId(turn.turnId);
    }

    // [logic] 게임 중 플레이어가 퇴장하여 게임을 종료해야 하는 경우
    async handleEndGameByPlayerLeaveEvent(room: Room) {
        this.emitCannotStartError(room.roomId);
        room = await this.gamesService.handleGameEndEvent(room);
        const updateRoom: UpdateRoomDto = await this.updateRoomAfterEnterOrLeave(room.roomId);
        return this.announceUpdateRoomInfo(updateRoom, null, 'game-end');
    }

    // emit events
    emitCannotStartError(roomId: number) {
        if (gameMap[roomId].currentPlayers < 2) {
            this.gamesService.breakTimer(roomId, Next);
            this.server.to(`${roomId}`).emit('error', {
                errorMessage: '게임을 시작할 수 없습니다.',
                status: 400,
                event: 'game',
            });
            // throw new SocketException('게임을 시작할 수 없습니다.', 400, 'game');
        }
    }

    throwCannotStartError(roomId: number) {
        if (gameMap[roomId].currentPlayers < 2) {
            this.gamesService.breakTimer(roomId, Next);
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

    emitTimeStartEvent(roomId: number, timer: number, event: string, turn?: number) {
        this.server.to(`${roomId}`).emit('time-start', {
            data: {
                currentTurn: turn ? turn : 1,
                timer,
                event,
            },
        });
    }

    async emitScoreEvent(roomId: number, userId: number, score: number) {
        this.server.to(`${roomId}`).emit('score', { data: { userId, score } });
    }

    emitTimeEndEvent(roomId: number, timer: number, event: string, turn?: number) {
        let key = 'currentTurn';
        if (event === 'discussionTimer') {
            turn = gameMap[roomId].remainingTurns.length ? turn + 1 : 0;
            key = 'nextTurn';
        }

        const data = {
            // [key] = currentTurn or nextTurn
            // startCount일때는 turn 정보가 없으므로, 1을 입력
            [key]: turn || turn === 0 ? turn : 1,
            timer,
            event,
        };

        this.server.to(`${roomId}`).emit('time-end', { data });
    }

    // ######################## CHAT ##################################
    emitReceiveChatEvent(roomId: number, requestUser: SocketIdMap, message: string, type: string) {
        const eventUserInfo: EventUserInfoDto = eventUserInfoConstructor(requestUser);
        this.server
            .to(`${roomId}`)
            .emit('receive-chat', { data: { message, eventUserInfo, type } });
    }
}
