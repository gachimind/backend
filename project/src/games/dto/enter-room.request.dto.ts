import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnterRoomRequestDto {
    @IsNumber()
    @ApiProperty({
        example: 1,
        required: true,
        description: '방 생성시 서버에서 자동 생성하는 방의 고유번호',
    })
    readonly roomId: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 8282,
        required: false,
        description: '비밀방 비밀번호 - 숫자 4자리',
    })
    readonly roomPassword: number;
}
