import { CreateRoomDto } from './create-room.dto';
declare const UpdateRoomDto_base: import("@nestjs/common").Type<Omit<CreateRoomDto, "roomId" | "roomPassword" | "isGameOn">>;
export declare class UpdateRoomDto extends UpdateRoomDto_base {
}
export {};
