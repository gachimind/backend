import { Room } from './room.entity';
import { SocketIdMap } from './socketIdMap.entity';
export declare class Player {
    userId: number;
    socketId: SocketIdMap;
    roomId: Room;
    isGameOn: boolean;
    isGameReadyToStart: boolean;
    createdAt: Date;
    updatedAt: Date;
}
