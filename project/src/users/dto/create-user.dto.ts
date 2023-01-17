import { IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// OAuth 서버에서 유저 정보를 넘겨 받아 우리 db에 생성할 때 사용
//
export class CreateUserDto {
    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 1,
        required: false,
        description: 'OAuth 서버에서 받아온 회원의 id를 게임 서버 db에 저장',
    })
    readonly userId: number;

    @IsString()
    @IsEmail()
    @ApiProperty({
        example: 'test@email.com',
        required: true,
        description: 'OAuth 서버에서 받아온 회원의 email을 게임 서버 db에 저장',
    })
    readonly email: string;

    @IsString()
    @ApiProperty({
        example: '혜연1',
        required: true,
        description: 'OAuth 서버에서 받아온 회원의 nickname을 게임 서버 db에 저장',
    })
    readonly nickname: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '혜연1',
        required: true,
        description:
            'OAuth 서버에서 받아온 회원의 profile image를 게임 서버 db에 저장. profile image가 없을 경우, 게임 서버의 default 이미지를 사용하고, OAuth 서버에서 이미지 url을 제공하지 않고, base64로 제공할 경우, 해당 값을  S3 서버에 업로드하고, 이미지 url 값을 받아와 저장',
    })
    readonly profileImg: string;
}
