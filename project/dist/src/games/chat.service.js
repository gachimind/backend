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