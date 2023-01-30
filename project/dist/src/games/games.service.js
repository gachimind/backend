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
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
const typeorm_2 = require("typeorm");
const gameResult_entity_1 = require("./entities/gameResult.entity");
const todayResult_entity_1 = require("./entities/todayResult.entity");
const turn_entity_1 = require("./entities/turn.entity");
const turnResult_entity_1 = require("./entities/turnResult.entity");
const players_service_1 = require("./players.service");
const room_service_1 = require("./room.service");
const game_timer_map_1 = require("./util/game-timer.map");
const score_map_1 = require("./util/score.map");
const today_date_constructor_1 = require("./util/today.date.constructor");
const keywords = ['MVC패턴', 'OOP', 'STACK', 'QUEUE', '함수형 프로그래밍', '메모리 계층'];
let GamesService = class GamesService {
    constructor(roomService, playersService, turnRepository, turnResultRepository, gameResultRepository, todayResultRepository) {
        this.roomService = roomService;
        this.playersService = playersService;
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
    async createTurn(roomId) {
        const room = await this.roomService.getOneRoomByRoomId(roomId);
        let playerIndex = 0;
        for (let turn of room.turns) {
            if (turn.speechPlayer != room.players[playerIndex].userInfo) {
                return;
            }
            playerIndex++;
        }
        let index = room.turns.length;
        const newTurnData = {
            roomInfo: room.roomId,
            turn: index + 1,
            currentEvent: 'start',
            speechPlayer: room.players[playerIndex].userInfo,
            speechPlayerNickname: room.players[playerIndex].user.nickname,
            keyword: keywords[index],
            hint: null,
        };
        const turn = await this.turnRepository.save(newTurnData);
        score_map_1.scoreMap[roomId][room.players[playerIndex].userInfo] = [];
        return turn;
    }
    async updateTurn(turn, timer) {
        turn.currentEvent = timer;
        return await this.turnRepository.save(turn);
    }
    async deleteTurnByRoomId(roomInfo) {
        await this.turnRepository.delete({ roomInfo });
    }
    async deleteTurnByTurnId(turn) {
        await this.turnRepository.delete({ turnId: turn.turnId });
        score_map_1.scoreMap[turn.roomInfo][turn.speechPlayer] = null;
    }
    async createTurnResult(turnResult) {
        return await this.turnResultRepository.save(turnResult);
    }
    async sumTurnScorePerPlayerByUserId(roomId, userId) {
        const { sum } = await this.turnResultRepository
            .createQueryBuilder('turnResult')
            .select('SUM(turnResult.score)', 'sum')
            .where('turnResult.roomId = :roomId', { roomId })
            .andWhere('turnResult.userId = :userId', { userId })
            .getRawOne();
        return Number(sum);
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
    async createGameResultPerPlayer(roomId) {
        const playersUserId = await this.playersService.getAllPlayersUserIdByRoomID(roomId);
        const today = (0, today_date_constructor_1.getTodayDate)();
        let data = [];
        for (let userId of playersUserId) {
            const todayResult = await this.todayResultRepository.findOne({
                where: { userInfo: userId.userInfo, createdAt: (0, typeorm_2.MoreThan)(today) },
            });
            data.push({
                roomId,
                userInfo: userId.userInfo,
                todayResultInfo: todayResult.todayResultId,
            });
        }
        await this.gameResultRepository.save(data);
    }
    async recordPlayerScore(user, roomId) {
        const room = await this.roomService.getOneRoomByRoomId(roomId);
        const currentTurn = room.turns.at(-1);
        const turnResults = await this.turnResultRepository.find({
            where: { roomId, turn: currentTurn.turn },
        });
        for (let result of turnResults) {
            if (user.nickname === result.nickname) {
                throw new ws_exception_filter_1.SocketException('정답을 이미 맞추셨습니다!', 400, 'send-chat');
            }
        }
        const myRank = turnResults.length;
        const score = 100 - myRank * 20;
        const gameResult = await this.gameResultRepository.findOne({
            where: {
                userInfo: user.userId,
                roomId: room.roomId,
            },
        });
        const turnResult = {
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
    async saveEvaluationScore(roomId, data) {
        const { score, turn } = data;
        const turnData = await this.turnRepository.findOne({
            where: { roomInfo: roomId, turn: turn },
        });
        score_map_1.scoreMap[roomId][turnData.speechPlayer].push(score);
    }
    async recordSpeechPlayerScore(roomId, turn, keyword, userId, nickname) {
        const room = await this.roomService.getOneRoomByRoomIdWithTurnKeyword(roomId);
        console.log('recordSpeechPlayerScore :', room.players);
        const gameResult = await this.gameResultRepository.findOne({
            where: { userInfo: userId, roomId },
            select: { gameResultId: true },
        });
        console.log('scoreMap : ', score_map_1.scoreMap[roomId][turn]);
        let sum = 0;
        let unevaluatedNum = 0;
        if (room.players.length > 1 && score_map_1.scoreMap[roomId][turn] != null) {
            console.log('scoreMap 계산');
            for (let score of score_map_1.scoreMap[roomId][turn]) {
                sum += score;
            }
            unevaluatedNum = room.players.length - 1 - score_map_1.scoreMap[roomId][turn].length;
        }
        console.log('after if block');
        let score = sum * 20;
        if (room.players.length - 1) {
            console.log('total score 계산');
            score = ((unevaluatedNum * 5 + sum) * 20) / (room.players.length - 1);
            console.log('total score :', score);
        }
        const turnResult = {
            gameResultInfo: gameResult.gameResultId,
            roomId,
            turn,
            userId,
            nickname,
            score,
            keyword,
            isSpeech: true,
        };
        console.log('write turnResult :', turnResult);
        return await this.createTurnResult(turnResult);
    }
    async handleGameEndEvent(room) {
        delete game_timer_map_1.gameTimerMap[room.roomId];
        const playerUserIds = await this.gameResultRepository.find({
            where: { roomId: room.roomId },
            select: { gameResultId: true, userInfo: true, todayResultInfo: true },
        });
        for (let user of playerUserIds) {
            const sum = await this.sumTurnScorePerPlayerByUserId(room.roomId, user.userInfo);
            await this.updateGameResult(user.gameResultId, sum);
            await this.softDeleteGameResult(user.gameResultId);
            await this.updateTodayResultByIncrement(user.todayResultInfo, sum);
        }
        await this.deleteTurnByRoomId(room.roomId);
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
};
GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(turn_entity_1.Turn)),
    __param(3, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __param(4, (0, typeorm_1.InjectRepository)(gameResult_entity_1.GameResult)),
    __param(5, (0, typeorm_1.InjectRepository)(todayResult_entity_1.TodayResult)),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        players_service_1.PlayersService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GamesService);
exports.GamesService = GamesService;
//# sourceMappingURL=games.service.js.map