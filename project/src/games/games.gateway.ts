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

// @UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
@WebSocketGateway({
    transports: ['websocket'],
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

    async handleConnection(@ConnectedSocket() socket: Socket): Promise<any> {
        console.log('connected socket', socket.id);
        const data: RoomInfoToMainDto[] = await this.roomService.getAllRoomList();
        return socket.emit('room-list', { data });
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<any> {
        // 접속이 종료된 회원의 정보를 socketIdMap에서 삭제
        await this.inGameUsersService.handleDisconnect(socket);
        return console.log('disconnected socket', socket.id);
    }

    @SubscribeMessage('log-in')
    async socketIdMapToLoginUser(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: any,
    ): Promise<any> {
        // !!authGuard 만들어서 붙여야 함!!! -> 토큰을 들고 있는지만 검사 & 토큰 validation은 별도로!!
        if (!data.authorization) {
            socket.emit('log-in', { errorMessage: '잘못된 접근입니다.', status: 401 });
            throw new SocketException('잘못된 접근입니다.', 401, 'log-in');
        }
        const token: string = data.authorization;

        // 토큰 값이 유효한지는 service 레이어에서 db를 조회해서 검사
        await this.inGameUsersService.socketIdMapToLoginUser(token, socket);
        console.log('로그인 성공!');
        return socket.emit('log-in', { message: '로그인 성공!' });
    }

    @SubscribeMessage('log-out')
    async socketIdMapToLogOutUser(@ConnectedSocket() socket: Socket): Promise<any> {
        await this.inGameUsersService.socketIdMapToLogOutUser(socket);
        console.log('로그아웃 성공!');
        return socket.emit('log-out', { message: '로그아웃 성공!' });
    }

    @SubscribeMessage('create-room')
    async createRoomRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: any,
    ): Promise<any> {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestedUser: LoginUserToSocketDto = socketIdMap[socket.id];
        if (!requestedUser) {
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
        const updateRoomList = await this.roomService.getAllRoomList();
        // !!! namespce 설정해줘야 함!!!
        return this.server.emit('room-list', { data: updateRoomList });
    }

    @SubscribeMessage('enter-room')
    async enterRoomRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: any,
    ): Promise<any> {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestedUser: LoginUserToSocketDto = socketIdMap[socket.id];
        if (!requestedUser) {
            socket.emit('create-room', {
                errorMessage: '로그인이 필요한 서비스입니다.',
                status: 401,
            });
            throw new SocketException('로그인이 필요한 서비스입니다.', 403, 'create-room');
        }
        // 1. 요청한 방이 존재하는지 검증
        const room: EnterRoomRequestDto = data;
        const updateRoomInfo = await this.roomService.getRoomInfo(room.roomId);
        if (!updateRoomInfo) {
            socket.emit('enter-room', { errorMessage: '방이 존재하지 않습니다.', status: 404 });
        }

        // 2. requested user를 요청에 room에 join
        socket.join(`${room.roomId}`);

        //3.해당 방의 participants 정보를 업데이트

        // 4.game room 안의 사람들에게 update-room event emit

        // 5.main space에 room-list event emit -> !!!namespace 설정하기!!!
        const roomInfoList: RoomInfoToMainDto[] = this.roomService.getAllRoomList();
        this.server.emit('room-list', { data: roomInfoList });
    }

    @SubscribeMessage('send-chat')
    async sendChatRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: any,
    ): Promise<any> {
        const message: string = data.message;
        const { nickname, currentRoom } = socketIdMap[socket.id];
        this.server.to(`${currentRoom}`).emit('receive-chat', { data: { nickname, message } });
    }
}
