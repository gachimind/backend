import { SocketIdMap } from './socketIdMap.entity';
export declare class Player {
    id: number;
    socket: SocketIdMap;
    isGameOn: boolean;
    isGameReadyToStart: boolean;
    createdAt: Date;
    updatedAt: Date;
}
