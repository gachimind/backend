import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { setTimeout } from 'timers/promises';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { KeywordService } from 'src/keyword/keyword.service';
import { PlayersService } from './players.service';
import { RoomService } from './room.service';
import { GameResult } from './entities/gameResult.entity';
import { Room } from './entities/room.entity';
import { TodayResult } from './entities/todayResult.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';
import { TurnResultDataInsertDto } from './dto/turn-result.data.insert.dto';
import { TurnDataInsertDto } from './dto/turn.data.insert.dto';
import { gameTimerMap } from './util/game-timer.map';
import { gameMap } from './util/game.map';
import { turnMap } from './util/turn.map';
import { getDate } from './util/today.date.constructor';
import { Player } from './entities/player.entity';
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

    async getTurnByTurnId(turnId: number): Promise<Turn> {
        return await this.turnRepository.findOne({
            where: { turnId },
            select: {
                turn: true,
                currentEvent: true,
                speechPlayer: true,
                keyword: true,
            },
        });
    }

    async createTurn(roomId: number): Promise<Turn> {
        const turnIndex: number = gameMap[roomId].currentTurn.turn;
        const speechPlayer: number = this.popPlayerFromGameMapRemainingTurns(roomId);
        const nickname = await this.playersService.getPlayerByUserId(speechPlayer);
        const keyword: Keyword = this.popGameMapKeywords(roomId);

        // TODO : keyword random으로 가져오기
        const newTurnData: TurnDataInsertDto = {
            roomInfo: roomId,
            turn: turnIndex + 1,
            currentEvent: 'start',
            speechPlayer,
            speechPlayerNickname: nickname.user.nickname,
            keyword: keyword.keyword,
            hint: keyword.hint,
            link: keyword.link,
        };

        const turn = await this.turnRepository.save(newTurnData);
        this.updateGameMapCurrentTurn(roomId, turn.turnId, turn.turn);
        this.createTurnMap(roomId, turn.turnId, keyword);

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
        const turn = await this.turnRepository.findOneBy({
            turnId: this.getGameMapCurrentTurnId(roomId),
        });
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
            link: turn.link,
            isSpeech: false,
        };
        this.updateTurnMapTurnQuizRank(roomId);
        // this.updateTurnMapTurnAnswerPlayersTrue(roomId, userId);
        return await this.createTurnResult(turnResult);
    }

    // async createPlayerTurnResult(roomId: number, turn: Turn) {
    //     if (this.getTurnMapNumberOfEvaluators(roomId) > this.getTurnMapTurnQuizRank(roomId)) {
    //         const players: Player[] = await this.playersRepository.find({
    //             where: { roomInfo: roomId },
    //         });
    //         const answeredPlayers = this.getTurnMapTurnAnswerPlayers(roomId);
    //         const turnResultData: TurnResultDataInsertDto[] = [];
    //         for (let player of players) {
    //             console.log('createPlayerTurnResult');

    //             if (!answeredPlayers[player.userInfo]) {
    //                 const turnResult: TurnResultDataInsertDto = {
    //                     gameResultInfo: this.getPlayerGameMapGameResultIdMap(
    //                         roomId,
    //                         player.userInfo,
    //                     ),
    //                     roomId,
    //                     turnId: turn.turnId,
    //                     userId: player.userInfo,
    //                     score: 0,
    //                     keyword: turn.keyword,
    //                     link: turn.link,
    //                     isSpeech: false,
    //                 };
    //                 turnResultData.push(turnResult);
    //                 this.updateTurnMapTurnAnswerPlayersTrue(roomId, player.userInfo);
    //             }
    //         }
    //         await this.createTurnResult(turnResultData);
    //     }
    // }

    async createSpeechPlayerTurnResult(roomId: number, turn: Turn): Promise<number> {
        // 평가하지 않은 인원 수
        const unevaluatedNum: number =
            turnMap[roomId].numberOfEvaluators - turnMap[roomId].speechScore.length;

        // 평가 받은 점수 합계 -> speechScore arr pop으로 비워줌
        let sum: number = 0;
        while (turnMap[roomId].speechScore.length) {
            const pop = turnMap[roomId].speechScore.pop();
            sum += pop;
        }
        // 최종 점수 합계
        let score: number = 0;
        if (turnMap[roomId].numberOfEvaluators) {
            score = ((sum + unevaluatedNum * 5) * 20) / turnMap[roomId].numberOfEvaluators;
        }

        const turnResult: TurnResultDataInsertDto = {
            gameResultInfo: gameMap[roomId].gameResultIdMap[turn.speechPlayer],
            roomId,
            turnId: turn.turnId,
            userId: turn.speechPlayer,
            score,
            keyword: turn.keyword,
            link: turn.link,
            isSpeech: true,
        };
        await this.createTurnResult(turnResult);
        // this.updateTurnMapTurnAnswerPlayersTrue(roomId, turn.speechPlayer);

        if (unevaluatedNum) {
            return (unevaluatedNum * 5 * 20) / turnMap[roomId].numberOfEvaluators;
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
        return;
    }

    popGameMapKeywords(roomId: number): Keyword {
        return gameMap[roomId].keywords.pop();
    }
    getGameMapKeywordsCount(roomId: number): number {
        return gameMap[roomId].keywords.length;
    }
    getGameMapRemainingTurns(roomId: number): number {
        return gameMap[roomId].remainingTurns.length;
    }

    getGameMapCurrentTurnId(roomId: number) {
        return gameMap[roomId].currentTurn.turnId;
    }

    getGameMapCurrentTurn(roomId: number): number {
        return gameMap[roomId].currentTurn.turn;
    }

    getGameMapCurrentPlayers(roomId: number): number {
        return gameMap[roomId].currentPlayers;
    }

    // getPlayerGameMapGameResultIdMap(roomId: number, userId: number) {
    //     return gameMap[roomId].gameResultId[userId];
    // }

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

    async mapGameResultIdWithUserId(roomId: number, gameResults: GameResult[]): Promise<void> {
        new Promise((resolve) => {
            for (let result of gameResults) {
                gameMap[roomId].gameResultIdMap[result.userInfo] = result.gameResultId;
            }
            resolve;
        });
    }

    // TurnMap
    // 매 턴이 새로 생성될때, 초기화
    createTurnMap(roomId: number, turnId: number, keyword: Keyword): void {
        turnMap[roomId] = {
            turnId,
            speechScore: [],
            turnQuizRank: 0,
            // turnAnswerPlayers: {},
            numberOfEvaluators: 0,
            keyword,
        };

        // const players: Player[] = await this.playersRepository.find({
        //     where: { roomInfo: roomId },
        // });

        // for (let player of players) {
        //     turnMap[roomId].turnAnswerPlayers[player.userInfo] = false;
        // }
    }

    getTurnMapKeyword(roomId: number): Keyword {
        return turnMap[roomId].keyword;
    }

    // getTurnMapTurnQuizRank(roomId: number) {
    //     return turnMap[roomId].turnQuizRank;
    // }

    // getTurnMapNumberOfEvaluators(roomId: number) {
    //     return turnMap[roomId].numberOfEvaluators;
    // }

    // getTurnMapTurnAnswerPlayers(roomId: number) {
    //     return turnMap[roomId].turnAnswerPlayers;
    // }

    updateTurnMapSpeechScore(roomId: number, score: number): number {
        turnMap[roomId].speechScore.push(score);
        return (score * 20) / turnMap[roomId].numberOfEvaluators;
    }

    updateTurnMapTurnQuizRank(roomId: number): void {
        turnMap[roomId].turnQuizRank++;
    }

    // updateTurnMapTurnAnswerPlayersTrue(roomId: number, userId: number) {
    //     turnMap[roomId].turnAnswerPlayers[userId] = true;
    // }

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
