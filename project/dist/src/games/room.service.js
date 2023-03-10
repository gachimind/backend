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
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./entities/room.entity");
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
const player_entity_1 = require("./entities/player.entity");
const game_timer_map_1 = require("./util/game-timer.map");
const games_repository_1 = require("./games.repository");
let RoomService = class RoomService {
    constructor(gamesRepository, roomRepository, playerRepository) {
        this.gamesRepository = gamesRepository;
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
    }
    async getAllRoomList() {
        const roomList = await this.roomRepository.find({ order: { updatedAt: 'DESC' } });
        return roomList.map((room) => {
            const { roomId, roomTitle, maxCount, players, isSecretRoom, isGameOn } = room;
            return {
                roomId,
                roomTitle,
                maxCount,
                participants: players.length,
                isSecretRoom,
                isGameOn,
            };
        });
    }
    async getOneRoomByRoomId(roomId) {
        return await this.roomRepository.findOne({
            where: { roomId },
            relations: { players: { socket: true } },
            order: { players: { createdAt: 'ASC' } },
        });
    }
    async getOneRoomByRoomIdWithTurnKeyword(roomId) {
        return await this.roomRepository.findOne({
            where: { roomId },
            select: { players: { userInfo: true }, turns: { keyword: true } },
        });
    }
    async removeRoomByRoomId(roomId) {
        await this.gamesRepository.deleteGameMap(roomId);
        await this.gamesRepository.deleteTurnMap(roomId);
        delete game_timer_map_1.gameTimerMap[roomId];
        await this.playerRepository.delete({ roomInfo: roomId });
        return await this.roomRepository.softDelete(roomId);
    }
    async updateRoomStatusByRoomId(data) {
        return this.roomRepository.save(data);
    }
    async createRoom(room) {
        if (!room.roomTitle) {
            room.roomTitle = '?????? ??????????????? ??? ??? ??????!';
        }
        if (room.isSecretRoom || room.roomPassword) {
            if (!room.roomPassword) {
                throw new ws_exception_filter_1.SocketException('??? ??????????????? ??????????????????.', 400, 'create-room');
            }
            const numberCheckReg = /^[0-9]+$/g;
            if (!numberCheckReg.test(room.roomPassword) || room.roomPassword.length !== 4) {
                throw new ws_exception_filter_1.SocketException('??? ??????????????? ?????? ????????? ??????????????????.', 400, 'create-room');
            }
            room.isSecretRoom = true;
        }
        const newRoom = Object.assign(Object.assign({}, room), { isGameOn: false, isGameReadyToStart: false });
        const roomInsert = await this.roomRepository.insert(newRoom);
        const roomId = roomInsert.identifiers[0].roomId;
        return roomId;
    }
    async enterRoom(requestUser, requestRoom) {
        const room = await this.getOneRoomByRoomId(requestRoom.roomId);
        if (!room) {
            throw new ws_exception_filter_1.SocketException('???????????? ?????? ?????? ??? ????????????.', 404, 'enter-room');
        }
        if (room.isGameOn) {
            throw new ws_exception_filter_1.SocketException('?????? ????????? ????????? ????????????.', 400, 'enter-room');
        }
        if (room.maxCount == room.players.length) {
            throw new ws_exception_filter_1.SocketException('??????????????? ??? ????????? ??????????????????.', 400, 'enter-room');
        }
        if (room.isSecretRoom) {
            if (!requestRoom.roomPassword || room.roomPassword !== requestRoom.roomPassword) {
                throw new ws_exception_filter_1.SocketException('??? ??????????????? ???????????? ????????????.', 400, 'enter-room');
            }
        }
        let isHost;
        if (room.players.length === 0)
            isHost = true;
        else
            isHost = false;
        await this.playerRepository.insert({
            userInfo: requestUser.userInfo,
            socketInfo: requestUser.socketId,
            roomInfo: requestRoom.roomId,
            isReady: false,
            isHost,
        });
    }
    async validateRoomPassword(password, roomId) {
        const room = await this.getOneRoomByRoomId(roomId);
        if (!room) {
            throw new ws_exception_filter_1.SocketException('???????????? ?????? ?????? ??? ????????????.', 404, 'valid-room-password');
        }
        if (room.isSecretRoom) {
            if (room.roomPassword !== password) {
                throw new ws_exception_filter_1.SocketException('??? ??????????????? ???????????? ????????????.', 400, 'valid-room-password');
            }
        }
    }
    async updateIsGameReadyToStart(roomId) {
        let room = await this.getOneRoomByRoomId(roomId);
        if (room.players.length === 1) {
            await this.updateRoomStatusByRoomId({
                roomId: room.roomId,
                isGameReadyToStart: false,
            });
            room = await this.getOneRoomByRoomId(room.roomId);
        }
        if (room.players.length > 1) {
            const isAllPlayerReadyToStart = (() => {
                for (const player of room.players) {
                    if (!player.isHost && !player.isReady)
                        return false;
                }
                return true;
            })();
            if (isAllPlayerReadyToStart !== room.isGameReadyToStart) {
                await this.updateRoomStatusByRoomId({
                    roomId: room.roomId,
                    isGameReadyToStart: isAllPlayerReadyToStart,
                });
            }
            room = await this.getOneRoomByRoomId(room.roomId);
        }
        return room;
    }
    async updateIsGameOn(roomId) {
        let room = await this.getOneRoomByRoomId(roomId);
        for (const player of room.players) {
            if (!player.isHost && !player.isReady) {
                throw new ws_exception_filter_1.SocketException('?????? ??????????????? ready???????????? ????????? ????????? ??? ????????????.', 400, 'start');
            }
        }
        await this.updateRoomStatusByRoomId({
            roomId,
            isGameOn: true,
        });
        return await this.getOneRoomByRoomId(roomId);
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(2, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [games_repository_1.GamesRepository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map