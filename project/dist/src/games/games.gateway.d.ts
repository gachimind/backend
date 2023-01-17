import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.request.dto';
import { PlayersService } from './players.service';
import { AuthorizationRequestDto } from 'src/users/dto/authorization.dto';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { ChatService } from './chat.service';
export declare class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly roomService;
    private readonly playersService;
    private readonly chatService;
    constructor(roomService: RoomService, playersService: PlayersService, chatService: ChatService);
    server: Server;
    afterInit(server: Server): any;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    socketIdMapToLoginUser(socket: Socket, { data }: {
        data: AuthorizationRequestDto;
    }): Promise<void>;
    socketIdMapToLogOutUser(socket: Socket): Promise<void>;
    handleCreateRoomRequest(socket: Socket, { data }: {
        data: CreateRoomRequestDto;
    }): Promise<void>;
    handleEnterRoomRequest(socket: Socket, { data: requestRoom }: {
        data: EnterRoomRequestDto;
    }): Promise<void>;
    handleLeaveRoomEvent(socket: Socket): Promise<void>;
    sendChatRequest(socket: Socket, { data }: {
        data: {
            message: string;
        };
    }): Promise<void>;
    handleIce(socket: Socket, { data }: {
        data: any;
    }): Promise<void>;
    handleOffer(socket: Socket, { data }: {
        data: any;
    }): Promise<void>;
    handleAnswer(socket: Socket, { data }: {
        data: any;
    }): Promise<void>;
    handler(socket: Socket): Promise<void>;
    handleChangeStream(socket: Socket, { data }: {
        data: any;
    }): Promise<void>;
    socketAuthentication(socketId: string): Promise<SocketIdMap>;
    handleUserToLeaveRoom(requestUser: SocketIdMap, socket: Socket): Promise<void>;
    RemovePlayerFormRoom(requestUser: SocketIdMap, socket: Socket): Promise<void>;
    updateRoomStatus(requestUser: SocketIdMap, roomId: number): Promise<boolean>;
    updateRoomAnnouncement(requestUser: SocketIdMap, roomId: number, event: string, isRoomDeleted: boolean | void): Promise<void>;
}
