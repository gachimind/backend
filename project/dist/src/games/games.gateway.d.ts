import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { PlayersService } from './players.service';
import { ChatService } from './chat.service';
import { GamesService } from './games.service';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { Room } from './entities/room.entity';
import { Turn } from './entities/turn.entity';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.request.dto';
import { AuthorizationRequestDto } from 'src/users/dto/authorization.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { TurnEvaluateRequestDto } from './dto/evaluate.request.dto';
import { NextFunction } from 'express';
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
    handleLeaveRoomEvent(socket: Socket, next: NextFunction): Promise<void>;
    handleReadyEvent(socket: Socket): Promise<void>;
    handleStartEvent(socket: Socket): Promise<void>;
    sendChatRequest(socket: Socket, { data }: {
        data: {
            message: string;
        };
    }): Promise<void>;
    handleTurnEvaluation(socket: Socket, { data }: {
        data: TurnEvaluateRequestDto;
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
    handleLeaveRoomRequest(socket: Socket, requestUser: SocketIdMap): Promise<void>;
    RemovePlayerFromRoom(roomId: number, requestUser: SocketIdMap | null, socket: Socket): Promise<void>;
    updateHostPlayer(updateRoom: Room): Promise<boolean>;
    updateRoom(roomId: number): Promise<UpdateRoomDto>;
    announceUpdateRoomInfo(roomUpdate: UpdateRoomDto, requestUser: SocketIdMap | null, event: string): Promise<void>;
    updateRoomInfoToRoom(room: Room, requestUser: SocketIdMap | null, event: string): void;
    updateRoomListToMain(): Promise<void>;
    controlGameTurns(room: Room, next: NextFunction): Promise<void>;
    controlTurnTimer(room: Room, eventName: string, turn?: Turn, nextTurn?: Turn): Promise<void>;
    handleSpeechPlayerLeaveRoomRequest(turn: Turn, socket: Socket, next: NextFunction): Promise<void>;
    handleEndGameByPlayerLeaveEvent(room: Room, next: NextFunction): Promise<void>;
    createTimer(time: number, roomId: number): Promise<any>;
    emitGameInfo(turn: Turn, roomId: number): void;
    emitTimeStartEvent(roomId: number, currentTurn: number, timer: string, event: string): void;
    emitSpeechPlayerScoreEvent(roomId: number, turn: Turn): Promise<void>;
    emitTimeEndEvent(roomId: number, timer: number, event: string, turn?: Turn, nextTurn?: Turn): void;
}
