import { User } from '../../users/entities/user.entity';
import { Player } from './player.entity';
export declare class SocketIdMap {
    socketMapId: number;
    socketId: string;
    userInfo: number;
    user: User;
    player: Player;
    createdAt: Date;
}
