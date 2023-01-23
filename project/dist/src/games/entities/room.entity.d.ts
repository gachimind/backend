import { Player } from './player.entity';
export declare class Room {
    roomId: number;
    roomTitle: string;
    maxCount: number;
    round: number;
    readyTime: number;
    speechTime: number;
    discussionTime: number;
    isSecretRoom: boolean;
    roomPassword: number;
    isGameOn: boolean;
    isGameReadyToStart: boolean;
    createdAt: Date;
    updatedAt: Date;
    players: Player[];
}
