import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { TurnResultDataInsertDto } from './dto/turn-result.data.insert.dto';
import { GameResult } from './entities/gameResult.entity';
import { Room } from './entities/room.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        @InjectRepository(Turn)
        private readonly turnRepository: Repository<Turn>,
        @InjectRepository(TurnResult)
        private readonly turnResultRepository: Repository<TurnResult>,
        @InjectRepository(GameResult)
        private readonly gameResultRepository: Repository<GameResult>,
    ) {}

    checkAnswer(message: string, room: Room): boolean {
        const currentTurn = room.turns.at(-1);
        if (message != currentTurn.keyword) {
            return false;
        }
        return true;
    }
}
