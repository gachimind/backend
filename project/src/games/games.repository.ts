import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GameMap } from './dto/game.map.dto';
import { TurnMap } from './dto/turn.map.dto';

@Injectable()
export class GamesRepository {
    constructor(@Inject(CACHE_MANAGER) private readonly redis: Cache) {}

    async getGameMap(roomId: number): Promise<GameMap> {
        const key = this.toGameMapKey(roomId);
        return await this.redis.get(key);
    }

    async setGameMap(roomId: number, gameMap: GameMap): Promise<void> {
        const key = this.toGameMapKey(roomId);
        await this.redis.set(key, gameMap);
    }

    async deleteGameMap(roomId: number): Promise<void> {
        const key = this.toGameMapKey(roomId);
        return await this.redis.del(key);
    }

    async getTurnMap(roomId: number): Promise<TurnMap> {
        const key = this.toTurnMapKey(roomId);
        return await this.redis.get(key);
    }

    async setTurnMap(roomId: number, turnMap: TurnMap): Promise<void> {
        const key = this.toTurnMapKey(roomId);
        await this.redis.set(key, turnMap);
    }

    async deleteTurnMap(roomId: number): Promise<void> {
        const key = this.toTurnMapKey(roomId);
        return await this.redis.del(key);
    }

    private toGameMapKey(roomId: Number): string {
        return `gameMap[${roomId}]`;
    }

    private toTurnMapKey(roomId: Number): string {
        return `turnMap[${roomId}]`;
    }
}
