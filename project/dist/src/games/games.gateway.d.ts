import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';
import { InGameUsersService } from './inGame-users.service';
export declare class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly roomService;
    private readonly chatService;
    private readonly inGameUsersService;
    constructor(roomService: RoomService, chatService: ChatService, inGameUsersService: InGameUsersService);
    server: Server;
    afterInit(server: Server): any;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    socketIdMapToLoginUser(socket: Socket, { data }: any): Promise<void>;
    socketIdMapToLogOutUser(socket: Socket): Promise<void>;
    handleCreateRoomRequest(socket: Socket, { data }: any): Promise<void>;
    handleEnterRoomRequest(socket: Socket, { data }: any): Promise<void>;
    handleLeaveRoomEvent(socket: Socket): Promise<void>;
    sendChatRequest(socket: Socket, { data }: any): Promise<void>;
}
