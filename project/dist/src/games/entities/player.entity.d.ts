import { User } from '../../users/entities/user.entity';
import { Room } from './room.entity';
import { SocketIdMap } from './socketIdMap.entity';
export declare class Player {
    userInfo: number;
    user: User;
    socketInfo: string;
    socket: SocketIdMap;
    roomInfo: number;
    room: Room;
    isReady: boolean;
    isHost: boolean;
    createdAt: Date;
    updatedAt: Date;
}
