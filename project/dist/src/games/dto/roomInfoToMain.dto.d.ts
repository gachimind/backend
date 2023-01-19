import { RoomDataInsertDto } from './room.data.insert.dto';
declare const RoomInfoToMainDto_base: import("@nestjs/common").Type<Omit<RoomDataInsertDto, "readyTime" | "speechTime" | "discussionTime" | "roomPassword" | "isGameReadyToStart">>;
export declare class RoomInfoToMainDto extends RoomInfoToMainDto_base {
    roomId: number;
    participants: number;
}
export {};
