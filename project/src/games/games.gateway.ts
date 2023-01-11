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
import { UseInterceptors } from '@nestjs/common';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { ResultToDataInterceptor } from 'src/common/interceptors/resultToData.interceptor';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import { LoginUserToSocketDto } from '../users/dto/login-user.dto';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { InGameUsersService, socketIdMap } from './inGame-users.service';
import { RoomInfoToRoomDto } from './dto/roomInfoToRoom.dto';

// @UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly roomService: RoomService,
        private readonly chatService: ChatService,
        private readonly inGameUsersService: InGameUsersService,
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
        await this.inGameUsersService.handleDisconnect(socket);
        console.log('disconnected socket', socket.id);
    }

    @SubscribeMessage('log-in')
    async socketIdMapToLoginUser(@ConnectedSocket() socket: Socket, @MessageBody() { data }: any) {
        // !!authGuard 만들어서 붙여야 함!!! -> 토큰을 들고 있는지만 검사 & 토큰 validation은 별도로!!
        if (!data.authorization) {
            socket.emit('log-in', { errorMessage: '잘못된 접근입니다.', status: 401 });
            throw new SocketException('잘못된 접근입니다.', 401, 'log-in');
        }
        const token: string = data.authorization;

        // 토큰 값이 유효한지는 service 레이어에서 db를 조회해서 검사
        await this.inGameUsersService.socketIdMapToLoginUser(token, socket);
        console.log('로그인 성공!');
        socket.emit('log-in', { message: '로그인 성공!' });
    }

    @SubscribeMessage('log-out')
    async socketIdMapToLogOutUser(@ConnectedSocket() socket: Socket) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: LoginUserToSocketDto = socketIdMap[socket.id];
        if (!requestUser) {
            socket.emit('leave-room', {
                errorMessage: '로그인이 필요한 서비스입니다.',
                status: 401,
            });
            throw new SocketException('로그인이 필요한 서비스입니다.', 403, 'leave-room');
        }

        // 방에서 로그아웃 한 경우, room update
        if (requestUser.currentRoom) {
            const updateRoomInfo: RoomInfoToRoomDto | any = await this.roomService.leaveRoom(
                requestUser,
            );
            // request user를 leave처리
            socket.leave(`${updateRoomInfo.roomId}`);
            // game room 안의 사람들에게 update-room event emit -> !!!namespace 설정하기!!!
            this.server
                .to(`${updateRoomInfo.roomId}`)
                .emit('update-room', { data: updateRoomInfo });
            // main space에 room-list event emit -> !!!namespace 설정하기!!!
            const data: RoomInfoToMainDto[] = await this.roomService.getAllRoomList();
            this.server.except(`${updateRoomInfo.roomId}`).emit('room-list', { data });
        }

        // socketIdMap에서 삭제
        await this.inGameUsersService.socketIdMapToLogOutUser(socket);
        console.log('로그아웃 성공!');
        socket.emit('log-out', { message: '로그아웃 성공!' });
    }

    @SubscribeMessage('create-room')
    async handleCreateRoomRequest(@ConnectedSocket() socket: Socket, @MessageBody() { data }: any) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: LoginUserToSocketDto = socketIdMap[socket.id];
        if (!requestUser) {
            socket.emit('create-room', {
                errorMessage: '로그인이 필요한 서비스입니다.',
                status: 401,
            });
            throw new SocketException('로그인이 필요한 서비스입니다.', 403, 'create-room');
        }
        // 방을 생성한 유저에게 새로 생성된 roomId 전달
        const newRoomId = await this.roomService.createRoom(data);
        socket.emit('create-room', { data: { roomId: newRoomId } });

        // main space에 room list를 업데이트
        const updateRoomList: RoomInfoToMainDto[] = await this.roomService.getAllRoomList();
        // !!! namespce 설정해줘야 함!!!
        this.server.emit('room-list', { data: updateRoomList });
    }

    @SubscribeMessage('enter-room')
    async handleEnterRoomRequest(@ConnectedSocket() socket: Socket, @MessageBody() { data }: any) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: LoginUserToSocketDto = socketIdMap[socket.id];
        if (!requestUser) {
            socket.emit('enter-room', {
                errorMessage: '로그인이 필요한 서비스입니다.',
                status: 401,
            });
            throw new SocketException('로그인이 필요한 서비스입니다.', 403, 'enter-room');
        }

        // 1. 입장을 요청한 유저가 다른 방에 속해있지 않은지 확인
        if (requestUser.currentRoom) {
            socket.emit('enter-room', {
                errorMessage: '잘못된 접근입니다.',
                status: 400,
            });
            throw new SocketException('잘못된 접근입니다.', 400, 'enter-room');
        }

        // 2. 입장을 요청한 방이 참가 가능한 상태인지 확인
        const requestRoom: EnterRoomRequestDto = data;
        const isRoomAvailable = await this.roomService.isRoomAvailable(requestUser, requestRoom);
        if (!isRoomAvailable.availability) {
            socket.emit('enter-room', {
                errorMessage: isRoomAvailable.message,
                status: isRoomAvailable.status,
            });
            throw new SocketException(
                isRoomAvailable.message,
                isRoomAvailable.status,
                'enter-room',
            );
        }

        // 3. requestUser를 해당 방에 join & room participants 정보 갱신
        const updateRoomInfo = await this.roomService.updateRoomParticipants(
            socket.id,
            requestUser,
            isRoomAvailable.room,
        );
        socket.join(`${updateRoomInfo.roomId}`);

        // 4.game room 안의 사람들에게 update-room event emit -> !!!namespace 설정하기!!!
        this.server.to(`${updateRoomInfo.roomId}`).emit('update-room', { data: updateRoomInfo });

        // 5.main space에 room-list event emit -> !!!namespace 설정하기!!!
        const roomInfoList: RoomInfoToMainDto[] = await this.roomService.getAllRoomList();
        this.server.except(`${updateRoomInfo.roomId}`).emit('room-list', { data: roomInfoList });
    }

    @SubscribeMessage('leave-room')
    async handleLeaveRoomEvent(@ConnectedSocket() socket: Socket) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: LoginUserToSocketDto = socketIdMap[socket.id];
        if (!requestUser) {
            socket.emit('leave-room', {
                errorMessage: '로그인이 필요한 서비스입니다.',
                status: 401,
            });
            throw new SocketException('로그인이 필요한 서비스입니다.', 403, 'leave-room');
        }

        // roomList.participants update
        const updateRoomInfo: RoomInfoToRoomDto | any = await this.roomService.leaveRoom(
            requestUser,
        );

        // socketIdMap update
        await this.inGameUsersService.handleLeaveRoom(socket.id);

        // request user를 leave처리
        socket.leave(`${updateRoomInfo.roomId}`);

        // 4.game room 안의 사람들에게 update-room event emit -> !!!namespace 설정하기!!!
        if (updateRoomInfo)
            this.server
                .to(`${updateRoomInfo.roomId}`)
                .emit('update-room', { data: updateRoomInfo });

        // 5.main space에 room-list event emit -> !!!namespace 설정하기!!!
        const roomInfoList: RoomInfoToMainDto[] = await this.roomService.getAllRoomList();
        this.server.except(`${updateRoomInfo.roomId}`).emit('room-list', { data: roomInfoList });
    }

    @SubscribeMessage('send-chat')
    async sendChatRequest(@ConnectedSocket() socket: Socket, @MessageBody() { data }: any) {
        const message: string = data.message;
        const { nickname, currentRoom } = socketIdMap[socket.id];
        this.server.to(`${currentRoom}`).emit('receive-chat', { data: { nickname, message } });
    }
}
