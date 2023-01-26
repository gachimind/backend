import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { TurnEvaluateRequestDto } from './dto/evaluate.request.dto';
import { TurnResultDataInsertDto } from './dto/turn-result.data.insert.dto';
import { TurnDataInsertDto } from './dto/turn.data.insert.dto';
import { GameResult } from './entities/gameResult.entity';
import { Player } from './entities/player.entity';
import { Room } from './entities/room.entity';
import { TodayResult } from './entities/todayResult.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';
export declare class GamesService {
    private readonly roomRepository;
    private readonly playerRepository;
    private readonly turnRepository;
    private readonly turnResultRepository;
    private readonly gameResultRepository;
    private readonly todayResultRepository;
    constructor(roomRepository: Repository<Room>, playerRepository: Repository<Player>, turnRepository: Repository<Turn>, turnResultRepository: Repository<TurnResult>, gameResultRepository: Repository<GameResult>, todayResultRepository: Repository<TodayResult>);
    createTurnResult(turnResult: TurnResultDataInsertDto): Promise<TurnResultDataInsertDto & TurnResult>;
    createGameResultPerPlayer(roomId: any): Promise<void>;
    createTurn(roomId: number): Promise<TurnDataInsertDto & Turn>;
    updateTurn(turn: Turn, timer: string): Promise<Turn>;
    recordPlayerScore(user: User, roomId: number): Promise<TurnResult>;
    saveEvaluationScore(roomId: number, data: TurnEvaluateRequestDto): Promise<void>;
    recordSpeechPlayerScore(roomId: number, turn: number, userId: number, nickname: string): Promise<TurnResultDataInsertDto & TurnResult>;
}
