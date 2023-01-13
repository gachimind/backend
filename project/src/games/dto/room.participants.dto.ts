import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class RoomParticipantsDto {
    @IsString()
    @ApiProperty({
        example: '1nkYPrJVfR06HoiDAAAB',
        required: true,
        description: 'socket id',
    })
    public socketId: string;

    @IsNumber()
    @ApiProperty({
        example: 1,
        required: true,
        description: 'user id PK',
    })
    public userId: number;

    @IsString()
    @ApiProperty({
        example: 1,
        required: true,
        description: '닉네임',
    })
    public nickname: string;

    @IsString()
    @ApiProperty({
        example: 1,
        required: true,
        description: '프로필 이미지 - 고양이 사진',
    })
    public profileImg: string;

    @IsBoolean()
    @ApiProperty({
        example: true,
        required: true,
        description: '게임 READY 상태인지? - 방장은 항상 false',
    })
    public isReady: boolean;

    @IsBoolean()
    @ApiProperty({
        example: false,
        required: true,
        description: '방방인지? - 방장만 true',
    })
    public isHost: boolean;
}
