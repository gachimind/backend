import { Repository } from 'typeorm';
import { TurnResultDataInsertDto } from './games/dto/turn-result.data.insert.dto';
import { GameResult } from './games/entities/gameResult.entity';
import { TodayResult } from './games/entities/todayResult.entity';
import { TurnResult } from './games/entities/turnResult.entity';
import { TokenMap } from './users/entities/token-map.entity';
import { User } from './users/entities/user.entity';
export declare class AppController {
    private readonly usersRepository;
    private readonly tokenMapRepository;
    private readonly todayResultRepository;
    private readonly gameResultRepository;
    private readonly turnResultRepository;
    constructor(usersRepository: Repository<User>, tokenMapRepository: Repository<TokenMap>, todayResultRepository: Repository<TodayResult>, gameResultRepository: Repository<GameResult>, turnResultRepository: Repository<TurnResult>);
    greetings(): string;
    createTestUser(): Promise<any[]>;
    createTestToken(): Promise<any[]>;
    createTodayResult(): Promise<any[]>;
    createGameResult(): Promise<any[]>;
    createTurnResult(): Promise<(TurnResultDataInsertDto & TurnResult)[]>;
    test(): Promise<number>;
}
