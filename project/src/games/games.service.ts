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
import { getDate } from './util/today.date.constructor';
import { Player } from './entities/player.entity';
import { NextFunction } from 'express';
import { Keyword } from 'src/keyword/entities/keyword.entities';
import { GamesRepository } from './games.repository';
import { GameMap } from './dto/game.map.dto';
import { TurnMap } from './dto/turn.map.dto';
import { gameTimerMap } from './util/game-timer.map';

@Injectable()
export class GamesService {
    constructor(
        private readonly roomService: RoomService,
        private readonly playersService: PlayersService,
        private readonly keywordsService: KeywordService,
        private readonly gamesRepository: GamesRepository,
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
        const turnIndex: number = await this.getGameMapCurrentTurn(roomId);
        const speechPlayer: number = await this.popPlayerFromGameMapRemainingTurns(roomId);
        const nickname = await this.playersService.getPlayerByUserId(speechPlayer);
        const keyword: Keyword = await this.popGameMapKeywords(roomId);

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
        await this.updateGameMapCurrentTurn(roomId, turn.turnId, turn.turn);
        await this.createTurnMap(roomId, turn.turnId, keyword);

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
            turnId: await this.getGameMapCurrentTurnId(roomId),
        });
        const gameResultInfo = await this.getGameMapGameResultIdByUserId(roomId, userId);

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
            score: 100 - (await this.getTurnMapTurnQuizRank(roomId)) * 20,
            keyword: turn.keyword,
            link: turn.link,
            isSpeech: false,
        };
        await this.updateTurnMapTurnQuizRank(roomId);
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
        const turnMap: TurnMap = await this.gamesRepository.getTurnMap(roomId);
        const unevaluatedNum: number = turnMap.numberOfEvaluators - turnMap.speechScore.length;

        // 평가 받은 점수 합계 -> speechScore arr pop으로 비워줌
        let sum: number = 0;
        while (turnMap.speechScore.length) {
            const pop = turnMap.speechScore.pop();
            sum += pop;
        }
        // 최종 점수 합계
        let score: number = 0;
        if (turnMap.numberOfEvaluators) {
            score = ((sum + unevaluatedNum * 5) * 20) / turnMap.numberOfEvaluators;
        }

        const turnResult: TurnResultDataInsertDto = {
            gameResultInfo: await this.getGameMapGameResultIdByUserId(roomId, turn.speechPlayer),
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
            return (unevaluatedNum * 5 * 20) / turnMap.numberOfEvaluators;
        }
        return 0;
    }

    async handleGameEndEvent(room: Room): Promise<Room> {
        // 게임에 참여한 모든 플레이어의 gameResult 업데이트
        const gameMap: GameMap = await this.gamesRepository.getGameMap(room.roomId);
        const playerGameResultIds: number[] = Object.values(gameMap.gameResultIdMap);

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
    async createGameMap(room: Room, gameResults: GameResult[]): Promise<void> {
        const keywords = await this.keywordsService.generateRandomKeyword(room.players.length);

        let gameMap: GameMap = {
            currentTurn: { turnId: null, turn: 0 },
            currentPlayers: room.players.length,
            remainingTurns: [], // pop으로 사용
            gameResultIdMap: {},
            keywords,
        };
        // 시작할때, remainingTurns 생성 -> 나가거나 turn 생성할때 삭제
        new Promise((resolve) => {
            for (let i = room.players.length - 1; i >= 0; i--) {
                gameMap.remainingTurns.push(room.players[i].user.userId);
            }
            resolve;
        });
        gameMap = await this.mapGameResultIdWithUserId(gameResults, gameMap);
        await this.gamesRepository.setGameMap(room.roomId, gameMap);
        return;
    }

    async popGameMapKeywords(roomId: number): Promise<Keyword> {
        const gameMap: GameMap = await this.gamesRepository.getGameMap(roomId);
        const keyword = gameMap.keywords.pop();
        await this.gamesRepository.setGameMap(roomId, gameMap);
        return keyword;
    }
    async getGameMapKeywordsCount(roomId: number): Promise<number> {
        const gameMap: GameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.keywords.length;
    }
    async getGameMapRemainingTurns(roomId: number): Promise<number> {
        const gameMap: GameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.remainingTurns.length;
    }

    async getGameMapCurrentTurnId(roomId: number): Promise<number> {
        const gameMap: GameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.currentTurn.turnId;
    }

    async getGameMapCurrentTurn(roomId: number): Promise<number> {
        const gameMap: GameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.currentTurn.turn;
    }

    async getGameMapCurrentPlayers(roomId: number): Promise<number> {
        const gameMap: GameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.currentPlayers;
    }

    async getGameMapGameResultIdByUserId(roomId: number, userId: number): Promise<number> {
        const gameMap: GameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.gameResultIdMap[userId];
    }

    // getPlayerGameMapGameResultIdMap(roomId: number, userId: number) {
    //     return gameMap[roomId].gameResultId[userId];
    // }

    async updateGameMapCurrentTurn(roomId: number, turnId: number, turn: number): Promise<void> {
        const gameMap: GameMap = await this.gamesRepository.getGameMap(roomId);
        gameMap.currentTurn = { turnId, turn };
        await this.gamesRepository.setGameMap(roomId, gameMap);
    }

    async reduceGameMapCurrentPlayers(roomId: number): Promise<void> {
        const gameMap: GameMap = await this.gamesRepository.getGameMap(roomId);
        gameMap.currentPlayers--;
        await this.gamesRepository.setGameMap(roomId, gameMap);
    }

    async popPlayerFromGameMapRemainingTurns(roomId: number): Promise<number> {
        const gameMap: GameMap = await this.gamesRepository.getGameMap(roomId);
        const turn = gameMap.remainingTurns.pop();
        await this.gamesRepository.setGameMap(roomId, gameMap);
        return turn;
    }

    async removePlayerFromGameMapRemainingTurns(roomId: number, userId: number): Promise<void> {
        const gameMap: GameMap = await this.gamesRepository.getGameMap(roomId);
        new Promise((resolve) => {
            gameMap.remainingTurns = gameMap.remainingTurns.filter((e: number) => {
                if (e !== userId) return e;
            });
            resolve;
        });
        await this.gamesRepository.setGameMap(roomId, gameMap);
    }

    async mapGameResultIdWithUserId(gameResults: GameResult[], gameMap: GameMap): Promise<GameMap> {
        new Promise((resolve) => {
            for (let result of gameResults) {
                gameMap.gameResultIdMap[result.userInfo] = result.gameResultId;
            }
            resolve;
        });
        return gameMap;
    }

    // TurnMap
    // 매 턴이 새로 생성될때, 초기화
    async createTurnMap(roomId: number, turnId: number, keyword: Keyword): Promise<void> {
        const turnMap: TurnMap = {
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

        await this.gamesRepository.setTurnMap(roomId, turnMap);
    }

    async getTurnMapKeyword(roomId: number): Promise<Keyword> {
        const turnMap: TurnMap = await this.gamesRepository.getTurnMap(roomId);
        return turnMap.keyword;
    }

    async getTurnMapTurnQuizRank(roomId: number): Promise<number> {
        const turnMap: TurnMap = await this.gamesRepository.getTurnMap(roomId);
        return turnMap.turnQuizRank;
    }

    // getTurnMapNumberOfEvaluators(roomId: number) {
    //     return turnMap[roomId].numberOfEvaluators;
    // }

    // getTurnMapTurnAnswerPlayers(roomId: number) {
    //     return turnMap[roomId].turnAnswerPlayers;
    // }

    async updateTurnMapSpeechScore(roomId: number, score: number): Promise<number> {
        const turnMap: TurnMap = await this.gamesRepository.getTurnMap(roomId);
        turnMap.speechScore.push(score);
        await this.gamesRepository.setTurnMap(roomId, turnMap);
        return (score * 20) / turnMap.numberOfEvaluators;
    }

    async updateTurnMapTurnQuizRank(roomId: number): Promise<void> {
        const turnMap: TurnMap = await this.gamesRepository.getTurnMap(roomId);
        turnMap.turnQuizRank++;
        await this.gamesRepository.setTurnMap(roomId, turnMap);
    }

    // updateTurnMapTurnAnswerPlayersTrue(roomId: number, userId: number) {
    //     turnMap[roomId].turnAnswerPlayers[userId] = true;
    // }

    async updateTurnMapNumberOfEvaluators(roomInfo: number): Promise<void> {
        const numberOfPlayers: number = await this.playersRepository.countBy({ roomInfo });
        const turnMap: TurnMap = await this.gamesRepository.getTurnMap(roomInfo);
        turnMap.numberOfEvaluators = numberOfPlayers - 1;
        await this.gamesRepository.setTurnMap(roomInfo, turnMap);
    }

    // TimerMap & set timer
    async createTimer(time: number, roomId: number) {
        const ac = new AbortController();
        gameTimerMap[roomId] = {
            ac,
        };
        gameTimerMap[roomId].ac;
        return await setTimeout(time, 'timer-end', {
            signal: gameTimerMap[roomId].ac.signal,
        });
    }

    async breakTimer(roomId: number, next: NextFunction): Promise<void> {
        try {
            gameTimerMap[roomId].ac.abort();
        } catch (err) {
            next();
        }
    }
}
