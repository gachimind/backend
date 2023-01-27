import { TurnResult } from './turnResult.entity';
import { User } from '../../users/entities/user.entity';
import { TodayResult } from './todayResult.entity';
export declare class GameResult {
    gameResultId: number;
    roomId: number;
    userInfo: number;
    user: User;
    gameScore: number;
    todayResultInfo: number;
    todayResult: TodayResult;
    createdAt: Date;
    updatedAt: Date;
    turnResults: TurnResult[];
}
