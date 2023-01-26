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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
const typeorm_2 = require("typeorm");
const gameResult_entity_1 = require("./entities/gameResult.entity");
const room_entity_1 = require("./entities/room.entity");
const turn_entity_1 = require("./entities/turn.entity");
const turnResult_entity_1 = require("./entities/turnResult.entity");
let ChatService = class ChatService {
    constructor(roomRepository, turnRepository, turnResultRepository, gameResultRepository) {
        this.roomRepository = roomRepository;
        this.turnRepository = turnRepository;
        this.turnResultRepository = turnResultRepository;
        this.gameResultRepository = gameResultRepository;
    }
    checkAnswer(message, room) {
        const currentTurn = room.turns.at(-1);
        if (message != currentTurn.keyword) {
            return false;
        }
        return true;
    }
    async recordScore(user, roomId) {
        const room = await this.roomRepository.findOneBy({ roomId });
        const currentTurn = room.turns.at(-1);
        console.log('요청 유저 닉네임', user.nickname);
        console.log('현재 턴 발표자 닉네임', currentTurn.speechPlayer);
        if (user.userId === currentTurn.speechPlayer) {
            throw new ws_exception_filter_1.SocketException('발표자는 정답을 맞출 수 없습니다.', 400, 'send-chat');
        }
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
        return await this.turnResultRepository.save(turnResult);
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(turn_entity_1.Turn)),
    __param(2, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __param(3, (0, typeorm_1.InjectRepository)(gameResult_entity_1.GameResult)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map