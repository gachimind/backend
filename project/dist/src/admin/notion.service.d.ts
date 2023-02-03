import { Client } from '@notionhq/client';
import { Repository } from 'typeorm';
import { Player } from '../games/entities/player.entity';
import { Room } from '../games/entities/room.entity';
import { GameResult } from '../games/entities/gameResult.entity';
export declare class NotionService {
    private readonly roomRepository;
    private readonly playerRepository;
    private readonly gameResultRepository;
    notion: Client;
    constructor(roomRepository: Repository<Room>, playerRepository: Repository<Player>, gameResultRepository: Repository<GameResult>);
    createCurrentStat(): Promise<void>;
    updateCurrentStat(): Promise<void>;
    createAccumulatedStat(): Promise<void>;
    updateAccumulatedStat(): Promise<void>;
    updateBugReport(bugDate: any): Promise<void>;
}
