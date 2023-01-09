import { IsString, IsNumber, IsOptional, IsEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

// 로그인한 유저의 socket id와 회원 정보를 매핑시켜 cache db에 create할 때 사용
// socket 통신에서 넘겨받은 회원의 token을 이용해 db에서 회원의 정보를 조회하고, 회원의 접속 socket id와 회원정보를 redis에 캐싱
// socketId, userId, nickname, profileImage (나머지 회원 정보는 CreateUserDto에서 extends)
export class LoginUserDto extends CreateUserDto {
    @IsString()
    @ApiProperty({
        example: 'U7AOqDYWr2AhwvQnAAAB',
        required: true,
        description: '로그인한 유저의 socket.id',
    })
    readonly socketId: string;

    @IsNumber()
    @ApiProperty({
        example: 1,
        required: true,
        description: '로그인한 유저의 userId',
    })
    readonly userId: number;
}
