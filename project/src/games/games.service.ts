import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { Repository } from 'typeorm';
import { TurnDataInsertDto } from './dto/turn.data.insert.dto';
import { GameResult } from './entities/gameResult.entity';
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

    async createGameResultPerPlayer(roomId) {
        const playersUserId = await this.playerRepository.find({
            where: { roomInfo: roomId },
            select: { userInfo: true },
        });

        let data = [];
        for (let userId of playersUserId) {
            data.push({
                roomId,
                userInfo: userId.userInfo,
            });
        }

        await this.gameResultRepository.save(data);
    }

    async createTurn(roomId: number) {
        const room = await this.roomRepository.findOne({ where: { roomId } });
        let index = room.turns.length;
        console.log('createTurn 유저 닉네임!', room.players[index].user.nickname);

        const newTurnData: TurnDataInsertDto = {
            roomInfo: room.roomId,
            turn: index + 1,
            currentEvent: 'start',
            speechPlayer: room.players[index].user.nickname,
            keyword: keywords[index],
            hint: null,
        };
        return await this.turnRepository.save(newTurnData);
    }

    async updateTurn(turn: Turn, timer: string): Promise<Turn> {
        turn.currentEvent = timer;
        console.log('updateTurn data : ', turn);

        return await this.turnRepository.save(turn);
    }
}
