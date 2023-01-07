import { IsString, IsNumber, IsOptional, IsBoolean, IsNotEmpty, IsEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '같이 가치마인드 하실 초보 모집합니다!!',
        required: false,
        description: '게임방 제목, 유저가 입력하지 않으면, 서버에서 랜덤 방제로 자동생성',
    })
    readonly roomTitle: string;

    @IsNumber()
    @IsEmpty()
    @ApiProperty({
        example: 6,
        required: true,
        description: '게임 정원',
    })
    readonly maxCount: number;

    @IsNumber()
    @IsEmpty()
    @ApiProperty({
        example: 3,
        required: true,
        description: '게임 라운드',
    })
    readonly round: number;

    @IsNumber()
    @IsEmpty()
    @ApiProperty({
        example: 30000,
        required: true,
        description: '발표 준비 타이머, milliseconds 단위',
    })
    readonly readyTime: number;
    @IsNumber()
    @IsEmpty()
    @ApiProperty({
        example: 30000,
        required: true,
        description: '발표 타이머, milliseconds 단위',
    })
    readonly speechTime: number;

    @IsNumber()
    @IsEmpty()
    @ApiProperty({
        example: 60000,
        required: true,
        description: '토론 타이머, milliseconds 단위',
    })
    readonly discussionTime: number;

    @IsBoolean()
    @IsEmpty()
    @ApiProperty({
        example: true,
        required: true,
        description: '비밀방 여부',
    })
    readonly IsSecreteRoom: boolean;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 8282,
        required: false,
        description: '비밀방 비밀번호 - 숫자 4자리',
    })
    readonly roomPassword: number;
}
