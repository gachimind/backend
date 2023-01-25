import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.request.dto';
import { PlayersService } from './players.service';
import { AuthorizationRequestDto } from 'src/users/dto/authorization.dto';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { ChatService } from './chat.service';
import { Room } from './entities/room.entity';
import { UpdateRoomDto } from './dto/update-room.dto';
import { GamesService } from './games.service';
import { Turn } from './entities/turn.entity';
export declare class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly roomService;
    private readonly playersService;
    private readonly chatService;
    private readonly gamesService;
    constructor(roomService: RoomService, playersService: PlayersService, chatService: ChatService, gamesService: GamesService);
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
    handleValidRoomPassword(socket: Socket, { data: { password, roomId } }: {
        data: {
            password: any;
            roomId: any;
        };
    }): Promise<void>;
    handleLeaveRoomEvent(socket: Socket): Promise<void>;
    handleReadyEvent(socket: Socket): Promise<void>;
    handleStartEvent(socket: Socket): Promise<void>;
    timer(time: any): Promise<unknown>;
    gameTimer(room: Room, eventName: string, turn: Turn, nextTurn?: Turn): Promise<boolean>;
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
    socketAuthentication(socketId: string, event: string): Promise<SocketIdMap>;
    RemovePlayerFormRoom(requestUser: SocketIdMap, socket: Socket): Promise<void>;
    updateHostPlayer(updateRoom: Room): Promise<boolean>;
    updateRoom(roomId: number): Promise<UpdateRoomDto>;
    announceUpdateRoomInfo(roomUpdate: UpdateRoomDto, requestUser: SocketIdMap, event: string): Promise<void>;
    updateRoomInfoToRoom(requestUser: SocketIdMap, room: Room, event: string): Promise<void>;
    updateRoomListToMain(): Promise<void>;
}
