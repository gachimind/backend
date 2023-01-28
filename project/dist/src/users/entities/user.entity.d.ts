import { TodayResult } from '../../games/entities/todayResult.entity';
import { GameResult } from '../../games/entities/gameResult.entity';
export declare class User {
    userId: number;
    kakaoUserId: number;
    email: string | null;
    nickname: string;
    profileImg: string;
    updateIsFirstLogin(): void;
    isFirstLogin: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    gameResults: GameResult[];
    todayResults: TodayResult[];
}
