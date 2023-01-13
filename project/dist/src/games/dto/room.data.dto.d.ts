import { CreateRoomRequestDto } from './create-room.request.dto';
import { RoomParticipantsDto } from './room.participants.dto';
declare const RoomDataDto_base: import("@nestjs/common").Type<Omit<CreateRoomRequestDto, "roomTitle">>;
export declare class RoomDataDto extends RoomDataDto_base {
    roomId: number;
    roomTitle: string;
    isGameOn: boolean;
    isGameReadyToStart: boolean;
    participants: Array<RoomParticipantsDto>;
}
export {};