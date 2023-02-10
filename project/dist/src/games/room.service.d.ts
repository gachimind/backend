import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.request.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import { LoginUserToSocketIdMapDto } from 'src/games/dto/socketId-map.request.dto';
import { Player } from './entities/player.entity';
import { GamesRepository } from './games.repository';
export declare class RoomService {
    private readonly gamesRepository;
    private readonly roomRepository;
    private readonly playerRepository;
    constructor(gamesRepository: GamesRepository, roomRepository: Repository<Room>, playerRepository: Repository<Player>);
    getAllRoomList(): Promise<RoomInfoToMainDto[]>;
    getOneRoomByRoomId(roomId: number): Promise<Room>;
    getOneRoomByRoomIdWithTurnKeyword(roomId: number): Promise<Room>;
    removeRoomByRoomId(roomId: number): Promise<number | any>;
    updateRoomStatusByRoomId(data: any): Promise<Room>;
    createRoom(room: CreateRoomRequestDto): Promise<number>;
    enterRoom(requestUser: LoginUserToSocketIdMapDto, requestRoom: EnterRoomRequestDto): Promise<void>;
    validateRoomPassword(password: string, roomId: number): Promise<void>;
    updateIsGameReadyToStart(roomId: number): Promise<Room>;
    updateIsGameOn(roomId: number): Promise<Room>;
}
