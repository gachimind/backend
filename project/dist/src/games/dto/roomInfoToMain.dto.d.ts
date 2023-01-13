import { RoomDataDto } from './room.data.dto';
declare const RoomInfoToMainDto_base: import("@nestjs/common").Type<Omit<RoomDataDto, "isGameReadyToStart" | "readyTime" | "speechTime" | "discussionTime" | "roomPassword" | "participants">>;
export declare class RoomInfoToMainDto extends RoomInfoToMainDto_base {
    participants: number;
}
export {};
