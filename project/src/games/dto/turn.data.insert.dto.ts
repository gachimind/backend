import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TurnDataInsertDto {
    @IsNumber()
    roomInfo: number;

    @IsNumber()
    turn: number;

    @IsString()
    currentEvent: string;

    @IsNumber()
    speechPlayer: number;

    @IsString()
    speechPlayerNickname: string;

    @IsString()
    keyword: string;

    @IsString()
    hint: string;

    @IsString()
    link: string;
}
