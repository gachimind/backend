import { RoomDataDto } from './room.data.dto';
declare const RoomInfoToMainDto_base: import("@nestjs/common").Type<Omit<RoomDataDto, "readyTime" | "speechTime" | "discussionTime" | "roomPassword" | "isGameReadyToStart" | "participants">>;
export declare class RoomInfoToMainDto extends RoomInfoToMainDto_base {
    participants: number;
}
export {};
