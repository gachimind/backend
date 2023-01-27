import { Player } from './player.entity';
import { Turn } from './turn.entity';
export declare class Room {
    roomId: number;
    roomTitle: string;
    maxCount: number;
    readyTime: number;
    speechTime: number;
    discussionTime: number;
    isSecretRoom: boolean;
    roomPassword: number;
    isGameOn: boolean;
    isGameReadyToStart: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    players: Player[];
    turns: Turn[];
}
