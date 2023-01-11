import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { CreateRoomRequestDto } from './create-room.request.dto';

export class RoomDataDto extends OmitType(CreateRoomRequestDto, ['roomTitle'] as const) {
    @IsNumber()
    @ApiProperty({
        example: 1,
        required: true,
        description: '게임방 PK, 서버에서 자동 부여',
    })
    public roomId: number;

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

    @IsArray()
    @ApiProperty({
        example: [
            { userId: 1, nickname: '동석1', profileImg: '이미지url', isReady: false },
            { userId: 2, nickname: '세현1', profileImg: '이미지url', isReady: true },
            { userId: 3, nickname: '혜연1', profileImg: '이미지url', isReady: false },
        ],
        required: true,
        description: '방의 게임 상태, false: 대기 중  / true: 게임 중',
    })
    public participants: any[]; // participants의 dto 정의하고 여기에 넣어 주기
}
