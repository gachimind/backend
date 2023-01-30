import { CreateRoomRequestDto } from './create-room.request.dto';
declare const RoomDataInsertDto_base: import("@nestjs/common").Type<Omit<CreateRoomRequestDto, "roomTitle">>;
export declare class RoomDataInsertDto extends RoomDataInsertDto_base {
    roomTitle: string;
    isGameOn: boolean;
    isGameReadyToStart: boolean;
}
export {};
