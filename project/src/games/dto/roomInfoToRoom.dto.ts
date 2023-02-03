import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { RoomDataInsertDto } from './room.data.insert.dto';
import { RoomParticipantsDto } from './room.participants.dto';

export class RoomInfoToRoomDto extends OmitType(RoomDataInsertDto, ['roomPassword'] as const) {
    @IsNumber()
    @ApiProperty({
        example: 1,
        required: true,
        description: 'roomId : PK for Room table',
    })
    readonly roomId: number;

    @IsArray()
    @ApiProperty({
        example: [],
        required: true,
        description: 'player info in the room',
    })
    readonly participants: RoomParticipantsDto[];
}
