import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { User } from 'src/users/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { TurnEvaluateRequestDto } from './dto/evaluate.request.dto';
import { TurnResultDataInsertDto } from './dto/turn-result.data.insert.dto';
import { TurnDataInsertDto } from './dto/turn.data.insert.dto';
import { GameResult } from './entities/gameResult.entity';
import { Player } from './entities/player.entity';
import { Room } from './entities/room.entity';
import { TodayResult } from './entities/todayResult.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';
import { PlayersService } from './players.service';
import { RoomService } from './room.service';
import { scoreMap } from './util/score.map';
import { getTodayDate } from './util/today.date.constructor';

const keywords = ['MVC패턴', 'OOP', 'STACK', 'QUEUE', '함수형 프로그래밍', '메모리 계층'];

@Injectable()
export class GamesService {
    constructor(
        private readonly roomService: RoomService,
        private readonly playersService: PlayersService,
        @InjectRepository(Turn)
        private readonly turnRepository: Repository<Turn>,
        @InjectRepository(TurnResult)
        private readonly turnResultRepository: Repository<TurnResult>,
        @InjectRepository(GameResult)
        private readonly gameResultRepository: Repository<GameResult>,
        @InjectRepository(TodayResult)
        private readonly todayResultRepository: Repository<TodayResult>,
    ) {}

    async createTurnResult(turnResult: TurnResultDataInsertDto) {
        return await this.turnResultRepository.save(turnResult);
    }

    async updateGameResult(gameResultId: number, gameScore: number) {
        return await this.gameResultRepository.save({ gameResultId, gameScore });
    }

    async updateTodayResult(todayResultId: number, gameScore: number) {
        return await this.todayResultRepository.increment(
            { todayResultId },
            'todayScore',
            gameScore,
        );
    }

    async deleteTurnByRoomId(roomInfo: number): Promise<void> {
        await this.turnRepository.softDelete({ roomInfo });
    }

    async createGameResultPerPlayer(roomId) {
        const playersUserId = await this.playersService.getAllPlayersUserIdByRoomID(roomId);

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
        const room: Room = await this.roomService.getOneRoomByRoomId(roomId);
        let index = room.turns.length;

        const newTurnData: TurnDataInsertDto = {
            roomInfo: room.roomId,
            turn: index + 1,
            currentEvent: 'start',
            speechPlayer: room.players[index].userInfo,
            speechPlayerNickname: room.players[index].user.nickname,
            keyword: keywords[index],
            hint: null,
        };

        const turn = await this.turnRepository.save(newTurnData);
        scoreMap[roomId][turn.turn] = [];

        return turn;
    }

    async updateTurn(turn: Turn, timer: string): Promise<Turn> {
        turn.currentEvent = timer;
        return await this.turnRepository.save(turn);
    }

    async recordPlayerScore(user: User, roomId: number): Promise<TurnResult> {
        const room: Room = await this.roomService.getOneRoomByRoomId(roomId);
        const currentTurn = room.turns.at(-1);

        const turnResults: TurnResult[] = await this.turnResultRepository.find({
            where: { roomId, turn: currentTurn.turn },
        });
        for (let result of turnResults) {
            if (user.nickname === result.nickname) {
                throw new SocketException('정답을 이미 맞추셨습니다!', 400, 'send-chat');
            }
        }
        const myRank = turnResults.length;
        const score = 100 - myRank * 20;
        const gameResult: GameResult = await this.gameResultRepository.findOne({
            where: {
                userInfo: user.userId,
                roomId: room.roomId,
            },
        });
        const turnResult: TurnResultDataInsertDto = {
            gameResultInfo: gameResult.gameResultId,
            roomId: room.roomId,
            turn: currentTurn.turn,
            userId: user.userId,
            nickname: user.nickname,
            score,
            keyword: currentTurn.keyword,
            isSpeech: false,
        };
        return await this.createTurnResult(turnResult);
    }

    async saveEvaluationScore(roomId: number, data: TurnEvaluateRequestDto) {
        const { score, turn } = data;
        // TODO : redis 붙이고 cache로 이동
        scoreMap[roomId][turn].push(score);
        console.log('중간점수 합계 : ');
    }

    async recordSpeechPlayerScore(roomId: number, turn: number, userId: number, nickname: string) {
        const room = await this.roomService.getOneRoomByRoomIdWithTurnKeyword(roomId);

        const gameResult: GameResult = await this.gameResultRepository.findOne({
            where: { userInfo: userId, roomId },
            select: { gameResultId: true },
        });

        // 만약 참가자 중 발제자 평가를 하지 않은 사람이 있다면, 무조건 5점 준걸로 간주
        const unevaluatedNum = room.players.length - 1 - scoreMap[roomId][turn].length;

        let sum: number = 0;
        for (let score of scoreMap[roomId][turn]) {
            sum += score;
        }

        const score: number = ((unevaluatedNum * 5 + sum) * 20) / (room.players.length - 1);

        const turnResult: TurnResultDataInsertDto = {
            gameResultInfo: gameResult.gameResultId,
            roomId,
            turn,
            userId,
            nickname,
            score,
            keyword: room.turns[turn - 1].keyword,
            isSpeech: true,
        };
        return await this.createTurnResult(turnResult);
    }

    async handleGameEndEvent(room: Room): Promise<Room> {
        // 게임에 참여한 모든 플레이어의 gameResult 업데이트
        // 1. roomId로 gameResult 조회
        const playerUserIds = await this.gameResultRepository.find({
            where: { roomId: room.roomId },
            select: { gameResultId: true, userInfo: true, todayResultInfo: true },
        });

        for (let user of playerUserIds) {
            console.log(user);
            const { sum } = await this.turnResultRepository
                .createQueryBuilder('turnResult')
                .select('SUM(turnResult.score)', 'sum')
                .where('turnResult.roomId = :roomId', { roomId: room.roomId })
                .andWhere('turnResult.userId = :userId', { userId: user.userInfo })
                .getRawOne();

            const gameResult = await this.updateGameResult(user.gameResultId, Number(sum));
            console.log('gameResult :', gameResult);

            await this.updateTodayResult(user.todayResultInfo, Number(sum));
        }

        // player's isReady to false
        let users: { userInfo: number; isReady: boolean }[] = [];
        for (let player of room.players) {
            users.push({ userInfo: player.userInfo, isReady: false });
        }
        await this.playersService.updateAllPlayerStatusByUserId(users);

        // room's isGameOn to false
        return await this.roomService.updateRoomStatusByRoomId({
            roomId: room.roomId,
            isGameReadyToStart: false,
            isGameOn: false,
        });
    }
}
