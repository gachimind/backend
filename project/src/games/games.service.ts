import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TurnDataInsertDto } from './dto/turn.data.insert.dto';
import { GameResult } from './entities/gmaeResult.entity';
import { Player } from './entities/player.entity';
import { Room } from './entities/room.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';

const keywords = ['MVC패턴', 'OOP', 'STACKE', 'QUEUE', '함수형 프로그래밍', '메모리 계층'];

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
        @InjectRepository(Turn)
        private readonly turnRepository: Repository<Turn>,
        @InjectRepository(TurnResult)
        private readonly turnResultRepository: Repository<TurnResult>,
        @InjectRepository(GameResult)
        private readonly gameResultRepository: Repository<GameResult>,
    ) {}

    async updateTurn(roomId: number) {
        const room = await this.roomRepository.findOne({ where: { roomId } });
        const turn = room.turns.length;
        const newTurnData: TurnDataInsertDto = {
            roomInfo: room.roomId,
            currentTurn: turn + 1,
            speechPlayerInfo: room.players[turn].user.nickname,
            keyword: keywords[turn],
            hint: null,
        };
        await this.turnRepository.save(newTurnData);
    }
}
