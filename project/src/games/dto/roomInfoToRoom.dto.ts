import { OmitType } from '@nestjs/swagger';
import { RoomDataInsertDto } from './room.data.insert.dto';

export class RoomInfoToRoomDto extends OmitType(RoomDataInsertDto, ['roomPassword'] as const) {}
