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
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
const roomList = [];
let RoomService = class RoomService {
    async getAllRoomList() {
        return await roomList.map((room) => {
            const { roomId, roomTitle, maxCount, round, participants, isSecreteRoom, isGameOn } = room;
            return {
                roomId,
                roomTitle,
                maxCount,
                round,
                participants: participants.length,
                isSecreteRoom,
                isGameOn,
            };
        });
    }
    createRoom(room) {
        const newRoom = Object.assign(Object.assign({ roomId: roomList.length + 1 }, room), { isGameOn: false, participants: [], isGameReadyToStart: false });
        if (!room.roomTitle) {
            newRoom.roomTitle = '같이 가치마인드 한 판 해요!';
        }
        roomList.push(newRoom);
        return newRoom.roomId;
    }
    async isRoomAvailable(requestUser, requestRoom) {
        const room = await roomList.find((data) => {
            return data.roomId === requestRoom.roomId;
        });
        let status;
        if (!room) {
            status = 404;
            return { availability: false, message: '요청하신 방을 찾을 수 없습니다.', status };
        }
        if (room.maxCount == room.participants.length) {
            status = 400;
            return {
                availability: false,
                message: '정원초과로 방 입장에 실패했습니다.',
                status,
            };
        }
        if (room.IsSecreteRoom) {
            if (!requestRoom.roomPassword || room.roomPassword !== requestRoom.roomPassword) {
                status = 404;
                return {
                    availability: false,
                    message: '비밀번호가 일치하지 않습니다.',
                    status,
                };
            }
        }
        const userInRoom = room.participants.find((user) => {
            return user.userId === requestUser.userId;
        });
        if (userInRoom) {
            status = 400;
            return {
                availability: false,
                message: '같은 방에 중복 입장할 수 없습니다.',
                status,
            };
        }
        return { availability: true, message: '방 입장에 성공하였습니다.', room };
    }
    async updateRoomParticipants(socketId, requestUser, roomInfo) {
        let isHost;
        if (!roomInfo.participants.length)
            isHost = true;
        const { currentRoom } = requestUser, userInfo = __rest(requestUser, ["currentRoom"]);
        roomInfo.participants.push(Object.assign(Object.assign({ socketId }, userInfo), { isReady: false, isHost }));
        roomList.map((room, index) => {
            if (room.roomId === roomInfo.roomId) {
                return (roomList[index] = roomInfo);
            }
        });
        return roomInfo;
    }
    async leaveRoom(requestUser) {
        const targetRoom = await roomList.find((room) => {
            return room.roomId === requestUser.currentRoom;
        });
        if (!targetRoom)
            throw new ws_exception_filter_1.SocketException('bad request', 400, 'leave-room');
        if (targetRoom.participants.length > 1) {
            targetRoom.participants.map((user, index) => {
                if (user.userId === requestUser.userId) {
                    if (user.isHost) {
                        targetRoom.participants[1].isHost = true;
                    }
                    return targetRoom.participants.splice(index, 1);
                }
            });
            roomList.map((room, index) => {
                if (room.roomId === targetRoom.roomId) {
                    return (roomList[index] = targetRoom);
                }
            });
            return targetRoom;
        }
        else {
            const roomIndex = roomList.findIndex((room) => room.roomId === targetRoom.roomId);
            roomList.splice(roomIndex, 1);
            return null;
        }
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)()
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map