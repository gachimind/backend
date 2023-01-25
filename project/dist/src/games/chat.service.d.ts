import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { GameResult } from './entities/gameResult.entity';
import { Room } from './entities/room.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';
export declare class ChatService {
    private readonly roomRepository;
    private readonly turnRepository;
    private readonly turnResultRepository;
    private readonly gameResultRepository;
    constructor(roomRepository: Repository<Room>, turnRepository: Repository<Turn>, turnResultRepository: Repository<TurnResult>, gameResultRepository: Repository<GameResult>);
    checkAnswer(message: string, room: Room): boolean;
    recordScore(user: User, roomId: number): Promise<TurnResult>;
}
