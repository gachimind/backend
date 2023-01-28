import { IsNumber, IsString } from 'class-validator';

export class TurnEvaluateRequestDto {
    @IsNumber()
    readonly score: number;

    @IsNumber()
    readonly turn: number;
}
