import { IsString, IsNumber, IsOptional, IsEmpty, IsBoolean } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { RoomDataDto } from './room.data.dto';

export class RoomInfoToMainDto extends OmitType(RoomDataDto, [
    'discussionTime',
    'readyTime',
    'speechTime',
    'roomPassword',
    'participants',
    'isGameReadyToStart',
] as const) {
    @IsNumber()
    @ApiProperty({
        example: 3,
        required: true,
        description:
            '방정보 db에는 participants가 참여자 닉네임 배열로 되어 있고, client에 전단할때는 해당 배열의 length를 전달',
    })
    public participants: number;
}
