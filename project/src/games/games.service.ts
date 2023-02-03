import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { setTimeout } from 'timers/promises';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { KeywordService } from 'src/keyword/keyword.service';
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
import { getDate } from './util/today.date.constructor';
import { Player } from './entities/player.entity';
import { nextTick } from 'process';
import { NextFunction } from 'express';
import { Keyword } from 'src/keyword/entities/keyword.entities';

@Injectable()
export class GamesService {
    constructor(
        private readonly roomService: RoomService,
        private readonly playersService: PlayersService,
        private readonly keywordsService: KeywordService,
        @InjectRepository(Player)
        private readonly playersRepository: Repository<Player>,
        @InjectRepository(Turn)
        private readonly turnRepository: Repository<Turn>,
        @InjectRepository(TurnResult)
        private readonly turnResultRepository: Repository<TurnResult>,
        @InjectRepository(GameResult)
        private readonly gameResultRepository: Repository<GameResult>,
        @InjectRepository(TodayResult)
        private readonly todayResultRepository: Repository<TodayResult>,
    ) {}

    // ######################### Turn ##################################
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
        const turnIndex: number = gameMap[roomId].currentTurn.turn;
        const speechPlayer: number = this.popPlayerFromGameMapRemainingTurns(roomId);
        const nickname = await this.playersService.getPlayerByUserId(speechPlayer);
        const keyword: Keyword = this.popGameMapKeywords(roomId);
        console.log('createTurn :', keyword);

        // TODO : keyword random으로 가져오기
        const newTurnData: TurnDataInsertDto = {
            roomInfo: roomId,
            turn: turnIndex + 1,
            currentEvent: 'start',
            speechPlayer,
            speechPlayerNickname: nickname.user.nickname,
            keyword: keyword.keywordKor,
            hint: keyword.keywordEng,
        };

        const turn = await this.turnRepository.save(newTurnData);
        this.updateGameMapCurrentTurn(roomId, turn.turnId, turn.turn);
        this.createTurnMap(roomId, keyword);

        return turn;
    }

    async updateTurn(turn: Turn, timer: string): Promise<Turn> {
        turn.currentEvent = timer;
        return await this.turnRepository.save(turn);
    }

    async deleteTurnByRoomId(roomInfo: number): Promise<void> {
        await this.turnRepository.delete({ roomInfo });
    }

    async deleteTurnByTurnId(turnId: number): Promise<void> {
        await this.turnRepository.delete({ turnId });
    }

    // ######################### TurnResults ##################################
    async createTurnResult(turnResult: TurnResultDataInsertDto) {
        return await this.turnResultRepository.save(turnResult);
    }

    async sumTurnScorePerPlayerByUserId(roomId: number, gameResultId: number): Promise<number> {
        const { sum } = await this.turnResultRepository
            .createQueryBuilder('turnResult')
            .select('SUM(turnResult.score)', 'sum')
            .where('turnResult.roomId = :roomId', { roomId })
            .andWhere('turnResult.gameResultInfo = :gameResultId', { gameResultId })
            .getRawOne();
        return Number(sum);
    }

    // ######################### GameResult ##################################
    async createGameResultPerPlayer(roomId: number): Promise<GameResult[]> {
        const allPlayersInRoom = await this.playersService.getAllPlayersUserIdByRoomID(roomId);

        let data = [];
        for (let player of allPlayersInRoom) {
            const today = getDate();
            const todayResult: TodayResult = await this.todayResultRepository.findOne({
                where: { userInfo: player.userInfo, createdAt: MoreThan(today) },
                select: { todayResultId: true, createdAt: true },
            });
            console.log('find TodayResult to make gameResult :', {
                id: todayResult.todayResultId,
                createdAt: todayResult.createdAt,
            });

            data.push({
                roomId,
                userInfo: player.userInfo,
                todayResultInfo: todayResult.todayResultId,
            });
        }

        return await this.gameResultRepository.save(data);
    }

    async updateGameResult(gameResultId: number, gameScore: number) {
        return await this.gameResultRepository.save({ gameResultId, gameScore });
    }

    async softDeleteGameResult(gameResultId: number) {
        return await this.gameResultRepository.softDelete(gameResultId);
    }

    // ######################### TodayResult ##################################
    async updateTodayResultByIncrement(todayResultId: number, gameScore: number) {
        return await this.todayResultRepository.increment(
            { todayResultId },
            'todayScore',
            gameScore,
        );
    }

    // ######################### [logic] ##################################
    async recordPlayerScore(userId: number, room: Room): Promise<TurnResult> {
        const roomId = room.roomId;
        const turn = room.turns.at(-1);
        const gameResultInfo = gameMap[roomId].gameResultIdMap[userId];

        // turnResult를 검색해서 있으면 예외 처리
        if (
            await this.turnResultRepository.findOne({
                where: { userId, turnId: turn.turnId },
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

    async createSpeechPlayerTurnResult(roomId: number, turn: Turn): Promise<number> {
        console.log('createSpeechPlayerTurnResult', 'speechPlayer :', turn.speechPlayer);

        // 평가하지 않은 인원 수
        const unevaluatedNum: number =
            turnMap[roomId].numberOfEvaluators - turnMap[roomId].speechScore.length;
        console.log('speechPlayer unevaluatedNum :', unevaluatedNum);
        console.log('number of evaluators :', turnMap[roomId].numberOfEvaluators);

        // 평가 받은 점수 합계 -> speechScore arr pop으로 비워줌
        let sum: number = 0;
        while (turnMap[roomId].speechScore.length) {
            const pop = turnMap[roomId].speechScore.pop();
            sum += pop;
        }
        console.log('speechPlayer sum :', sum);
        // 최종 점수 합계
        let score: number = 0;
        if (turnMap[roomId].numberOfEvaluators) {
            score = ((sum + unevaluatedNum * 5) * 20) / turnMap[roomId].numberOfEvaluators;
            console.log('speechPlayer score :', score);
        }

        const turnResult: TurnResultDataInsertDto = {
            gameResultInfo: gameMap[roomId].gameResultIdMap[turn.speechPlayer],
            roomId,
            turnId: turn.turnId,
            userId: turn.speechPlayer,
            score,
            keyword: turn.keyword,
            isSpeech: true,
        };
        await this.createTurnResult(turnResult);

        if (unevaluatedNum) {
            return (unevaluatedNum * 5 * 20) / unevaluatedNum;
        }
        return 0;
    }

    async handleGameEndEvent(room: Room): Promise<Room> {
        // 게임에 참여한 모든 플레이어의 gameResult 업데이트
        const playerGameResultIds: number[] = Object.values(gameMap[room.roomId].gameResultIdMap);

        for (let gameResultId of playerGameResultIds) {
            // 1. roomId로 gameResult 조회
            const gameResult = await this.gameResultRepository.findOne({
                where: { gameResultId: gameResultId },
                select: { gameResultId: true, userInfo: true, todayResultInfo: true },
            });

            // player당 게임에서 얻은 점수 합산
            const sum: number = await this.sumTurnScorePerPlayerByUserId(room.roomId, gameResultId);
            // gameResult와 todayResult에 합산 점수를++
            await this.updateGameResult(gameResultId, sum);
            await this.softDeleteGameResult(gameResultId);
            await this.updateTodayResultByIncrement(gameResult.todayResultInfo, sum);
        }

        // delete all turn data
        await this.deleteTurnByRoomId(room.roomId);

        // 게임 종료 후 방이 계속 남아있는지 확인
        room = await this.roomService.getOneRoomByRoomId(room.roomId);
        if (!room) {
            return room;
        }
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
    async createGameMap(room: Room): Promise<void> {
        const keywords = await this.keywordsService.generateRandomKeyword(room.players.length);

        gameMap[room.roomId] = {
            currentTurn: { turnId: null, turn: 0 },
            currentPlayers: room.players.length,
            remainingTurns: [], // pop으로 사용
            gameResultIdMap: {},
            keywords,
        };

        // 시작할때, remainingTurns 생성 -> 나가거나 turn 생성할때 삭제
        new Promise((resolve) => {
            for (let i = room.players.length - 1; i >= 0; i--) {
                gameMap[room.roomId].remainingTurns.push(room.players[i].user.userId);
            }
            resolve;
        });
        console.log(gameMap[room.roomId]);

        return;
    }

    popGameMapKeywords(roomId: number): Keyword {
        return gameMap[roomId].keywords.pop();
    }

    getGameMapCurrentTurn(roomId: number) {
        return gameMap[roomId].currentTurn.turn;
    }

    getGameMapCurrentPlayers(roomId: number) {
        return gameMap[roomId].currentPlayers;
    }

    updateGameMapCurrentTurn(roomId: number, turnId: number, turn: number): void {
        gameMap[roomId].currentTurn = { turnId, turn };
    }

    reduceGameMapCurrentPlayers(roomId: number): void {
        gameMap[roomId].currentPlayers--;
    }

    popPlayerFromGameMapRemainingTurns(roomId: number): number {
        return gameMap[roomId].remainingTurns.pop();
    }

    async removePlayerFromGameMapRemainingTurns(roomId: number, userId: number): Promise<void> {
        new Promise((resolve) => {
            gameMap[roomId].remainingTurns = gameMap[roomId].remainingTurns.filter((e: number) => {
                if (e !== userId) return e;
            });
            resolve;
        });
    }

    async mapGameResultIdWithUserId(roomId: number, gameResults): Promise<void> {
        new Promise((resolve) => {
            for (let result of gameResults) {
                gameMap[roomId].gameResultIdMap[result.userInfo] = result.gameResultId;
            }
            resolve;
        });
    }

    // TurnMap
    // 매 턴이 새로 생성될때, 초기화
    createTurnMap(roomId: number, keyword: Keyword): void {
        turnMap[roomId] = { speechScore: [], turnQuizRank: 0, numberOfEvaluators: 0, keyword };
    }

    updateTurnMapSpeechScore(roomId: number, score: number): number {
        turnMap[roomId].speechScore.push(score);
        return (score * 20) / turnMap[roomId].numberOfEvaluators;
    }

    updateTurnMapTurnQuizRank(roomId: number): void {
        turnMap[roomId].turnQuizRank++;
    }

    async updateTurnMapNumberOfEvaluators(roomInfo) {
        const numberOfPlayers: number = await this.playersRepository.countBy({ roomInfo });

        turnMap[roomInfo].numberOfEvaluators = numberOfPlayers - 1;
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

    breakTimer(roomId: number, next: NextFunction) {
        try {
            gameTimerMap[roomId].ac.abort();
        } catch (ett) {
            next();
        }
    }
}
