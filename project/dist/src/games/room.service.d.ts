import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import { RoomInfoToRoomDto } from './dto/roomInfoToRoom.dto';
export declare class RoomService {
    getAllRoomList(): RoomInfoToMainDto[];
    getRoomInfo(roomId: number): Promise<RoomInfoToRoomDto>;
    createRoom(room: CreateRoomRequestDto): number;
}
