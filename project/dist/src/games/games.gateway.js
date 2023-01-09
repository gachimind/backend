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
exports.GamesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const room_service_1 = require("./room.service");
const chat_service_1 = require("./chat.service");
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
const roomList = [];
const socketIdMap = {};
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
let GamesGateway = class GamesGateway {
    constructor(roomService, chatService) {
        this.roomService = roomService;
        this.chatService = chatService;
    }
    afterInit(server) {
        console.log('webSocketServer init');
    }
    handleConnection(socket) {
        console.log('connected socket', socket.id);
        const data = roomList.map((room) => {
            return {
                roomId: room.roomId,
                roomTitle: room.roomTitle,
                maxCount: room.maxCount,
                participants: room.participants.length,
                isSecreteRoom: room.isSecreteRoom,
                isGameOn: room.isGameOn,
            };
        });
        socket.emit('room-list', { data });
    }
    handleDisconnect(socket) {
        socketIdMap[socket.id] = null;
        console.log('disconnected socket', socket.id);
    }
    socketIdMapToLoginUser(socket, { data }) {
        const token = data.authorization;
        const userId = authentication[token];
        if (!userId)
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 401);
        if (socketIdMap[socket.id]) {
            socket.emit('log-in', { errorMessage: '이미 로그인된 회원입니다.', status: 403 });
            throw new ws_exception_filter_1.SocketException('이미 로그인된 회원입니다.', 403);
        }
        const connectedUsers = Object.values(socketIdMap);
        for (const user of connectedUsers) {
            if (user && user.userId === userId) {
                socket.emit('log-in', { errorMessage: '이미 로그인된 회원입니다.', status: 403 });
                throw new ws_exception_filter_1.SocketException('이미 로그인된 회원입니다.', 403);
            }
        }
        for (const user of fakeDBUserTable) {
            if (user.userId === userId) {
                socketIdMap[socket.id] = {
                    userId,
                    nickname: user.nickname,
                    profileImg: user.profileImg,
                };
            }
        }
        console.log('로그인 성공!');
        socket.emit('log-in', { message: '로그인 성공!' });
    }
    async socketIdMapToLogOutUser(socket) {
        socketIdMap[socket.id] = null;
    }
    async createRoomRequest(socket, { data }) {
        const room = data;
        const requestedUser = socketIdMap[socket.id];
        if (!requestedUser) {
            socket.emit('create-room', {
                errorMessage: '로그인이 필요한 서비스입니다.',
                status: 401,
            });
            throw new ws_exception_filter_1.SocketException('로그인이 필요한 서비스입니다.', 403);
        }
        room.roomId = roomList.length + 1;
        room.isGameOn = false;
        room.participants = [
            {
                userId: requestedUser.userId,
                nickname: requestedUser.nickname,
                profileImg: requestedUser.profileImg,
                isHost: true,
                isReady: false,
            },
        ];
        roomList.push(room);
        requestedUser.currentRoom = room.roomId;
        console.log(requestedUser);
        const newRoom = {
            roomId: room.roomId,
            roomTitle: room.roomTitle,
            maxCount: room.maxCount,
            participants: room.participants.length,
            isSecreteRoom: room.isSecreteRoom,
            isGameOn: room.isGameOn,
        };
        await this.server.emit('create-room', { data: newRoom });
        return socket.join(`${room.roomId}`);
    }
    async enterRoomRequest(socket, { data }) {
        const requestedUser = socketIdMap[socket.id];
        const room = data;
        for (const existRoom of roomList) {
            if (existRoom.roomId !== room.roomId) {
                socket.emit('enter-room', {
                    errorMessage: '방을 찾을 수 없습니다.',
                    status: 404,
                });
                throw new ws_exception_filter_1.SocketException('방을 찾을 수 없습니다.', 404);
            }
            if (existRoom.maxCount === existRoom.participants.length) {
                socket.emit('enter-room', {
                    errorMessage: '정원초과로 방 입장에 실패했습니다.',
                    status: 400,
                });
                throw new ws_exception_filter_1.SocketException('정원초과로 방 입장에 실패했습니다.', 400);
            }
            if (existRoom.IsSecreteRoom) {
                if (existRoom.roomPassword !== room.roomPassword) {
                    socket.emit('enter-room', {
                        errorMessage: '비밀번호가 일치하지 않습니다.',
                        status: 403,
                    });
                    throw new ws_exception_filter_1.SocketException('비밀번호가 일치하지 않습니다.', 403);
                }
            }
            const findUserInRoom = existRoom.participants.filter((user) => {
                return user.userId === requestedUser.userId;
            });
            if (findUserInRoom) {
                socket.emit('enter-room', {
                    errorMessage: '잘못된 요청입니다.',
                    status: 400,
                });
                throw new ws_exception_filter_1.SocketException('비밀번호가 일치하지 않습니다.', 403);
            }
            existRoom.participants.push({
                userId: requestedUser.userId,
                nickname: requestedUser.nickname,
                profileImg: requestedUser.profileImg,
                isHost: false,
                isReady: false,
            });
            requestedUser.currentRoom = room.roomId;
            await this.server.to(`${room.roomId}`).emit('update-room', { data: existRoom });
            socket.join(`${room.roomId}`);
            this.server.except(`${room.roomId}`).emit('update-room-list', {
                data: {
                    roomId: existRoom.roomId,
                    roomTitle: existRoom.roomTitle,
                    maxCount: existRoom.maxCount,
                    round: existRoom.round,
                    participants: existRoom.participants.length,
                    isSecreteRoom: existRoom.isSecreteRoom,
                    isGameOn: existRoom.isGameOn,
                },
            });
            console.log('enter room', existRoom);
        }
    }
    sendChatRequest(socket, { data }) {
        const message = data.message;
        const { nickname, currentRoom } = socketIdMap[socket.id];
        this.server.to(`${currentRoom}`).emit('receive-chat', { data: { nickname, message } });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GamesGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Object)
], GamesGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Object)
], GamesGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('log-in'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "socketIdMapToLoginUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('log-out'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "socketIdMapToLogOutUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('create-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "createRoomRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('enter-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "enterRoomRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Object)
], GamesGateway.prototype, "sendChatRequest", null);
GamesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        chat_service_1.ChatService])
], GamesGateway);
exports.GamesGateway = GamesGateway;
//# sourceMappingURL=games.gateway.js.map