import { Repository } from 'typeorm';
import { TokenMap } from 'src/users/entities/token-map.entity';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { Player } from './entities/player.entity';
import { User } from 'src/users/entities/user.entity';
export declare class PlayersService {
    private readonly tokenMapRepository;
    private readonly socketIdMapRepository;
    private readonly playerRepository;
    constructor(tokenMapRepository: Repository<TokenMap>, socketIdMapRepository: Repository<SocketIdMap>, playerRepository: Repository<Player>);
    getUserBySocketId(socketId: string): Promise<SocketIdMap>;
    getUserByUserID(userId: number): Promise<SocketIdMap>;
    getPlayerBySocketId(socketInfo: string): Promise<Player>;
    updatePlayerStatusByUserId(user: any): Promise<void>;
    removeSocketBySocketId(socketId: string): Promise<number | any>;
    removePlayerByUserId(userId: number | User): Promise<number | any>;
    socketIdMapToLoginUser(token: string, socketId: string): Promise<import("typeorm").InsertResult>;
}
