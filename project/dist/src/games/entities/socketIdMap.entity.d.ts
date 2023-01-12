import { User } from '../../users/entities/user.entity';
import { Room } from './room.entity';
export declare class SocketIdMap {
    id: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    currentRoom: Room;
}
