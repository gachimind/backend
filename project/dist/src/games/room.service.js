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
const participants_list_mapper_1 = require("./util/participants-list.mapper");
let RoomService = class RoomService {
    constructor(roomRepository, playerRepository) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
    }
    async getAllRoomList() {
        const roomList = await this.roomRepository.find({ order: { updatedAt: 'DESC' } });
        return roomList.map((room) => {
            const { roomId, roomTitle, maxCount, round, players, isSecreteRoom, isGameOn } = room;
            return {
                roomId,
                roomTitle,
                maxCount,
                round,
                participants: players.length,
                isSecreteRoom,
                isGameOn,
            };
        });
    }
    async getOneRoomByRoomId(roomId) {
        return await this.roomRepository.findOne({
            where: { roomId },
            relations: { players: { socket: true } },
        });
    }
    async removeRoomByRoomId(roomId) {
        return await this.roomRepository.delete(roomId);
    }
    async updateRoomInfoToRoom(roomId) {
        const room = await this.getOneRoomByRoomId(roomId);
        const { roomTitle, maxCount, round, readyTime, speechTime, discussionTime, isSecreteRoom, isGameOn, isGameReadyToStart, players, } = room;
        const participants = (0, participants_list_mapper_1.participantsListMapper)(players);
        const roomInfo = {
            roomId,
            roomTitle,
            maxCount,
            round,
            readyTime,
            speechTime,
            discussionTime,
            isSecreteRoom,
            isGameOn,
            isGameReadyToStart,
            participants,
        };
        return roomInfo;
    }
    async createRoom(room) {
        if (!room.roomTitle) {
            room.roomTitle = '같이 가치마인드 한 판 해요!';
        }
        if (room.isSecreteRoom && !room.roomPassword) {
            throw new ws_exception_filter_1.SocketException('잘못된 요청입니다.', 400, 'create-room');
        }
        const newRoom = Object.assign(Object.assign({}, room), { isGameOn: false, isGameReadyToStart: false });
        const roomInsert = await this.roomRepository.insert(newRoom);
        return roomInsert.identifiers[0].roomId;
    }
    async enterRoom(requestUser, requestRoom) {
        const room = await this.getOneRoomByRoomId(requestRoom.roomId);
        if (!room) {
            throw new ws_exception_filter_1.SocketException('요청하신 방을 찾을 수 없습니다.', 404, 'enter-room');
        }
        if (room.maxCount == room.players.length) {
            throw new ws_exception_filter_1.SocketException('정원초과로 방 입장에 실패했습니다.', 400, 'enter-room');
        }
        if (room.isSecreteRoom) {
            if (!requestRoom.roomPassword || room.roomPassword !== requestRoom.roomPassword) {
                throw new ws_exception_filter_1.SocketException('요청하신 방을 찾을 수 없습니다.', 404, 'enter-room');
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
};
RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map