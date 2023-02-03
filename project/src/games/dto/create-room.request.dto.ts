import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomRequestDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '같이 가치마인드 하실 초보 모집합니다!!',
        required: false,
        description: '게임방 제목, 유저가 입력하지 않으면, 서버에서 랜덤 방제로 자동생성',
    })
    public roomTitle: string;

    @IsNumber()
    @ApiProperty({
        example: 6,
        required: true,
        description: '게임 정원',
    })
    readonly maxCount: number;

    @IsNumber()
    @ApiProperty({
        example: 30000,
        required: true,
        description: '발표 준비 타이머, milliseconds 단위',
    })
    readonly readyTime: number;

    @IsNumber()
    @ApiProperty({
        example: 30000,
        required: true,
        description: '발표 타이머, milliseconds 단위',
    })
    readonly speechTime: number;

    @IsNumber()
    @ApiProperty({
        example: 60000,
        required: true,
        description: '토론 타이머, milliseconds 단위',
    })
    readonly discussionTime: number;

    @IsBoolean()
    @ApiProperty({
        example: true,
        required: true,
        description: '비밀방 여부',
    })
    public isSecretRoom: boolean;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 8282,
        required: false,
        description: '비밀방 비밀번호 - 숫자 4자리',
    })
    readonly roomPassword: number;
}
