import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 유저가 자신의 닉네임이나 프로필 이미지를 변경할때 사용
export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '도영1',
        description: '유저가 변경하고자 하는 새 닉네임. 프로필 이미지만 변경할 경우, not required',
    })
    readonly nickname: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'https://hanghaebucket.s3.ap-northeast-2.amazonaws.com/vs_image800.jpg',
        description:
            '유저가 변경하고자 하는 새 프로필 이미지 url. 닉네임만 변경할 경우, not required',
    })
    readonly profileImg: string;
}
