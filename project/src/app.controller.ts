import { Controller, Get, Post, UseInterceptors, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { Repository } from 'typeorm';
import { ResultToDataInterceptor } from './common/interceptors/resultToData.interceptor';
import { TurnResultDataInsertDto } from './games/dto/turn-result.data.insert.dto';
import { GameResult } from './games/entities/gameResult.entity';
import { Room } from './games/entities/room.entity';
import { TodayResult } from './games/entities/todayResult.entity';
import { Turn } from './games/entities/turn.entity';
import { TurnResult } from './games/entities/turnResult.entity';
import { TokenMap } from './users/entities/token-map.entity';
import { User } from './users/entities/user.entity';

@UseInterceptors(ResultToDataInterceptor)
@Controller()
export class AppController {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(TokenMap)
        private readonly tokenMapRepository: Repository<TokenMap>,
        @InjectRepository(TodayResult)
        private readonly todayResultRepository: Repository<TodayResult>,
        @InjectRepository(GameResult)
        private readonly gameResultRepository: Repository<GameResult>,
        @InjectRepository(TurnResult)
        private readonly turnResultRepository: Repository<TurnResult>,
        @InjectRepository(Turn)
        private readonly turnRepository: Repository<Turn>,
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
    ) {}

    @Get()
    greetings() {
        return `welcome to gachimind project nest server!`;
    }

    @Get('seed/user')
    async createTestUser() {
        const users = [];
        for (let num = 1; num <= 6; num++) {
            users.push({
                email: `test${num}@email.com`,
                nickname: `테스트닉네임${num}`,
                profileImg:
                    'https://ichef.bbci.co.uk/news/640/cpsprodpb/E172/production/_126241775_getty_cats.png',
            });
        }
        return await this.usersRepository.save(users);
    }

    @Get('seed/token')
    async createTestToken() {
        const users = [];
        for (let num = 1; num <= 6; num++) {
            users.push({
                userInfo: num,
                token: `token${num}`,
            });
        }
        return await this.tokenMapRepository.save(users);
    }

    @Get('seed/result/today')
    async createTodayResult() {
        const results = [];
        for (let num = 1; num <= 6; num++) {
            results.push({
                userInfo: num,
                todayScore: num * 1000,
            });
        }
        return await this.todayResultRepository.save(results);
    }

    @Get('seed/result/game')
    async createGameResult() {
        const results = [];
        for (let num = 1; num <= 6; num++) {
            for (let userInfo = 1; userInfo <= 6; userInfo++) {
                results.push({
                    roomId: 1000 + num,
                    userInfo,
                    todayResultInfo: userInfo,
                });
            }
        }
        return await this.gameResultRepository.save(results);
    }

    @Get('seed/result/turn')
    async createTurnResult() {
        const keywords = ['MVC패턴', 'OOP', 'STACKE', 'QUEUE', '함수형 프로그래밍', '메모리 계층'];
        const results: TurnResultDataInsertDto[] = [];

        for (let userId = 1; userId <= 6; userId++) {
            const gameResults: GameResult[] = await this.gameResultRepository.find({
                where: { userInfo: userId },
                select: { gameResultId: true, roomId: true },
            });
            const user: User = await this.usersRepository.findOneBy({ userId });

            for (let gameResult of gameResults) {
                let turn = 1;
                while (turn <= 6) {
                    results.push({
                        gameResultInfo: gameResult.gameResultId,
                        roomId: gameResult.roomId,
                        userId,
                        turn,
                        nickname: user.nickname,
                        score: 20 * (userId - 1),
                        keyword: keywords[turn - 1],
                        isSpeech: turn === userId ? true : false,
                    });
                    turn++;
                }
            }
        }

        return await this.turnResultRepository.save(results);
    }

    @Get('test')
    async test() {
        return this.gameResultRepository
            .createQueryBuilder('gameResult')
            .select('SUM(turnResults.score)', 'sum')
            .where('userInfo = :id', { id: 8 })
            .getRawMany();
    }
}
