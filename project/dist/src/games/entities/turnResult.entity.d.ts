import { GameResult } from './gameResult.entity';
export declare class TurnResult {
    turnResultId: number;
    gameResultInfo: number;
    gameResult: GameResult;
    roomId: number;
    turn: number;
    nickname: string;
    score: number;
    keyword: string;
    isSpeech: boolean;
    createdAt: Date;
    updatedAt: Date;
}
