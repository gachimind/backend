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
import { RoomService } from './room.service';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.request.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import {
    SocketException,
    SocketExceptionFilter,
} from 'src/common/exceptionFilters/ws-exception.filter';
import { PlayersService } from './players.service';
import { RoomInfoToRoomDto } from './dto/roomInfoToRoom.dto';
import { AuthorizationRequestDto } from 'src/users/dto/authorization.dto';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { eventUserInfoConstructor } from './util/event.user.info.constructor';
import { EventUserInfoDto } from './dto/evnet-user.info.dto';
import { ChatService } from './chat.service';
import { UseFilters } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { updateRoomInfoConstructor } from './util/update-room.info.constructor';
import { UpdateRoomDto } from './dto/update-room.dto';
import { GamesService } from './games.service';

@UseFilters(SocketExceptionFilter)
@WebSocketGateway()
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
        await this.playersService.removeSocketBySocketId(socket.id);

        // request user가 방에 있었다면, 방 나간 후 방 업데이트 & announce
        if (requestUser.player) {
            // 유저가 나간 뒤 방 정보 갱신
            const updateRoom: { room: Room; state: string } = await this.updateRoom(
                requestUser.player.roomInfo,
            );
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
        // 토큰을 가지고 유저 정보를 얻어서 SocketIdMap에 추가
        await this.playersService.socketIdMapToLoginUser(token, socket.id);
        console.log('로그인 성공!');
        socket.emit('log-in', { message: '로그인 성공!' });
    }

    @SubscribeMessage('log-out')
    async socketIdMapToLogOutUser(@ConnectedSocket() socket: Socket) {
        const event = 'log-out';
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);
        // socketIdMap에서 삭제 -> Player 테이블과 Room 테이블에서 cascade
        await this.playersService.removeSocketBySocketId(socket.id);

        // request user가 방에 있었다면, 방 나간 후 방 업데이트 & announce
        if (requestUser.player) {
            // 유저가 나간 뒤 방 정보 갱신
            const updateRoom: UpdateRoomDto = await this.updateRoom(requestUser.player.roomInfo);
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

        // main space에 room list를 업데이트
        await this.updateRoomListToMain();
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
        await this.roomService.validateRoomPassword(password, roomId);
        //본인에게
        socket.emit('valid-room-password');
    }

    @SubscribeMessage('leave-room')
    async handleLeaveRoomEvent(@ConnectedSocket() socket: Socket) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const event = 'leave-room';
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);

        // request user가 player인지 확인 -> 아니면 에러 반환
        if (!requestUser.player) {
            throw new SocketException('잘못된 요청입니다.', 400, event);
        }
        // request user의 player 정보 삭제
        await this.RemovePlayerFormRoom(requestUser, socket);

        // 유저가 나간 뒤 방 정보 갱신
        const updateRoom: UpdateRoomDto = await this.updateRoom(requestUser.player.roomInfo);

        // 업데이트 된 방 정보 announce
        await this.announceUpdateRoomInfo(updateRoom, requestUser, 'leave');
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
        await this.updateRoomInfoToRoom(requestUser, room, event);
    }

    @SubscribeMessage('start')
    async handleStartEvent(@ConnectedSocket() socket: Socket) {
        const event = 'start';
        const requestUser = await this.socketAuthentication(socket.id, event);
        // requestUser가 방장인지 확인
        if (!requestUser.player.isHost) {
            throw new SocketException('방장만 게임을 시작할 수 있습니다.', 400, event);
        }
        const room: Room = requestUser.player.room;

        //room에 있는 players 배열을 사용해 turn 정보 만들어 주기
        await this.gamesService.updateTurn(room.roomId);

        // setInterval? -> 타이머 발동
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
        if (requestUser.player.room.isGameOn) {
            // answer 검사 로직 여기에 구현
            type = 'answer';
        }

        const eventUserInfo = eventUserInfoConstructor(requestUser);
        this.server
            .to(`${requestUser.player.roomInfo}`)
            .emit('receive-chat', { data: { message: data.message, eventUserInfo, type } });
    }

    @SubscribeMessage('webrtc-ice')
    async handleIce(
        @ConnectedSocket() socket: Socket,
        @MessageBody()
        { data },
    ) {
        const event = 'webrtc-ice';
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, event);
        }
        const { candidateReceiveSocketId, ice } = data;
        socket.broadcast
            .to(candidateReceiveSocketId)
            .emit(event, { data: { ice, iceSendSocketId: socket.id } });
    }

    @SubscribeMessage('webrtc-offer')
    async handleOffer(@ConnectedSocket() socket: Socket, @MessageBody() { data }) {
        const event = 'webrtc-offer';
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, event);
        }
        const { sessionDescription, offerReceiveSocketId } = data;
        socket.broadcast
            .to(offerReceiveSocketId)
            .emit(event, { data: { sessionDescription, offerSendSocketId: socket.id } });
    }

    @SubscribeMessage('webrtc-answer')
    async handleAnswer(@ConnectedSocket() socket: Socket, @MessageBody() { data }) {
        const event = 'webrtc-answer';
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, event);
        }
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

    async RemovePlayerFormRoom(requestUser: SocketIdMap, socket: Socket) {
        // request user를 leave처리
        socket.leave(`${requestUser.player.roomInfo}`);
        // request user를 player 테이블에서 삭제
        await this.playersService.removePlayerByUserId(requestUser.userInfo);
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

    // ###################### update Room announcement #######################

    // [logic] enter/leave/log-out/disconnect 이벤트 발생시 room announcement 처리
    async announceUpdateRoomInfo(
        roomUpdate: UpdateRoomDto,
        requestUser: SocketIdMap,
        event: string,
    ) {
        // updateRoom announce 처리
        if (roomUpdate.state === 'updated') {
            await this.updateRoomInfoToRoom(requestUser, roomUpdate.room, event);
        }
        await this.updateRoomListToMain();
    }

    // 업데이트된 방의 정보를 해당 방의 player에게 announce
    async updateRoomInfoToRoom(requestUser: SocketIdMap, room: Room, event: string) {
        const eventUserInfo: EventUserInfoDto = eventUserInfoConstructor(requestUser);
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
}
