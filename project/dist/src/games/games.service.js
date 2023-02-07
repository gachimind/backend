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
const game_timer_map_1 = require("./util/game-timer.map");
const game_map_1 = require("./util/game.map");
const turn_map_1 = require("./util/turn.map");
const today_date_constructor_1 = require("./util/today.date.constructor");
const player_entity_1 = require("./entities/player.entity");
let GamesService = class GamesService {
    constructor(roomService, playersService, keywordsService, playersRepository, turnRepository, turnResultRepository, gameResultRepository, todayResultRepository) {
        this.roomService = roomService;
        this.playersService = playersService;
        this.keywordsService = keywordsService;
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
        const turnIndex = game_map_1.gameMap[roomId].currentTurn.turn;
        const speechPlayer = this.popPlayerFromGameMapRemainingTurns(roomId);
        const nickname = await this.playersService.getPlayerByUserId(speechPlayer);
        const keyword = this.popGameMapKeywords(roomId);
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
        this.updateGameMapCurrentTurn(roomId, turn.turnId, turn.turn);
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
            turnId: this.getGameMapCurrentTurnId(roomId),
        });
        const gameResultInfo = game_map_1.gameMap[roomId].gameResultIdMap[userId];
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
            score: 100 - turn_map_1.turnMap[roomId].turnQuizRank * 20,
            keyword: turn.keyword,
            link: turn.link,
            isSpeech: false,
        };
        this.updateTurnMapTurnQuizRank(roomId);
        this.updateTurnMapTurnAnswerPlayersTrue(roomId, userId);
        return await this.createTurnResult(turnResult);
    }
    async createPlayerTurnResult(roomId, turn) {
        if (this.getTurnMapNumberOfEvaluators(roomId) > this.getTurnMapTurnQuizRank(roomId)) {
            const players = await this.playersRepository.find({
                where: { roomInfo: roomId },
            });
            const answeredPlayers = this.getTurnMapTurnAnswerPlayers(roomId);
            const turnResultData = [];
            for (let player of players) {
                console.log('createPlayerTurnResult');
                if (!answeredPlayers[player.userInfo]) {
                    const turnResult = {
                        gameResultInfo: this.getPlayerGameMapGameResultIdMap(roomId, player.userInfo),
                        roomId,
                        turnId: turn.turnId,
                        userId: player.userInfo,
                        score: 0,
                        keyword: turn.keyword,
                        link: turn.link,
                        isSpeech: false,
                    };
                    turnResultData.push(turnResult);
                    this.updateTurnMapTurnAnswerPlayersTrue(roomId, player.userInfo);
                }
            }
            await this.createTurnResult(turnResultData);
        }
    }
    async createSpeechPlayerTurnResult(roomId, turn) {
        const unevaluatedNum = turn_map_1.turnMap[roomId].numberOfEvaluators - turn_map_1.turnMap[roomId].speechScore.length;
        let sum = 0;
        while (turn_map_1.turnMap[roomId].speechScore.length) {
            const pop = turn_map_1.turnMap[roomId].speechScore.pop();
            sum += pop;
        }
        let score = 0;
        if (turn_map_1.turnMap[roomId].numberOfEvaluators) {
            score = ((sum + unevaluatedNum * 5) * 20) / turn_map_1.turnMap[roomId].numberOfEvaluators;
        }
        const turnResult = {
            gameResultInfo: game_map_1.gameMap[roomId].gameResultIdMap[turn.speechPlayer],
            roomId,
            turnId: turn.turnId,
            userId: turn.speechPlayer,
            score,
            keyword: turn.keyword,
            link: turn.link,
            isSpeech: true,
        };
        await this.createTurnResult(turnResult);
        this.updateTurnMapTurnAnswerPlayersTrue(roomId, turn.speechPlayer);
        if (unevaluatedNum) {
            return (unevaluatedNum * 5 * 20) / turn_map_1.turnMap[roomId].numberOfEvaluators;
        }
        return 0;
    }
    async handleGameEndEvent(room) {
        const playerGameResultIds = Object.values(game_map_1.gameMap[room.roomId].gameResultIdMap);
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
    async createGameMap(room) {
        const keywords = await this.keywordsService.generateRandomKeyword(room.players.length);
        game_map_1.gameMap[room.roomId] = {
            currentTurn: { turnId: null, turn: 0 },
            currentPlayers: room.players.length,
            remainingTurns: [],
            gameResultIdMap: {},
            keywords,
        };
        new Promise((resolve) => {
            for (let i = room.players.length - 1; i >= 0; i--) {
                game_map_1.gameMap[room.roomId].remainingTurns.push(room.players[i].user.userId);
            }
            resolve;
        });
        return;
    }
    popGameMapKeywords(roomId) {
        return game_map_1.gameMap[roomId].keywords.pop();
    }
    getGameMapKeywordsCount(roomId) {
        return game_map_1.gameMap[roomId].keywords.length;
    }
    getGameMapRemainingTurns(roomId) {
        return game_map_1.gameMap[roomId].remainingTurns.length;
    }
    getGameMapCurrentTurnId(roomId) {
        return game_map_1.gameMap[roomId].currentTurn.turnId;
    }
    getGameMapCurrentTurn(roomId) {
        return game_map_1.gameMap[roomId].currentTurn.turn;
    }
    getGameMapCurrentPlayers(roomId) {
        return game_map_1.gameMap[roomId].currentPlayers;
    }
    getPlayerGameMapGameResultIdMap(roomId, userId) {
        return game_map_1.gameMap[roomId].gameResultId[userId];
    }
    updateGameMapCurrentTurn(roomId, turnId, turn) {
        game_map_1.gameMap[roomId].currentTurn = { turnId, turn };
    }
    reduceGameMapCurrentPlayers(roomId) {
        game_map_1.gameMap[roomId].currentPlayers--;
    }
    popPlayerFromGameMapRemainingTurns(roomId) {
        return game_map_1.gameMap[roomId].remainingTurns.pop();
    }
    async removePlayerFromGameMapRemainingTurns(roomId, userId) {
        new Promise((resolve) => {
            game_map_1.gameMap[roomId].remainingTurns = game_map_1.gameMap[roomId].remainingTurns.filter((e) => {
                if (e !== userId)
                    return e;
            });
            resolve;
        });
    }
    async mapGameResultIdWithUserId(roomId, gameResults) {
        new Promise((resolve) => {
            for (let result of gameResults) {
                game_map_1.gameMap[roomId].gameResultIdMap[result.userInfo] = result.gameResultId;
            }
            resolve;
        });
    }
    async createTurnMap(roomId, turnId, keyword) {
        turn_map_1.turnMap[roomId] = {
            turnId,
            speechScore: [],
            turnQuizRank: 0,
            turnAnswerPlayers: {},
            numberOfEvaluators: 0,
            keyword,
        };
        const players = await this.playersRepository.find({
            where: { roomInfo: roomId },
        });
        for (let player of players) {
            turn_map_1.turnMap[roomId].turnAnswerPlayers[player.userInfo] = false;
        }
    }
    getTurnMapKeyword(roomId) {
        return turn_map_1.turnMap[roomId].keyword;
    }
    getTurnMapTurnQuizRank(roomId) {
        return turn_map_1.turnMap[roomId].turnQuizRank;
    }
    getTurnMapNumberOfEvaluators(roomId) {
        return turn_map_1.turnMap[roomId].numberOfEvaluators;
    }
    getTurnMapTurnAnswerPlayers(roomId) {
        return turn_map_1.turnMap[roomId].turnAnswerPlayers;
    }
    updateTurnMapSpeechScore(roomId, score) {
        turn_map_1.turnMap[roomId].speechScore.push(score);
        return (score * 20) / turn_map_1.turnMap[roomId].numberOfEvaluators;
    }
    updateTurnMapTurnQuizRank(roomId) {
        turn_map_1.turnMap[roomId].turnQuizRank++;
    }
    updateTurnMapTurnAnswerPlayersTrue(roomId, userId) {
        turn_map_1.turnMap[roomId].turnAnswerPlayers[userId] = true;
    }
    async updateTurnMapNumberOfEvaluators(roomInfo) {
        const numberOfPlayers = await this.playersRepository.countBy({ roomInfo });
        turn_map_1.turnMap[roomInfo].numberOfEvaluators = numberOfPlayers - 1;
    }
    async createTimer(time, roomId) {
        const ac = new AbortController();
        game_timer_map_1.gameTimerMap[roomId] = {
            ac,
        };
        game_timer_map_1.gameTimerMap[roomId].ac;
        game_timer_map_1.gameTimerMap[roomId].timer = await (0, promises_1.setTimeout)(time, 'timer-end', {
            signal: game_timer_map_1.gameTimerMap[roomId].ac.signal,
        });
        return game_timer_map_1.gameTimerMap[roomId].timer;
    }
    breakTimer(roomId, next) {
        try {
            game_timer_map_1.gameTimerMap[roomId].ac.abort();
        }
        catch (ett) {
            next();
        }
    }
};
GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(4, (0, typeorm_1.InjectRepository)(turn_entity_1.Turn)),
    __param(5, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __param(6, (0, typeorm_1.InjectRepository)(gameResult_entity_1.GameResult)),
    __param(7, (0, typeorm_1.InjectRepository)(todayResult_entity_1.TodayResult)),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        players_service_1.PlayersService,
        keyword_service_1.KeywordService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GamesService);
exports.GamesService = GamesService;
//# sourceMappingURL=games.service.js.map