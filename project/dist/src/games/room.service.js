"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const roomList = [];
let RoomService = class RoomService {
    getAllRoomList() {
        return roomList.map((room) => {
            return {
                roomId: room.roomId,
                roomTitle: room.roomTitle,
                maxCount: room.maxCount,
                round: room.round,
                participants: room.participants.length,
                isSecreteRoom: room.isSecreteRoom,
                isGameOn: room.isGameOn,
            };
        });
    }
    async getRoomInfo(roomId) {
        const roomInfo = await roomList.find((room) => {
            room.roomId === roomId;
        });
        const { roomPassword } = roomInfo, roomInfoExceptRoomPassword = __rest(roomInfo, ["roomPassword"]);
        return roomInfoExceptRoomPassword;
    }
    createRoom(room) {
        const newRoom = Object.assign(Object.assign({ roomId: roomList.length + 1 }, room), { isGameOn: false, participants: [], isGameReadyToStart: false });
        if (!room.roomTitle) {
            newRoom.roomTitle = '같이 가치마인드 한 판 해요!';
        }
        roomList.push(newRoom);
        return newRoom.roomId;
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)()
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map