import { OmitType } from '@nestjs/swagger';
import { RoomDataDto } from './room.data.dto';

export class RoomInfoToRoomDto extends OmitType(RoomDataDto, ['roomPassword'] as const) {}
