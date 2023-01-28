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
    async createTurnResult(turnResult) {
        return await this.turnResultRepository.save(turnResult);
    }
    async updateGameResult(gameResultId, gameScore) {
        return await this.gameResultRepository.save({ gameResultId, gameScore });
    }
    async updateTodayResult(todayResultId, gameScore) {
        return await this.todayResultRepository.increment({ todayResultId }, 'todayScore', gameScore);
    }
    async deleteTurnByRoomId(roomInfo) {
        await this.turnRepository.softDelete({ roomInfo });
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
    async createTurn(roomId) {
        const room = await this.roomService.getOneRoomByRoomId(roomId);
        let index = room.turns.length;
        const newTurnData = {
            roomInfo: room.roomId,
            turn: index + 1,
            currentEvent: 'start',
            speechPlayer: room.players[index].userInfo,
            speechPlayerNickname: room.players[index].user.nickname,
            keyword: keywords[index],
            hint: null,
        };
        const turn = await this.turnRepository.save(newTurnData);
        score_map_1.scoreMap[roomId][turn.turn] = [];
        return turn;
    }
    async updateTurn(turn, timer) {
        turn.currentEvent = timer;
        return await this.turnRepository.save(turn);
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
        score_map_1.scoreMap[roomId][turn].push(score);
        console.log('중간점수 합계 : ');
    }
    async recordSpeechPlayerScore(roomId, turn, userId, nickname) {
        const room = await this.roomService.getOneRoomByRoomIdWithTurnKeyword(roomId);
        const gameResult = await this.gameResultRepository.findOne({
            where: { userInfo: userId, roomId },
            select: { gameResultId: true },
        });
        const unevaluatedNum = room.players.length - 1 - score_map_1.scoreMap[roomId][turn].length;
        let sum = 0;
        for (let score of score_map_1.scoreMap[roomId][turn]) {
            sum += score;
        }
        const score = ((unevaluatedNum * 5 + sum) * 20) / (room.players.length - 1);
        const turnResult = {
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
    async handleGameEndEvent(room) {
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
        let users = [];
        for (let player of room.players) {
            users.push({ userInfo: player.userInfo, isReady: false });
        }
        await this.playersService.updateAllPlayerStatusByUserId(users);
        return await this.roomService.updateRoomStatusByRoomId({
            roomId: room.roomId,
            isGameReadyToStart: false,
            isGameOn: false,
        });
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