import { GameResult } from './gameResult.entity';
export declare class TurnResult {
    turnResultId: number;
    gameResultInfo: number;
    gameResult: GameResult;
    roomId: number;
    turnId: number;
    userId: number;
    score: number;
    keyword: string;
    isSpeech: boolean;
    createdAt: Date;
    updatedAt: Date;
}
