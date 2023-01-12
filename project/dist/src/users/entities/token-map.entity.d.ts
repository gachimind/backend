import { User } from './user.entity';
export declare class TokenMap {
    id: number;
    token: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
