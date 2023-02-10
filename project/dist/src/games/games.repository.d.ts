import { Cache } from 'cache-manager';
import { GameMap } from './dto/game.map.dto';
import { TurnMap } from './dto/turn.map.dto';
export declare class GamesRepository {
    private readonly redis;
    constructor(redis: Cache);
    getGameMap(roomId: number): Promise<GameMap>;
    setGameMap(roomId: number, gameMap: GameMap): Promise<void>;
    deleteGameMap(roomId: number): Promise<void>;
    getTurnMap(roomId: number): Promise<TurnMap>;
    setTurnMap(roomId: number, turnMap: TurnMap): Promise<void>;
    deleteTurnMap(roomId: number): Promise<void>;
    private toGameMapKey;
    private toTurnMapKey;
}
