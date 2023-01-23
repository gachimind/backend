import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TurnDataInsertDto {
    @IsNumber()
    roomInfo: number;

    @IsNumber()
    turn: number;

    @IsString()
    speechPlayerInfo: string;

    @IsString()
    keyword: string;

    @IsString()
    @IsOptional()
    hint?: string;
}
