import { RoomDataInsertDto } from './room.data.insert.dto';
import { RoomParticipantsDto } from './room.participants.dto';
declare const RoomInfoToRoomDto_base: import("@nestjs/common").Type<Omit<RoomDataInsertDto, "roomPassword">>;
export declare class RoomInfoToRoomDto extends RoomInfoToRoomDto_base {
    readonly roomId: number;
    readonly participants: RoomParticipantsDto[];
}
export {};
