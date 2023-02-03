import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 유저가 자신의 닉네임이나 프로필 이미지를 변경할때 사용
export class TokenMapRequestDto {
    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 8,
        description: '기존에 매핑 되어 있더 유저 토큰맵의 PK',
    })
    public tokenMapId?: number;

    @IsNumber()
    @ApiProperty({
        example: 8,
        description: 'user entity의 PK',
    })
    public userInfo: number;

    @IsString()
    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7fSwiaWF0IjoxNjc1MTcyMTExLCJleHAiOjE2NzUyNTg1MTF9.FIZtNKlz288H5L_HQo8QIBACzW7Hr54sXPWh8SgSAkI',
        description: '새로 발급받은 JWT 값',
    })
    public token: string;
}
