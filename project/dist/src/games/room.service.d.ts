import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import { RoomDataDto } from './dto/room.data.dto';
import { RoomInfoToRoomDto } from './dto/roomInfoToRoom.dto';
import { LoginUserToSocketDto } from 'src/users/dto/login-user.dto';
export declare class RoomService {
    getAllRoomList(): Promise<RoomInfoToMainDto[]>;
    createRoom(room: CreateRoomRequestDto): number;
    isRoomAvailable(requestUser: LoginUserToSocketDto, requestRoom: EnterRoomRequestDto): Promise<{
        availability: boolean;
        message: string;
        status: 404;
        room?: undefined;
    } | {
        availability: boolean;
        message: string;
        status: 400;
        room?: undefined;
    } | {
        availability: boolean;
        message: string;
        room: any;
        status?: undefined;
    }>;
    updateRoomParticipants(socketId: string, requestUser: LoginUserToSocketDto, roomInfo: RoomDataDto): Promise<RoomInfoToRoomDto | any>;
    leaveRoom(requestUser: LoginUserToSocketDto): Promise<any>;
}
