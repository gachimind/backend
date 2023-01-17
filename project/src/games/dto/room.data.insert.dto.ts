import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateRoomRequestDto } from './create-room.request.dto';

export class RoomDataInsertDto extends OmitType(CreateRoomRequestDto, ['roomTitle'] as const) {
    @IsString()
    @ApiProperty({
        example: '같이 가치마인드 하실 초보 모집합니다!!',
        required: false,
        description: '게임방 제목, 유저가 입력하지 않으면, 서버에서 랜덤 방제로 자동생성',
    })
    public roomTitle: string;

    @IsBoolean()
    @ApiProperty({
        example: false,
        required: true,
        description: '방의 게임 상태, false: 대기 중  / true: 게임 중',
    })
    public isGameOn: boolean;

    @IsBoolean()
    @ApiProperty({
        example: false,
        required: true,
        description:
            '방의 게임 READY 상태, false: READY하지 않은 플레이어 가 있음  / true: 모든 플레이어가 READY 함',
    })
    public isGameReadyToStart: boolean;
}
