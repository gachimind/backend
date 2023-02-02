import { User } from '../../users/entities/user.entity';
import { GameResult } from './gameResult.entity';
export declare class TodayResult {
    todayResultId: number;
    userInfo: number;
    user: User;
    todayScore: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    gameResults: GameResult[];
}
