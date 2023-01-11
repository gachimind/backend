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
    handleConnection(socket: Socket): Promise<any>;
    handleDisconnect(socket: Socket): Promise<any>;
    socketIdMapToLoginUser(socket: Socket, { data }: any): Promise<any>;
    socketIdMapToLogOutUser(socket: Socket): Promise<any>;
    createRoomRequest(socket: Socket, { data }: any): Promise<any>;
    enterRoomRequest(socket: Socket, { data }: any): Promise<any>;
    sendChatRequest(socket: Socket, { data }: any): Promise<any>;
}
