import { Repository } from 'typeorm';
import { TurnDataInsertDto } from './dto/turn.data.insert.dto';
import { GameResult } from './entities/gameResult.entity';
import { Player } from './entities/player.entity';
import { Room } from './entities/room.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';
export declare class GamesService {
    private readonly roomRepository;
    private readonly playerRepository;
    private readonly turnRepository;
    private readonly turnResultRepository;
    private readonly gameResultRepository;
    constructor(roomRepository: Repository<Room>, playerRepository: Repository<Player>, turnRepository: Repository<Turn>, turnResultRepository: Repository<TurnResult>, gameResultRepository: Repository<GameResult>);
    createGameResultPerPlayer(roomId: any): Promise<void>;
    createTurn(roomId: number): Promise<TurnDataInsertDto & Turn>;
    updateTurn(turn: Turn, timer: string): Promise<Turn>;
}
