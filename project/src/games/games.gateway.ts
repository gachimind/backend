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
import { ChatService } from './chat.service';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.request.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import { LoginUserToSocketIdMapDto } from './dto/socketId-map.request.dto';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { PlayersService } from './players.service';
import { RoomInfoToRoomDto } from './dto/roomInfoToRoom.dto';
import { AuthorizationRequestDto } from 'src/users/dto/authorization.dto';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { Room } from './entities/room.entity';
import { eventUserInfoConstructor } from './util/event.user.info.constructor';
import { EventUserInfoDto } from './dto/evnet-user.info.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly roomService: RoomService,
        private readonly chatService: ChatService,
        private readonly playersService: PlayersService,
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
        // 접속이 종료된 회원의 정보를 socketIdMap에서 삭제
        await this.playersService.removeSocketBySocketId(socket.id);
        console.log('disconnected socket', socket.id);
    }

    @SubscribeMessage('log-in')
    async socketIdMapToLoginUser(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: { data: AuthorizationRequestDto },
    ) {
        const token = data.authorization;

        if (!token) {
            throw new SocketException('잘못된 접근입니다.', 401, 'log-in');
        }

        // 토큰 값이 유효한지는 service 레이어에서 db를 조회해서 검사
        await this.playersService.socketIdMapToLoginUser(token, socket.id);
        console.log('로그인 성공!');

        socket.emit('log-in', { message: '로그인 성공!' });
    }

    @SubscribeMessage('log-out')
    async socketIdMapToLogOutUser(@ConnectedSocket() socket: Socket) {
        this.socketAuthentication(socket);

        // 방에서 로그아웃 한 경우 leaveroom event 재사용
        this.handleLeaveRoomEvent(socket);

        // socketIdMap에서 삭제 -> Player 테이블과 Room 테이블에서 cascade
        await this.playersService.removeSocketBySocketId(socket.id);

        console.log('로그아웃 성공!');
        socket.emit('log-out', { message: '로그아웃 성공!' });
    }

    @SubscribeMessage('create-room')
    async handleCreateRoomRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: { data: CreateRoomRequestDto },
    ) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: SocketIdMap = await this.socketAuthentication(socket);

        // 입장을 요청한 유저가 다른 방에 속해있지 않은지 확인
        if (requestUser.playerInfo) {
            throw new SocketException('잘못된 접근입니다.', 400, 'enter-room');
        }

        // 방을 생성한 유저에게 새로 생성된 roomId 전달
        const roomId: number | void = await this.roomService.createRoom(data);
        console.log(roomId);
        socket.emit('create-room', { data: { roomId } });

        // main space에 room list를 업데이트
        const updateRoomList: RoomInfoToMainDto[] = await this.roomService.getAllRoomList();
        // !!! namespce 설정해줘야 함!!!
        this.server.emit('room-list', { data: updateRoomList });
    }

    @SubscribeMessage('enter-room')
    async handleEnterRoomRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data: requestRoom }: { data: EnterRoomRequestDto },
    ) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: SocketIdMap = await this.socketAuthentication(socket);

        // 1. 입장을 요청한 유저가 다른 방에 속해있지 않은지 확인
        if (requestUser.playerInfo) {
            throw new SocketException('잘못된 접근입니다.', 400, 'enter-room');
        }

        // 2. 입장을 요청한 유저를 방에 입장 처리
        await this.roomService.enterRoom(requestUser, requestRoom);
        socket.join(`${requestRoom.roomId}`);

        await this.updateRoomAnnouncement(requestUser, requestRoom, 'enter');
    }

    @SubscribeMessage('leave-room')
    async handleLeaveRoomEvent(@ConnectedSocket() socket: Socket) {
        console.log('!!!leave room request!!!');

        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: SocketIdMap = await this.socketAuthentication(socket);
        if (!requestUser.playerInfo) {
            console.log('palyerInfo 없음');

            throw new SocketException('잘못된 요청입니다.', 400, 'leave-room');
        }
        console.log('leave room, roomInfo', requestUser.playerInfo.roomInfo);

        // request user를 leave처리
        socket.leave(`${requestUser.playerInfo.roomInfo.roomId}`);

        // request user를 player 테이블에서 삭제
        await this.playersService.removePlayerByUserId(requestUser.userInfo.userId);

        await this.updateRoomAnnouncement(requestUser, requestUser.playerInfo.roomInfo, 'leave');
    }

    @SubscribeMessage('send-chat')
    async sendChatRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: { data: { message: string } },
    ) {
        const requestUser: SocketIdMap = await this.socketAuthentication(socket);
        const eventUserInfo = eventUserInfoConstructor(requestUser);

        this.server.to(`${requestUser.playerInfo.roomInfo.roomId}`).emit('receive-chat', {
            data: { message: data.message, eventUserInfo },
        });
    }

    async socketAuthentication(socket: Socket) {
        const requestUser: SocketIdMap = await this.playersService.getUserBySocketId({
            socketId: socket.id,
        });
        if (!requestUser) {
            throw new SocketException('로그인이 필요한 서비스입니다.', 403, 'create-room');
        }
        return requestUser;
    }

    async updateRoomAnnouncement(requestUser, requestRoom, event) {
        // game room 안의 사람들에게 update-room event emit -> !!!namespace 설정하기!!!
        console.log('!!!update room announcement!!!');

        console.log(requestUser, requestRoom);

        const updateRoomInfo: RoomInfoToRoomDto = await this.roomService.updateRoomInfoToRoom(
            requestRoom.roomId,
        );
        const eventUserInfo: EventUserInfoDto = eventUserInfoConstructor(requestUser);
        this.server.to(`${requestRoom.roomId}`).emit('update-room', {
            data: { room: updateRoomInfo, eventUserInfo, event },
        });

        // main space에 room-list event emit -> !!!namespace 설정하기!!!
        const roomInfoList = await this.roomService.getAllRoomList();
        this.server.except(`${requestRoom.roomId}`).emit('room-list', { data: roomInfoList });
    }
}
