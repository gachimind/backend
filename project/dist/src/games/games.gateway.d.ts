import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';
export declare class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly roomService;
    private readonly chatService;
    constructor(roomService: RoomService, chatService: ChatService);
    server: Server;
    afterInit(server: Server): any;
    handleConnection(socket: Socket): any;
    handleDisconnect(socket: Socket): any;
    socketIdMapToLoginUser(socket: Socket, { data }: any): void;
    socketIdMapToLogOutUser(socket: Socket): Promise<void>;
    createRoomRequest(socket: Socket, { data }: any): Promise<void>;
    enterRoomRequest(socket: Socket, { data }: any): Promise<any>;
    sendChatRequest(socket: Socket, { data }: any): any;
}
