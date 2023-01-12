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
const inGame_users_service_1 = require("./inGame-users.service");
let GamesGateway = class GamesGateway {
    constructor(roomService, chatService, inGameUsersService) {
        this.roomService = roomService;
        this.chatService = chatService;
        this.inGameUsersService = inGameUsersService;
    }
    afterInit(server) {
        console.log('webSocketServer init');
    }
    async handleConnection(socket) {
        console.log('connected socket', socket.id);
        const data = await this.roomService.getAllRoomList();
        socket.emit('room-list', { data });
    }
    async handleDisconnect(socket) {
        await this.inGameUsersService.handleDisconnect(socket);
        console.log('disconnected socket', socket.id);
    }
    async socketIdMapToLoginUser(socket, { data }) {
        if (!data.authorization) {
            socket.emit('log-in', { errorMessage: '잘못된 접근입니다.', status: 401 });
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 401, 'log-in');
        }
        const token = data.authorization;
        await this.inGameUsersService.socketIdMapToLoginUser(token, socket);
        console.log('로그인 성공!');
        socket.emit('log-in', { message: '로그인 성공!' });
    }
    async socketIdMapToLogOutUser(socket) {
        const requestUser = inGame_users_service_1.socketIdMap[socket.id];
        if (!requestUser) {
            socket.emit('leave-room', {
                errorMessage: '로그인이 필요한 서비스입니다.',
                status: 401,
            });
            throw new ws_exception_filter_1.SocketException('로그인이 필요한 서비스입니다.', 403, 'leave-room');
        }
        if (requestUser.currentRoom) {
            const updateRoomInfo = await this.roomService.leaveRoom(requestUser);
            socket.leave(`${updateRoomInfo.roomId}`);
            this.server
                .to(`${updateRoomInfo.roomId}`)
                .emit('update-room', { data: updateRoomInfo });
            const data = await this.roomService.getAllRoomList();
            this.server.except(`${updateRoomInfo.roomId}`).emit('room-list', { data });
        }
        await this.inGameUsersService.socketIdMapToLogOutUser(socket);
        console.log('로그아웃 성공!');
        socket.emit('log-out', { message: '로그아웃 성공!' });
    }
    async handleCreateRoomRequest(socket, { data }) {
        const requestUser = inGame_users_service_1.socketIdMap[socket.id];
        if (!requestUser) {
            socket.emit('create-room', {
                errorMessage: '로그인이 필요한 서비스입니다.',
                status: 401,
            });
            throw new ws_exception_filter_1.SocketException('로그인이 필요한 서비스입니다.', 403, 'create-room');
        }
        const newRoomId = await this.roomService.createRoom(data);
        socket.emit('create-room', { data: { roomId: newRoomId } });
        const updateRoomList = await this.roomService.getAllRoomList();
        this.server.emit('room-list', { data: updateRoomList });
    }
    async handleEnterRoomRequest(socket, { data }) {
        const requestUser = inGame_users_service_1.socketIdMap[socket.id];
        if (!requestUser) {
            socket.emit('enter-room', {
                errorMessage: '로그인이 필요한 서비스입니다.',
                status: 401,
            });
            throw new ws_exception_filter_1.SocketException('로그인이 필요한 서비스입니다.', 403, 'enter-room');
        }
        if (requestUser.currentRoom) {
            socket.emit('enter-room', {
                errorMessage: '잘못된 접근입니다.',
                status: 400,
            });
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, 'enter-room');
        }
        const requestRoom = data;
        const isRoomAvailable = await this.roomService.isRoomAvailable(requestUser, requestRoom);
        if (!isRoomAvailable.availability) {
            socket.emit('enter-room', {
                errorMessage: isRoomAvailable.message,
                status: isRoomAvailable.status,
            });
            throw new ws_exception_filter_1.SocketException(isRoomAvailable.message, isRoomAvailable.status, 'enter-room');
        }
        const updateRoomInfo = await this.roomService.updateRoomParticipants(socket.id, requestUser, isRoomAvailable.room);
        socket.join(`${updateRoomInfo.roomId}`);
        this.server.to(`${updateRoomInfo.roomId}`).emit('update-room', { data: updateRoomInfo });
        const roomInfoList = await this.roomService.getAllRoomList();
        this.server.except(`${updateRoomInfo.roomId}`).emit('room-list', { data: roomInfoList });
    }
    async handleLeaveRoomEvent(socket) {
        const requestUser = inGame_users_service_1.socketIdMap[socket.id];
        if (!requestUser) {
            socket.emit('leave-room', {
                errorMessage: '로그인이 필요한 서비스입니다.',
                status: 401,
            });
            throw new ws_exception_filter_1.SocketException('로그인이 필요한 서비스입니다.', 403, 'leave-room');
        }
        const updateRoomInfo = await this.roomService.leaveRoom(requestUser);
        await this.inGameUsersService.handleLeaveRoom(socket.id);
        socket.leave(`${updateRoomInfo.roomId}`);
        if (updateRoomInfo)
            this.server
                .to(`${updateRoomInfo.roomId}`)
                .emit('update-room', { data: updateRoomInfo });
        const roomInfoList = await this.roomService.getAllRoomList();
        this.server.except(`${updateRoomInfo.roomId}`).emit('room-list', { data: roomInfoList });
    }
    async sendChatRequest(socket, { data }) {
        const message = data.message;
        const { nickname, currentRoom } = inGame_users_service_1.socketIdMap[socket.id];
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
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('log-in'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
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
], GamesGateway.prototype, "handleCreateRoomRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('enter-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleEnterRoomRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleLeaveRoomEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "sendChatRequest", null);
GamesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        chat_service_1.ChatService,
        inGame_users_service_1.InGameUsersService])
], GamesGateway);
exports.GamesGateway = GamesGateway;
//# sourceMappingURL=games.gateway.js.map