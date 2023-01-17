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
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
const players_service_1 = require("./players.service");
const event_user_info_constructor_1 = require("./util/event.user.info.constructor");
const chat_service_1 = require("./chat.service");
const common_1 = require("@nestjs/common");
let GamesGateway = class GamesGateway {
    constructor(roomService, playersService, chatService) {
        this.roomService = roomService;
        this.playersService = playersService;
        this.chatService = chatService;
    }
    afterInit(server) {
        console.log('webSocketServer init');
    }
    async handleConnection(socket) {
        console.log('connected socket', socket.id);
        const data = await this.roomService.getAllRoomList();
        socket.emit('room-list', { data });
        await this.roomService.removeRoomByRoomId(8);
    }
    async handleDisconnect(socket) {
        const requestUser = await this.playersService.getUserBySocketId(socket.id);
        if (!requestUser)
            return console.log('disconnected socket', socket.id);
        await this.playersService.removeSocketBySocketId(socket.id);
        if (requestUser.player) {
            const isRoomDeleted = await this.updateRoomStatus(requestUser, requestUser.player.roomInfo);
            await this.updateRoomAnnouncement(requestUser, requestUser.player.roomInfo, 'leave', isRoomDeleted);
        }
        console.log('disconnected socket', socket.id);
    }
    async socketIdMapToLoginUser(socket, { data }) {
        throw new ws_exception_filter_1.SocketException('test', 400, 'handle-connection');
        const token = data.authorization;
        if (!token) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 401, 'log-in');
        }
        await this.playersService.socketIdMapToLoginUser(token, socket.id);
        console.log('로그인 성공!');
        socket.emit('log-in', { message: '로그인 성공!' });
    }
    async socketIdMapToLogOutUser(socket) {
        const requestUser = await this.socketAuthentication(socket.id);
        if (requestUser.player)
            await this.handleUserToLeaveRoom(requestUser, socket);
        await this.playersService.removeSocketBySocketId(socket.id);
        console.log('로그아웃 성공!');
        socket.emit('log-out', { message: '로그아웃 성공!' });
    }
    async handleCreateRoomRequest(socket, { data }) {
        const requestUser = await this.socketAuthentication(socket.id);
        if (requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, 'enter-room');
        }
        const roomId = await this.roomService.createRoom(data);
        socket.emit('create-room', { data: { roomId } });
        const updateRoomList = await this.roomService.getAllRoomList();
        this.server.emit('room-list', { data: updateRoomList });
    }
    async handleEnterRoomRequest(socket, { data: requestRoom }) {
        const requestUser = await this.socketAuthentication(socket.id);
        if (requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, 'enter-room');
        }
        await this.roomService.enterRoom(requestUser, requestRoom);
        socket.join(`${requestRoom.roomId}`);
        await this.updateRoomAnnouncement(requestUser, requestRoom.roomId, 'enter');
    }
    async handleLeaveRoomEvent(socket) {
        const requestUser = await this.socketAuthentication(socket.id);
        await this.handleUserToLeaveRoom(requestUser, socket);
    }
    async sendChatRequest(socket, { data }) {
        const requestUser = await this.socketAuthentication(socket.id);
        const eventUserInfo = (0, event_user_info_constructor_1.eventUserInfoConstructor)(requestUser);
        this.server
            .to(`${requestUser.player.roomInfo}`)
            .emit('receive-chat', { data: { message: data.message, eventUserInfo } });
    }
    async handleIce(socket, { data }) {
        const requestUser = await this.socketAuthentication(socket.id);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, 'webrtc-ice');
        }
        const { candidateReceiveSocketId, ice } = data;
        socket.broadcast
            .to(candidateReceiveSocketId)
            .emit('webrtc-ice', { data: { ice, iceSendSocketId: socket.id } });
    }
    async handleOffer(socket, { data }) {
        const requestUser = await this.socketAuthentication(socket.id);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, 'webrtc-ice');
        }
        const { sessionDescription, offerReceiveSocketId } = data;
        socket.broadcast
            .to(offerReceiveSocketId)
            .emit('webrtc-offer', { data: { sessionDescription, offerSendSocketId: socket.id } });
    }
    async handleAnswer(socket, { data }) {
        const requestUser = await this.socketAuthentication(socket.id);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, 'webrtc-ice');
        }
        const { sessionDescription, answerReceiveSocketId } = data;
        socket.broadcast
            .to(answerReceiveSocketId)
            .emit('webrtc-answer', { data: { sessionDescription, answerSendSocketId: socket.id } });
    }
    async handler(socket) {
        const requestUser = await this.socketAuthentication(socket.id);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, 'webrtc-ice');
        }
        this.server
            .to(`${requestUser.player.roomInfo}`)
            .emit('webrtc-leave', { data: { leaverSocketId: socket.id } });
    }
    async handleChangeStream(socket, { data }) {
        const requestUser = await this.socketAuthentication(socket.id);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, 'webrtc-ice');
        }
        this.server.to(`${requestUser.player.roomInfo}`).emit('update-userstream', {
            data: { socketId: socket.id, video: data.video, audio: data.audio },
        });
    }
    async socketAuthentication(socketId) {
        const requestUser = await this.playersService.getUserBySocketId(socketId);
        if (!requestUser) {
            throw new ws_exception_filter_1.SocketException('로그인이 필요한 서비스입니다.', 403, 'create-room');
        }
        return requestUser;
    }
    async handleUserToLeaveRoom(requestUser, socket) {
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 요청입니다.', 400, 'leave-room');
        }
        await this.RemovePlayerFormRoom(requestUser, socket);
        const isRoomDeleted = await this.updateRoomStatus(requestUser, requestUser.player.roomInfo);
        await this.updateRoomAnnouncement(requestUser, requestUser.player.roomInfo, 'leave', isRoomDeleted);
    }
    async RemovePlayerFormRoom(requestUser, socket) {
        socket.leave(`${requestUser.player.roomInfo}`);
        await this.playersService.removePlayerByUserId(requestUser.userInfo);
    }
    async updateRoomStatus(requestUser, roomId) {
        const updateRoom = await this.roomService.getOneRoomByRoomId(roomId);
        if (!updateRoom.players.length) {
            await this.roomService.removeRoomByRoomId(updateRoom.roomId);
            return true;
        }
        else if (requestUser.player.isHost) {
            const newHostUser = {
                userInfo: updateRoom.players[0].userInfo,
                isHost: true,
            };
            await this.playersService.updatePlayerStatusByUserId(newHostUser);
            return false;
        }
    }
    async updateRoomAnnouncement(requestUser, roomId, event, isRoomDeleted) {
        const eventUserInfo = (0, event_user_info_constructor_1.eventUserInfoConstructor)(requestUser);
        if (!isRoomDeleted) {
            const updateRoomInfo = await this.roomService.updateRoomInfoToRoom(roomId);
            this.server.to(`${roomId}`).emit('update-room', {
                data: { room: updateRoomInfo, eventUserInfo, event },
            });
        }
        const roomInfoList = await this.roomService.getAllRoomList();
        this.server.except(`${roomId}`).emit('room-list', { data: roomInfoList });
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
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-ice'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleIce", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-offer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleOffer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-answer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handler", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('update-userstream'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleChangeStream", null);
GamesGateway = __decorate([
    (0, common_1.UseFilters)(ws_exception_filter_1.SocketExceptionFilter),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        players_service_1.PlayersService,
        chat_service_1.ChatService])
], GamesGateway);
exports.GamesGateway = GamesGateway;
//# sourceMappingURL=games.gateway.js.map