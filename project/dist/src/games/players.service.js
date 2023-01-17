"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersService = exports.socketIdMap = void 0;
const common_1 = require("@nestjs/common");
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
exports.socketIdMap = {};
const authentication = { token1: 1, token2: 2, token3: 3 };
const fakeDBUserTable = [
    {
        userId: 1,
        email: 'test1@email.com',
        nickname: '세현1',
        profileImg: 'https://t3.ftcdn.net/jpg/02/95/94/94/360_F_295949484_8BrlWkTrPXTYzgMn3UebDl1O13PcVNMU.jpg',
    },
    {
        userId: 2,
        email: 'test2@email.com',
        nickname: '예나1',
        profileImg: 'https://t3.ftcdn.net/jpg/02/95/94/94/360_F_295949484_8BrlWkTrPXTYzgMn3UebDl1O13PcVNMU.jpg',
    },
    {
        userId: 3,
        email: 'test1@email.com',
        nickname: '도영1',
        profileImg: 'https://t3.ftcdn.net/jpg/02/95/94/94/360_F_295949484_8BrlWkTrPXTYzgMn3UebDl1O13PcVNMU.jpg',
    },
];
let PlayersService = class PlayersService {
    handleDisconnect(socket) {
        exports.socketIdMap[socket.id] = null;
    }
    async socketIdMapToLoginUser(token, socket) {
        const userId = authentication[token];
        if (!userId) {
            socket.emit('log-in', { errorMessage: '잘못된 접근입니다.', status: 401 });
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 401, 'log-in');
        }
        if (exports.socketIdMap[socket.id]) {
            socket.emit('log-in', { errorMessage: '이미 로그인된 회원입니다.', status: 403 });
            throw new ws_exception_filter_1.SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
        }
        const usersInSocketIdMap = Object.values(exports.socketIdMap);
        const requestUserInSocketIdMap = usersInSocketIdMap.find((user) => {
            if (!user)
                return null;
            return user.userId === userId;
        });
        if (requestUserInSocketIdMap) {
            socket.emit('log-in', { errorMessage: '이미 로그인된 회원입니다.', status: 403 });
            throw new ws_exception_filter_1.SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
        }
        const user = await fakeDBUserTable.find((user) => user.userId === userId);
        exports.socketIdMap[socket.id] = {
            userId,
            nickname: user.nickname,
            profileImg: user.profileImg,
        };
        return console.log(exports.socketIdMap[socket.id]);
    }
    socketIdMapToLogOutUser(socket) {
        exports.socketIdMap[socket.id] = null;
        return console.log(exports.socketIdMap[socket.id]);
    }
    handleLeaveRoom(socketId) {
        exports.socketIdMap[socketId].currentRoom = null;
        return console.log(exports.socketIdMap[socketId]);
    }
};
PlayersService = __decorate([
    (0, common_1.Injectable)()
], PlayersService);
exports.PlayersService = PlayersService;
//# sourceMappingURL=players.service.js.map