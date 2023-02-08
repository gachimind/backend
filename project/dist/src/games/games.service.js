"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promises_1 = require("timers/promises");
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
const keyword_service_1 = require("../keyword/keyword.service");
const players_service_1 = require("./players.service");
const room_service_1 = require("./room.service");
const gameResult_entity_1 = require("./entities/gameResult.entity");
const todayResult_entity_1 = require("./entities/todayResult.entity");
const turn_entity_1 = require("./entities/turn.entity");
const turnResult_entity_1 = require("./entities/turnResult.entity");
const today_date_constructor_1 = require("./util/today.date.constructor");
const player_entity_1 = require("./entities/player.entity");
const games_repository_1 = require("./games.repository");
const game_timer_map_1 = require("./util/game-timer.map");
let GamesService = class GamesService {
    constructor(roomService, playersService, keywordsService, gamesRepository, playersRepository, turnRepository, turnResultRepository, gameResultRepository, todayResultRepository) {
        this.roomService = roomService;
        this.playersService = playersService;
        this.keywordsService = keywordsService;
        this.gamesRepository = gamesRepository;
        this.playersRepository = playersRepository;
        this.turnRepository = turnRepository;
        this.turnResultRepository = turnResultRepository;
        this.gameResultRepository = gameResultRepository;
        this.todayResultRepository = todayResultRepository;
    }
    async getTurnsByRoomId(roomInfo) {
        return await this.turnRepository.findBy({ roomInfo });
    }
    async getAllTurnsByRoomId(roomInfo) {
        return await this.turnRepository.find({
            where: { roomInfo },
            order: { turn: 'ASC' },
        });
    }
    async getTurnByTurnId(turnId) {
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
    async createTurn(roomId) {
        const turnIndex = await this.getGameMapCurrentTurn(roomId);
        const speechPlayer = await this.popPlayerFromGameMapRemainingTurns(roomId);
        const nickname = await this.playersService.getPlayerByUserId(speechPlayer);
        const keyword = await this.popGameMapKeywords(roomId);
        const newTurnData = {
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
    async updateTurn(turn, timer) {
        turn.currentEvent = timer;
        return await this.turnRepository.save(turn);
    }
    async deleteTurnByRoomId(roomInfo) {
        await this.turnRepository.delete({ roomInfo });
    }
    async deleteTurnByTurnId(turnId) {
        await this.turnRepository.delete({ turnId });
    }
    async createTurnResult(turnResult) {
        return await this.turnResultRepository.save(turnResult);
    }
    async sumTurnScorePerPlayerByUserId(roomId, gameResultId) {
        const { sum } = await this.turnResultRepository
            .createQueryBuilder('turnResult')
            .select('SUM(turnResult.score)', 'sum')
            .where('turnResult.roomId = :roomId', { roomId })
            .andWhere('turnResult.gameResultInfo = :gameResultId', { gameResultId })
            .getRawOne();
        return Number(sum);
    }
    async createGameResultPerPlayer(roomId) {
        const allPlayersInRoom = await this.playersService.getAllPlayersUserIdByRoomID(roomId);
        let data = [];
        for (let player of allPlayersInRoom) {
            const today = (0, today_date_constructor_1.getDate)();
            const todayResult = await this.todayResultRepository.findOne({
                where: { userInfo: player.userInfo, createdAt: (0, typeorm_2.MoreThan)(today) },
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
    async updateGameResult(gameResultId, gameScore) {
        return await this.gameResultRepository.save({ gameResultId, gameScore });
    }
    async softDeleteGameResult(gameResultId) {
        return await this.gameResultRepository.softDelete(gameResultId);
    }
    async updateTodayResultByIncrement(todayResultId, gameScore) {
        return await this.todayResultRepository.increment({ todayResultId }, 'todayScore', gameScore);
    }
    async recordPlayerScore(userId, room) {
        const roomId = room.roomId;
        const turn = await this.turnRepository.findOneBy({
            turnId: await this.getGameMapCurrentTurnId(roomId),
        });
        const gameResultInfo = await this.getGameMapGameResultIdByUserId(roomId, userId);
        if (await this.turnResultRepository.findOne({
            where: { userId, turnId: turn.turnId },
        })) {
            throw new ws_exception_filter_1.SocketException('정답을 이미 맞추셨습니다!', 400, 'send-chat');
        }
        const turnResult = {
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
        return await this.createTurnResult(turnResult);
    }
    async createSpeechPlayerTurnResult(roomId, turn) {
        const turnMap = await this.gamesRepository.getTurnMap(roomId);
        const unevaluatedNum = turnMap.numberOfEvaluators - turnMap.speechScore.length;
        let sum = 0;
        while (turnMap.speechScore.length) {
            const pop = turnMap.speechScore.pop();
            sum += pop;
        }
        let score = 0;
        if (turnMap.numberOfEvaluators) {
            score = ((sum + unevaluatedNum * 5) * 20) / turnMap.numberOfEvaluators;
        }
        const turnResult = {
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
        if (unevaluatedNum) {
            return (unevaluatedNum * 5 * 20) / turnMap.numberOfEvaluators;
        }
        return 0;
    }
    async handleGameEndEvent(room) {
        const gameMap = await this.gamesRepository.getGameMap(room.roomId);
        const playerGameResultIds = Object.values(gameMap.gameResultIdMap);
        for (let gameResultId of playerGameResultIds) {
            const gameResult = await this.gameResultRepository.findOne({
                where: { gameResultId: gameResultId },
                select: { gameResultId: true, userInfo: true, todayResultInfo: true },
            });
            const sum = await this.sumTurnScorePerPlayerByUserId(room.roomId, gameResultId);
            await this.updateGameResult(gameResultId, sum);
            await this.softDeleteGameResult(gameResultId);
            await this.updateTodayResultByIncrement(gameResult.todayResultInfo, sum);
        }
        await this.deleteTurnByRoomId(room.roomId);
        room = await this.roomService.getOneRoomByRoomId(room.roomId);
        if (!room) {
            return room;
        }
        let users = [];
        for (let player of room.players) {
            users.push({ userInfo: player.userInfo, isReady: false });
        }
        await this.playersService.updateAllPlayerStatusByUserId(users);
        await this.roomService.updateRoomStatusByRoomId({
            roomId: room.roomId,
            isGameReadyToStart: false,
            isGameOn: false,
        });
        return await this.roomService.getOneRoomByRoomId(room.roomId);
    }
    async createGameMap(room, gameResults) {
        const keywords = await this.keywordsService.generateRandomKeyword(room.players.length);
        let gameMap = {
            currentTurn: { turnId: null, turn: 0 },
            currentPlayers: room.players.length,
            remainingTurns: [],
            gameResultIdMap: {},
            keywords,
        };
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
    async popGameMapKeywords(roomId) {
        const gameMap = await this.gamesRepository.getGameMap(roomId);
        const keyword = gameMap.keywords.pop();
        await this.gamesRepository.setGameMap(roomId, gameMap);
        return keyword;
    }
    async getGameMapKeywordsCount(roomId) {
        const gameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.keywords.length;
    }
    async getGameMapRemainingTurns(roomId) {
        const gameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.remainingTurns.length;
    }
    async getGameMapCurrentTurnId(roomId) {
        const gameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.currentTurn.turnId;
    }
    async getGameMapCurrentTurn(roomId) {
        const gameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.currentTurn.turn;
    }
    async getGameMapCurrentPlayers(roomId) {
        const gameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.currentPlayers;
    }
    async getGameMapGameResultIdByUserId(roomId, userId) {
        const gameMap = await this.gamesRepository.getGameMap(roomId);
        return gameMap.gameResultIdMap[userId];
    }
    async updateGameMapCurrentTurn(roomId, turnId, turn) {
        const gameMap = await this.gamesRepository.getGameMap(roomId);
        gameMap.currentTurn = { turnId, turn };
        await this.gamesRepository.setGameMap(roomId, gameMap);
    }
    async reduceGameMapCurrentPlayers(roomId) {
        const gameMap = await this.gamesRepository.getGameMap(roomId);
        gameMap.currentPlayers--;
        await this.gamesRepository.setGameMap(roomId, gameMap);
    }
    async popPlayerFromGameMapRemainingTurns(roomId) {
        const gameMap = await this.gamesRepository.getGameMap(roomId);
        const turn = gameMap.remainingTurns.pop();
        await this.gamesRepository.setGameMap(roomId, gameMap);
        return turn;
    }
    async removePlayerFromGameMapRemainingTurns(roomId, userId) {
        const gameMap = await this.gamesRepository.getGameMap(roomId);
        new Promise((resolve) => {
            gameMap.remainingTurns = gameMap.remainingTurns.filter((e) => {
                if (e !== userId)
                    return e;
            });
            resolve;
        });
        await this.gamesRepository.setGameMap(roomId, gameMap);
    }
    async mapGameResultIdWithUserId(gameResults, gameMap) {
        new Promise((resolve) => {
            for (let result of gameResults) {
                gameMap.gameResultIdMap[result.userInfo] = result.gameResultId;
            }
            resolve;
        });
        return gameMap;
    }
    async createTurnMap(roomId, turnId, keyword) {
        const turnMap = {
            turnId,
            speechScore: [],
            turnQuizRank: 0,
            numberOfEvaluators: 0,
            keyword,
        };
        await this.gamesRepository.setTurnMap(roomId, turnMap);
    }
    async getTurnMapKeyword(roomId) {
        const turnMap = await this.gamesRepository.getTurnMap(roomId);
        return turnMap.keyword;
    }
    async getTurnMapTurnQuizRank(roomId) {
        const turnMap = await this.gamesRepository.getTurnMap(roomId);
        return turnMap.turnQuizRank;
    }
    async updateTurnMapSpeechScore(roomId, score) {
        const turnMap = await this.gamesRepository.getTurnMap(roomId);
        turnMap.speechScore.push(score);
        await this.gamesRepository.setTurnMap(roomId, turnMap);
        return (score * 20) / turnMap.numberOfEvaluators;
    }
    async updateTurnMapTurnQuizRank(roomId) {
        const turnMap = await this.gamesRepository.getTurnMap(roomId);
        turnMap.turnQuizRank++;
        await this.gamesRepository.setTurnMap(roomId, turnMap);
    }
    async updateTurnMapNumberOfEvaluators(roomInfo) {
        const numberOfPlayers = await this.playersRepository.countBy({ roomInfo });
        const turnMap = await this.gamesRepository.getTurnMap(roomInfo);
        turnMap.numberOfEvaluators = numberOfPlayers - 1;
        await this.gamesRepository.setTurnMap(roomInfo, turnMap);
    }
    async createTimer(time, roomId) {
        const ac = new AbortController();
        game_timer_map_1.gameTimerMap[roomId] = {
            ac,
        };
        game_timer_map_1.gameTimerMap[roomId].ac;
        return await (0, promises_1.setTimeout)(time, 'timer-end', {
            signal: game_timer_map_1.gameTimerMap[roomId].ac.signal,
        });
    }
    async breakTimer(roomId, next) {
        try {
            game_timer_map_1.gameTimerMap[roomId].ac.abort();
        }
        catch (err) {
            next();
        }
    }
};
GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(5, (0, typeorm_1.InjectRepository)(turn_entity_1.Turn)),
    __param(6, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __param(7, (0, typeorm_1.InjectRepository)(gameResult_entity_1.GameResult)),
    __param(8, (0, typeorm_1.InjectRepository)(todayResult_entity_1.TodayResult)),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        players_service_1.PlayersService,
        keyword_service_1.KeywordService,
        games_repository_1.GamesRepository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GamesService);
exports.GamesService = GamesService;
//# sourceMappingURL=games.service.js.map