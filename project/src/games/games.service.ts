import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { User } from 'src/users/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { TurnEvaluateRequestDto } from './dto/evaluate.request.dto';
import { TurnResultDataInsertDto } from './dto/turn-result.data.insert.dto';
import { TurnDataInsertDto } from './dto/turn.data.insert.dto';
import { GameResult } from './entities/gameResult.entity';
import { Room } from './entities/room.entity';
import { TodayResult } from './entities/todayResult.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';
import { PlayersService } from './players.service';
import { RoomService } from './room.service';
import { gameTimerMap } from './util/game-timer.map';
import { gameResultIdMap } from './util/game.result.id.map';
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

    async getTurnsByRoomId(roomInfo: number): Promise<Turn[]> {
        return await this.turnRepository.findBy({ roomInfo });
    }

    async getAllTurnsByRoomId(roomInfo: number): Promise<Turn[]> {
        return await this.turnRepository.find({
            where: { roomInfo },
            order: { turn: 'ASC' },
        });
    }

    async createTurn(roomId: number) {
        const room: Room = await this.roomService.getOneRoomByRoomId(roomId);
        console.log(room.turns.length);
        const turnIndex = room.turns.length + 1;
        let playerIndex = 0;
        for (let turn of room.turns) {
            if (turn.speechPlayer != room.players[playerIndex].userInfo) {
                return;
            }
            playerIndex++;
        }

        // TODO : keyword random으로 가져오기
        const newTurnData: TurnDataInsertDto = {
            roomInfo: room.roomId,
            turn: turnIndex,
            currentEvent: 'start',
            speechPlayer: room.players[playerIndex].userInfo,
            speechPlayerNickname: room.players[playerIndex].user.nickname,
            keyword: keywords[turnIndex],
            hint: null,
        };

        const turn = await this.turnRepository.save(newTurnData);
        scoreMap[roomId][room.players[playerIndex].userInfo] = [];

        return turn;
    }

    async updateTurn(turn: Turn, timer: string): Promise<Turn> {
        turn.currentEvent = timer;
        return await this.turnRepository.save(turn);
    }

    async deleteTurnByRoomId(roomInfo: number): Promise<void> {
        await this.turnRepository.delete({ roomInfo });
    }

    async deleteTurnByTurnId(turn: Turn): Promise<void> {
        await this.turnRepository.delete({ turnId: turn.turnId });
        scoreMap[turn.roomInfo][turn.speechPlayer] = null;
    }

    async createTurnResult(turnResult: TurnResultDataInsertDto) {
        return await this.turnResultRepository.save(turnResult);
    }

    async sumTurnScorePerPlayerByUserId(roomId: number, userId: number): Promise<number> {
        const { sum } = await this.turnResultRepository
            .createQueryBuilder('turnResult')
            .select('SUM(turnResult.score)', 'sum')
            .where('turnResult.roomId = :roomId', { roomId })
            .andWhere('turnResult.userId = :userId', { userId })
            .getRawOne();
        return Number(sum);
    }

    async updateGameResult(gameResultId: number, gameScore: number) {
        return await this.gameResultRepository.save({ gameResultId, gameScore });
    }

    async softDeleteGameResult(gameResultId: number) {
        return await this.gameResultRepository.softDelete(gameResultId);
    }

    async updateTodayResultByIncrement(todayResultId: number, gameScore: number) {
        return await this.todayResultRepository.increment(
            { todayResultId },
            'todayScore',
            gameScore,
        );
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

    async mapGameResultIdWithUserId(roomId: number) {
        const gameResults: GameResult[] = await this.gameResultRepository.findBy({ roomId });

        // 유저 아이디별 gameResult mapping
        for (let result of gameResults) {
            gameResultIdMap[roomId][result.userInfo] = result.gameResultId;
        }
    }

    async recordPlayerScore(user: User, room: Room): Promise<TurnResult> {
        const turns = room.turns.sort((a, b) => {
            return a.turn - b.turn;
        });

        let currentTurn: Turn;
        if ((turns.at(-1).currentEvent = 'speechTime')) {
            currentTurn = turns.at(-1);
        }

        // turnResult를 gameResultId로 검색해서 있으면 예외 처리
        if (
            await this.turnResultRepository.findOneBy({
                gameResultInfo: gameResultIdMap[room.roomId][user.userId],
            })
        ) {
            throw new SocketException('정답을 이미 맞추셨습니다!', 400, 'send-chat');
        }

        const turnResults = await this.turnResultRepository.findBy({ turnId: currentTurn.turnId });
        const myRank: number = turnResults.length;
        const score = 100 - myRank * 20;

        const turnResult: TurnResultDataInsertDto = {
            gameResultInfo: gameResultIdMap[room.roomId][user.userId],
            roomId: room.roomId,
            turnId: currentTurn.turnId,
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
        const turnData: Turn = await this.turnRepository.findOne({
            where: { roomInfo: roomId, turn: turn },
        });
        // TODO : redis 붙이고 cache로 이동
        scoreMap[roomId][turnData.speechPlayer].push(score);
    }

    async recordSpeechPlayerScore(roomId: number, turn: Turn) {
        const room = await this.roomService.getOneRoomByRoomIdWithTurnKeyword(roomId);

        // 만약 참가자 중 발제자 평가를 하지 않은 사람이 있다면, 무조건 5점 준걸로 간주
        let sum: number = 0;
        let unevaluatedNum: number = 0;
        if (room.players.length > 1 && scoreMap[roomId][turn] != null) {
            console.log('scoreMap 계산');
            for (let score of scoreMap[roomId][turn]) {
                sum += score;
            }
            unevaluatedNum = room.players.length - 1 - scoreMap[roomId][turn].length;
        }

        let score = sum * 20;
        if (room.players.length - 1) {
            console.log('total score 계산');
            score = ((unevaluatedNum * 5 + sum) * 20) / (room.players.length - 1);
        }

        const gameResultInfo = gameResultIdMap[roomId][turn.speechPlayer];
        const turnResult: TurnResultDataInsertDto = {
            gameResultInfo,
            roomId,
            turnId: turn.turnId,
            turn: turn.turn,
            userId: turn.speechPlayer,
            nickname: turn.speechPlayerNickname,
            score,
            keyword: turn.keyword,
            isSpeech: true,
        };
        console.log('write turnResult :', turnResult);

        return await this.createTurnResult(turnResult);
    }

    async handleGameEndEvent(room: Room): Promise<Room> {
        // gameTimerMap에 기록된 방 타이머 삭제
        delete gameTimerMap[room.roomId];
        // 게임에 참여한 모든 플레이어의 gameResult 업데이트
        // 1. roomId로 gameResult 조회
        const playerUserIds = await this.gameResultRepository.find({
            where: { roomId: room.roomId },
            select: { gameResultId: true, userInfo: true, todayResultInfo: true },
        });

        for (let user of playerUserIds) {
            // player당 게임에서 얻은 점수 합산
            const sum: number = await this.sumTurnScorePerPlayerByUserId(
                room.roomId,
                user.userInfo,
            );
            // gameResult와 todayResult에 합산 점수를++
            await this.updateGameResult(user.gameResultId, sum);
            await this.softDeleteGameResult(user.gameResultId);
            await this.updateTodayResultByIncrement(user.todayResultInfo, sum);
        }

        // delete all turn data
        await this.deleteTurnByRoomId(room.roomId);

        // set player's isReady to false
        let users: { userInfo: number; isReady: boolean }[] = [];
        for (let player of room.players) {
            users.push({ userInfo: player.userInfo, isReady: false });
        }
        await this.playersService.updateAllPlayerStatusByUserId(users);

        // set room's isGameOn to false
        await this.roomService.updateRoomStatusByRoomId({
            roomId: room.roomId,
            isGameReadyToStart: false,
            isGameOn: false,
        });
        // return updated room Info
        return await this.roomService.getOneRoomByRoomId(room.roomId);
    }
}
