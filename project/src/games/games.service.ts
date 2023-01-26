import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { MoreThan, Repository } from 'typeorm';
import { TurnDataInsertDto } from './dto/turn.data.insert.dto';
import { GameResult } from './entities/gameResult.entity';
import { Player } from './entities/player.entity';
import { Room } from './entities/room.entity';
import { TodayResult } from './entities/todayResult.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';
import { getTodayDate } from './util/get.today.date';

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
        @InjectRepository(TodayResult)
        private readonly todayResultRepository: Repository<TodayResult>,
    ) {}

    async createGameResultPerPlayer(roomId) {
        const playersUserId = await this.playerRepository.find({
            where: { roomInfo: roomId },
            select: { userInfo: true },
        });

        const today = getTodayDate();
        let data = [];
        for (let userId of playersUserId) {
            const todayResult: TodayResult = await this.todayResultRepository.findOne({
                where: { userInfo: userId.userInfo, createdAt: MoreThan(today) },
            });

            data.push({
                roomId,
                userInfo: userId.userInfo,
                todayResultInfo: todayResult.todayResultId,
            });
        }

        await this.gameResultRepository.save(data);
    }

    async createTurn(roomId: number) {
        const room: Room = await this.roomRepository.findOne({
            where: { roomId },
            order: { players: { createdAt: 'ASC' } },
        });
        let index = room.turns.length;

        const newTurnData: TurnDataInsertDto = {
            roomInfo: room.roomId,
            turn: index + 1,
            currentEvent: 'start',
            speechPlayer: room.players[index].userInfo,
            keyword: keywords[index],
            hint: null,
        };
        return await this.turnRepository.save(newTurnData);
    }

    async updateTurn(turn: Turn, timer: string): Promise<Turn> {
        turn.currentEvent = timer;
        return await this.turnRepository.save(turn);
    }
}
