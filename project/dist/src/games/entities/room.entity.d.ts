import { SocketIdMap } from './socketIdMap.entity';
export declare class Room {
    id: number;
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
    participants: SocketIdMap[];
    createdAt: Date;
    updatedAt: Date;
}
