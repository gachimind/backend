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
exports.PlayersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
const token_map_entity_1 = require("../users/entities/token-map.entity");
const socketIdMap_entity_1 = require("./entities/socketIdMap.entity");
const player_entity_1 = require("./entities/player.entity");
const todayResult_entity_1 = require("./entities/todayResult.entity");
const today_date_constructor_1 = require("./util/today.date.constructor");
let PlayersService = class PlayersService {
    constructor(tokenMapRepository, socketIdMapRepository, playerRepository, todayResultRepository) {
        this.tokenMapRepository = tokenMapRepository;
        this.socketIdMapRepository = socketIdMapRepository;
        this.playerRepository = playerRepository;
        this.todayResultRepository = todayResultRepository;
    }
    async getUserIdByToken(token) {
        const tokenMap = await this.tokenMapRepository.findOneBy({ token });
        return tokenMap.user;
    }
    async getUserBySocketId(socketId) {
        const user = await this.socketIdMapRepository.findOne({
            where: { socketId },
            relations: {
                player: { room: true },
            },
        });
        return user;
    }
    async getUserByUserID(userId) {
        const user = await this.socketIdMapRepository.findOne({
            where: { userInfo: userId },
            relations: { player: { room: true } },
        });
        return user;
    }
    async getPlayerBySocketId(socketInfo) {
        const player = await this.playerRepository.findOne({
            where: { socketInfo },
            relations: { room: true },
            select: { roomInfo: true },
        });
        return player;
    }
    async getAllPlayersUserIdByRoomID(roomId) {
        return await this.playerRepository.find({
            where: { roomInfo: roomId },
            select: { userInfo: true },
        });
    }
    async updatePlayerStatusByUserId(user) {
        return await this.playerRepository.save(user);
    }
    async updateAllPlayerStatusByUserId(users) {
        return await this.playerRepository.save(users);
    }
    async removeSocketBySocketId(socketId) {
        return await this.socketIdMapRepository.delete(socketId);
    }
    async removePlayerByUserId(userId) {
        return await this.playerRepository.delete(userId);
    }
    async socketIdMapToLoginUser(userInfo, socketId) {
        if (await this.getUserBySocketId(socketId)) {
            throw new ws_exception_filter_1.SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
        }
        const user = { socketId, userInfo };
        return await this.socketIdMapRepository.save(user);
    }
    async createTodayResult(userInfo) {
        const today = (0, today_date_constructor_1.getTodayDate)();
        const todayResult = await this.todayResultRepository.findOne({
            where: { userInfo, createdAt: (0, typeorm_2.MoreThan)(today) },
            cache: 5 * 60 * 1000,
        });
        if (!todayResult) {
            await this.todayResultRepository.save({ userInfo, todayScore: 0 });
            await this.todayResultRepository.findOne({
                where: { userInfo, createdAt: (0, typeorm_2.MoreThan)(today) },
                cache: 5 * 60 * 1000,
            });
        }
    }
    async setPlayerReady(player) {
        let user;
        if (!player.isReady) {
            user = { userInfo: player.userInfo, isReady: true };
        }
        else {
            user = { userInfo: player.userInfo, isReady: false };
        }
        return await this.updatePlayerStatusByUserId(user);
    }
};
PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __param(1, (0, typeorm_1.InjectRepository)(socketIdMap_entity_1.SocketIdMap)),
    __param(2, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(3, (0, typeorm_1.InjectRepository)(todayResult_entity_1.TodayResult)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PlayersService);
exports.PlayersService = PlayersService;
//# sourceMappingURL=players.service.js.map