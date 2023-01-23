import { TurnResult } from './turnResult.entity';
import { User } from '../../users/entities/user.entity';
export declare class GameResult {
    gameResultId: number;
    userInfo: number;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    turnResults: TurnResult[];
}
