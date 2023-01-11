import { CreateRoomRequestDto } from './create-room.request.dto';
declare const RoomDataDto_base: import("@nestjs/common").Type<Omit<CreateRoomRequestDto, "roomTitle">>;
export declare class RoomDataDto extends RoomDataDto_base {
    roomId: number;
    roomTitle: string;
    isGameOn: boolean;
    isGameReadyToStart: boolean;
    participants: any[];
}
export {};
