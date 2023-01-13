import { Player } from './player.entity';
import { SocketIdMap } from './socketIdMap.entity';
export declare class Room {
    roomId: number;
    roomTitle: string;
    maxCount: number;
    round: number;
    readyTime: number;
    speechTime: number;
    discussionTime: number;
    isSecreteRoom: boolean;
    roomPassword: number;
    isGameOn: boolean;
    isGameReadyToStart: boolean;
    createdAt: Date;
    updatedAt: Date;
    socketId: SocketIdMap[];
    playerId: Player[];
}
