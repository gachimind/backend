import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TurnDataInsertDto {
    @IsNumber()
    roomInfo: number;

    @IsNumber()
    turn: number;

    @IsString()
    currentEvent: string;

    @IsString()
    speechPlayer: string;

    @IsString()
    keyword: string;

    @IsString()
    @IsOptional()
    hint?: string;
}
