import { IsNumber, IsString } from 'class-validator';

export class EventUserInfoDto {
    @IsString()
    public socketId: string;

    @IsNumber()
    public userId: number;

    @IsString()
    public nickname: string;

    @IsString()
    public profileImg: string;
}
