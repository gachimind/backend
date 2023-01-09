import { OmitType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends OmitType(CreateRoomDto, [
    'roomId',
    'roomPassword',
    'isGameOn',
] as const) {}
