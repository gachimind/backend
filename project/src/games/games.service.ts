import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { setTimeout } from 'timers/promises';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { PlayersService } from './players.service';
import { RoomService } from './room.service';
import { User } from 'src/users/entities/user.entity';
import { GameResult } from './entities/gameResult.entity';
import { Room } from './entities/room.entity';
import { TodayResult } from './entities/todayResult.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';
import { TurnEvaluateRequestDto } from './dto/evaluate.request.dto';
import { TurnResultDataInsertDto } from './dto/turn-result.data.insert.dto';
import { TurnDataInsertDto } from './dto/turn.data.insert.dto';
import { gameTimerMap } from './util/game-timer.map';
import { gameMap } from './util/game.map';
import { turnMap } from './util/turn.map';
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

    async createTurn(roomId: number): Promise<Turn> {
        const turnIndex: number = gameMap[roomId].currentTurn.turnNumber;
        const speechPlayer: number = this.popPlayerFromGameMapRemainingTurns(roomId);
        const nickname = await this.playersService.getPlayerByUserId(speechPlayer);

        // TODO : keyword random으로 가져오기
        const newTurnData: TurnDataInsertDto = {
            roomInfo: roomId,
            turn: turnIndex + 1,
            currentEvent: 'start',
            speechPlayer,
            speechPlayerNickname: nickname.user.nickname,
            keyword: keywords[turnIndex],
            hint: null,
        };

        const turn = await this.turnRepository.save(newTurnData);
        this.updateGameMapCurrentTurn(roomId, turn.turnId, turn.turn);
        this.createTurnMap(roomId);

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

    async createGameResultPerPlayer(roomId): Promise<GameResult[]> {
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

        return await this.gameResultRepository.save(data);
    }

    async recordPlayerScore(userId: number, room: Room): Promise<TurnResult> {
        const roomId = room.roomId;
        const turn = room.turns.at(-1);
        const gameResultInfo = gameMap[roomId].gameResultIdMap[userId];

        // turnResult를 gameResultId로 검색해서 있으면 예외 처리
        if (
            await this.turnResultRepository.findOneBy({
                gameResultInfo,
            })
        ) {
            throw new SocketException('정답을 이미 맞추셨습니다!', 400, 'send-chat');
        }

        const turnResult: TurnResultDataInsertDto = {
            gameResultInfo,
            roomId,
            turnId: turn.turnId,
            userId,
            score: 100 - turnMap[roomId].turnQuizRank * 20,
            keyword: turn.keyword,
            isSpeech: false,
        };
        this.updateTurnMapTurnQuizRank(roomId);
        return await this.createTurnResult(turnResult);
    }

    // TODO : turn 순서 등 현재 게임정보는 gameMap을 이용하기
    // TODO : gameMap 업데이트
    async createSpeechPalyerTurnResult(roomId: number, turn: Turn) {
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
            userId: turn.speechPlayer,
            score,
            keyword: turn.keyword,
            isSpeech: true,
        };
        console.log('write turnResult :', turnResult);

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

    // ############################## MAPs #################################

    // GameMap
    createGameMap(room: Room): void {
        gameMap[room.roomId] = {
            currentTurn: { turnId: null, turn: 0 },
            currentPlayers: room.players.length,
            remainingTurns: [], // pop으로 사용
            gameResultIdMap: {},
        };

        // 시작할때, remainingTurns 생성 -> 나가거나 turn 생성할때 삭제
        const players = room.players;
        for (let i = players.length - 1; i == 0; i--) {
            gameMap[room.roomId].remainingTurns.push(players[i].userInfo);
        }
        return;
    }

    updateGameMapCurrentTurn(roomId: number, turnId: number, turn: number): void {
        gameMap[roomId].currentTurn = { turnId, turn };
    }

    deductGameMapCurrentPlayers(roomId: number): void {
        gameMap[roomId].currentPlayers--;
    }

    popPlayerFromGameMapRemainingTurns(roomId: number): number {
        return gameMap[roomId].remainingTurns.pop();
    }

    deletePlayerFromGameMapRemainingTurns(roomId: number, userId: number): void {
        gameMap[roomId].remainingSpeeches = gameMap[roomId].remainingSpeeches.filter(
            (e: number) => {
                if (e !== userId) return e;
            },
        );
    }

    mapGameResultIdWithUserId(roomId: number, gameResults): void {
        // 유저 아이디별 gameResult mapping
        for (let result of gameResults) {
            gameMap[roomId].gameResultIdMap[result.userInfo] = result.gameResultId;
        }
        return;
    }

    // TurnMap
    // 매 턴이 새로 생성될때, 초기화
    createTurnMap(roomId: number): void {
        turnMap[roomId] = { speechEvaluate: [], turnQuizRank: 0 };
    }

    updateTurnMapSpeechEvaluate(roomId: number, score: number): void {
        turnMap[roomId].speechEvaluate.push(score);
    }

    updateTurnMapTurnQuizRank(roomId: number): void {
        turnMap[roomId].turnQuizRank++;
    }

    // TimerMap & set timer
    async createTimer(time: number, roomId: number) {
        const ac = new AbortController();
        gameTimerMap[roomId] = {
            ac,
        };
        gameTimerMap[roomId].ac;
        gameTimerMap[roomId].timer = await setTimeout(time, 'timer-end', {
            signal: gameTimerMap[roomId].ac.signal,
        });
        return gameTimerMap[roomId].timer;
    }

    breakTimer(roomId: number) {
        gameTimerMap[roomId].ac.abort();
    }
}
