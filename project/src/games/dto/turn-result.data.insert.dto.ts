import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TurnResultDataInsertDto {
    @IsNumber()
    gameResultInfo: number;

    @IsNumber()
    roomId: number;

    @IsNumber()
    turn: number;

    @IsString()
    nickname: string;

    @IsNumber()
    score: number;

    @IsString()
    keyword: string;

    @IsString()
    @IsOptional()
    isSpeech: boolean;
}