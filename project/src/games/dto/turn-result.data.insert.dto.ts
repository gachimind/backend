import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TurnResultDataInsertDto {
    @IsNumber()
    gameResultInfo: number;

    @IsNumber()
    roomId: number;

    @IsNumber()
    turnId: number;

    @IsNumber()
    turn: number;

    @IsNumber()
    userId: number;

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
