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
const gmaeResult_entity_1 = require("./entities/gmaeResult.entity");
const player_entity_1 = require("./entities/player.entity");
const room_entity_1 = require("./entities/room.entity");
const turn_entity_1 = require("./entities/turn.entity");
const turnResult_entity_1 = require("./entities/turnResult.entity");
const keywords = ['MVC패턴', 'OOP', 'STACKE', 'QUEUE', '함수형 프로그래밍', '메모리 계층'];
let GamesService = class GamesService {
    constructor(roomRepository, playerRepository, turnRepository, turnResultRepository, gameResultRepository) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
        this.turnRepository = turnRepository;
        this.turnResultRepository = turnResultRepository;
        this.gameResultRepository = gameResultRepository;
    }
    async createGameResultPerPlayer(roomId) {
        const playersUserId = await this.playerRepository.find({
            where: { roomInfo: roomId },
            select: { userInfo: true },
        });
        let data = [];
        for (let userId of playersUserId) {
            data.push({
                roomInfo: roomId,
                userInfo: userId.userInfo,
            });
        }
        await this.gameResultRepository.save(data);
    }
    async createTurn(roomId) {
        const room = await this.roomRepository.findOne({ where: { roomId } });
        let index = room.turns.length;
        const newTurnData = {
            roomInfo: room.roomId,
            turn: index + 1,
            speechPlayerInfo: room.players[index].user.nickname,
            keyword: keywords[index],
            hint: null,
        };
        return await this.turnRepository.save(newTurnData);
    }
};
GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(2, (0, typeorm_1.InjectRepository)(turn_entity_1.Turn)),
    __param(3, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __param(4, (0, typeorm_1.InjectRepository)(gmaeResult_entity_1.GameResult)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GamesService);
exports.GamesService = GamesService;
//# sourceMappingURL=games.service.js.map