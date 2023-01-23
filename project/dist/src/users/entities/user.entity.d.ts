import { GameResult } from '../../games/entities/gmaeResult.entity';
export declare class User {
    userId: number;
    kakaoUserId: number;
    email: string | null;
    nickname: string;
    profileImg: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    gameResult: GameResult;
}
