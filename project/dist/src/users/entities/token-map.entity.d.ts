import { User } from './user.entity';
export declare class TokenMap {
    tokenMapId: number;
    token: string;
    userInfo: number;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
