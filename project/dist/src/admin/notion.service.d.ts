import { Client } from '@notionhq/client';
import { Repository } from 'typeorm';
import { Player } from '../games/entities/player.entity';
import { Room } from '../games/entities/room.entity';
export declare class NotionService {
    private readonly roomRepository;
    private readonly playerRepository;
    notion: Client;
    constructor(roomRepository: Repository<Room>, playerRepository: Repository<Player>);
    createAccumulatedStat(): Promise<void>;
}
