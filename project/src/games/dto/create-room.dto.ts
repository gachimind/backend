import {
    IsString,
    IsNumber,
    IsOptional,
    IsBoolean,
    IsNotEmpty,
    IsEmpty,
    IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 1,
        required: false,
        description: '게임방 id, 서버에서 자동 생성',
    })
    public roomId: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '같이 가치마인드 하실 초보 모집합니다!!',
        required: false,
        description: '게임방 제목, 유저가 입력하지 않으면, 서버에서 랜덤 방제로 자동생성',
    })
    readonly roomTitle: string;

    @IsNumber()
    @ApiProperty({
        example: 6,
        required: true,
        description: '게임 정원',
    })
    readonly maxCount: number;

    @IsArray()
    @IsOptional()
    @ApiProperty({
        example: ['동석1', '혜연1', '세현1', '예나1', '도영1', '경리1'],
        required: true,
        description:
            '방정보 db에는 participants가 참여자 닉네임 배열로 되어 있고, client에 전단할때는 해당 배열의 length를 전달',
    })
    public participants: string[];

    @IsNumber()
    @ApiProperty({
        example: 3,
        required: true,
        description: '게임 라운드',
    })
    readonly round: number;

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
    @IsEmpty()
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
