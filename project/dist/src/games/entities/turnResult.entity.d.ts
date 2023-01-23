import { GameResult } from './gmaeResult.entity';
export declare class TurnResult {
    turnResultId: number;
    turn: number;
    room: number;
    score: number;
    keyword: string;
    isSpeech: boolean;
    gameResultInfo: number;
    gameResult: GameResult;
    createdAt: Date;
    updatedAt: Date;
}
