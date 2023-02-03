import { Repository } from 'typeorm';
import { LoginUserToSocketIdMapDto } from 'src/games/dto/socketId-map.request.dto';
import { TokenMap } from 'src/users/entities/token-map.entity';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { Player } from './entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import { TodayResult } from './entities/todayResult.entity';
export declare class PlayersService {
    private readonly tokenMapRepository;
    private readonly socketIdMapRepository;
    private readonly playerRepository;
    private readonly todayResultRepository;
    constructor(tokenMapRepository: Repository<TokenMap>, socketIdMapRepository: Repository<SocketIdMap>, playerRepository: Repository<Player>, todayResultRepository: Repository<TodayResult>);
    getUserIdByToken(token: string): Promise<User>;
    getUserBySocketId(socketId: string): Promise<SocketIdMap>;
    getUserByUserID(userId: number): Promise<SocketIdMap>;
    getPlayerBySocketId(socketInfo: string): Promise<Player>;
    getAllPlayersUserIdByRoomID(roomId: number): Promise<Player[]>;
    updatePlayerStatusByUserId(user: any): Promise<Player>;
    updateAllPlayerStatusByUserId(users: {
        userInfo: number;
        isReady: boolean;
    }[]): Promise<Player[]>;
    removeSocketBySocketId(socketId: string, userId: number): Promise<number | any>;
    removePlayerByUserId(userId: number | User): Promise<number | any>;
    socketIdMapToLoginUser(userInfo: number, socketId: string): Promise<LoginUserToSocketIdMapDto & SocketIdMap>;
    createTodayResult(userInfo: number): Promise<void>;
    setPlayerReady(player: Player): Promise<Player>;
}
