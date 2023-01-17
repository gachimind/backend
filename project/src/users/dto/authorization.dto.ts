import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthorizationRequestDto {
    @IsString()
    @ApiProperty({
        example: 'token value',
        required: false,
        description: '로그인을 요청하는 모든 유저는 authorization을 emit',
    })
    readonly authorization: string;
}
