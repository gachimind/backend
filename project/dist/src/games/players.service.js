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
let PlayersService = class PlayersService {
    constructor(tokenMapRepository, socketIdMapRepository, playerRepository) {
        this.tokenMapRepository = tokenMapRepository;
        this.socketIdMapRepository = socketIdMapRepository;
        this.playerRepository = playerRepository;
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
    async updatePlayerStatusByUserId(user) {
        return await this.playerRepository.save(user);
    }
    async removeSocketBySocketId(socketId) {
        return await this.socketIdMapRepository.delete(socketId);
    }
    async removePlayerByUserId(userId) {
        return await this.playerRepository.delete(userId);
    }
    async socketIdMapToLoginUser(token, socketId) {
        const requestUser = await this.tokenMapRepository.findOneBy({ token });
        const userId = requestUser.userInfo;
        if (!userId) {
            throw new ws_exception_filter_1.SocketException('사용자 정보를 찾을 수 없습니다', 404, 'log-in');
        }
        if (await this.getUserBySocketId(socketId)) {
            throw new ws_exception_filter_1.SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
        }
        const prevLoinInfo = await this.getUserByUserID(userId);
        if (prevLoinInfo) {
            await this.removeSocketBySocketId(prevLoinInfo.socketId);
        }
        const user = { socketId, userInfo: userId };
        return await this.socketIdMapRepository.save(user);
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
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PlayersService);
exports.PlayersService = PlayersService;
//# sourceMappingURL=players.service.js.map