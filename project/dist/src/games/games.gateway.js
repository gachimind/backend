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
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
const room_service_1 = require("./room.service");
const players_service_1 = require("./players.service");
const chat_service_1 = require("./chat.service");
const games_service_1 = require("./games.service");
const event_user_info_constructor_1 = require("./util/event.user.info.constructor");
const update_room_info_constructor_1 = require("./util/update-room.info.constructor");
let GamesGateway = class GamesGateway {
    constructor(roomService, playersService, chatService, gamesService) {
        this.roomService = roomService;
        this.playersService = playersService;
        this.chatService = chatService;
        this.gamesService = gamesService;
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
        const requestUser = await this.playersService.getUserBySocketId(socket.id);
        if (!requestUser)
            return console.log('disconnected socket', socket.id);
        await this.playersService.removeSocketBySocketId(socket.id, requestUser.userInfo);
        if (requestUser.player) {
            await this.handleLeaveRoomRequest(socket, requestUser);
        }
        return console.log('disconnected socket', socket.id);
    }
    async socketIdMapToLoginUser(socket, { data }) {
        const token = data.authorization;
        if (!token) {
            throw new ws_exception_filter_1.SocketException('????????? ????????? ??????????????????.', 401, 'log-in');
        }
        const requestUser = await this.playersService.getUserIdByToken(token);
        if (!requestUser) {
            throw new ws_exception_filter_1.SocketException('????????? ????????? ?????? ??? ????????????', 404, 'log-in');
        }
        const prevLogInInfo = await this.playersService.getUserByUserID(requestUser.userId);
        if (prevLogInInfo) {
            const prevSockets = await this.server
                .in(prevLogInInfo.socketId)
                .fetchSockets();
            if (prevSockets.length) {
                prevSockets[0].emit('error', {
                    error: {
                        errorMessage: '?????? ????????? ????????? socketId??? ????????? ???????????????.',
                        status: 409,
                        event: 'log-in',
                    },
                });
                prevSockets[0].disconnect(true);
            }
        }
        await this.playersService.socketIdMapToLoginUser(requestUser.userId, socket.id);
        await this.playersService.createTodayResult(requestUser.userId);
        console.log('????????? ??????!');
        socket.emit('log-in', { message: '????????? ??????!' });
    }
    async socketIdMapToLogOutUser(socket) {
        const event = 'log-out';
        const requestUser = await this.socketAuthentication(socket.id, event);
        await this.playersService.removeSocketBySocketId(socket.id, requestUser.userInfo);
        if (requestUser.player) {
            await this.handleLeaveRoomRequest(socket, requestUser);
        }
        console.log('???????????? ??????!');
        socket.emit('log-out', { message: '???????????? ??????!' });
    }
    async handleCreateRoomRequest(socket, { data }) {
        const event = 'create-room';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (requestUser.player) {
            throw new ws_exception_filter_1.SocketException('????????? ???????????????.', 400, event);
        }
        const roomId = await this.roomService.createRoom(data);
        socket.emit('create-room', { data: { roomId } });
    }
    async handleEnterRoomRequest(socket, { data: requestRoom }) {
        const event = 'enter-room';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (requestUser.player) {
            throw new ws_exception_filter_1.SocketException('????????? ???????????????.', 400, event);
        }
        await this.roomService.enterRoom(requestUser, requestRoom);
        socket.join(`${requestRoom.roomId}`);
        const updateRoom = await this.updateRoomAfterEnterOrLeave(requestRoom.roomId);
        await this.announceUpdateRoomInfo(updateRoom, requestUser, 'enter');
    }
    async handleValidRoomPassword(socket, { data: { password, roomId } }) {
        await this.socketAuthentication(socket.id, 'valid-room-password');
        await this.roomService.validateRoomPassword(password, roomId);
        socket.emit('valid-room-password');
    }
    async handleLeaveRoomEvent(socket) {
        const event = 'leave-room';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('????????? ???????????????.', 400, event);
        }
        return await this.handleLeaveRoomRequest(socket, requestUser);
    }
    async handleReadyEvent(socket) {
        const event = 'ready';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player || requestUser.player.isHost) {
            throw new ws_exception_filter_1.SocketException('????????? ???????????????.', 400, event);
        }
        await this.playersService.setPlayerReady(requestUser.player);
        const room = await this.roomService.updateIsGameReadyToStart(requestUser.player.roomInfo);
        await this.updateRoomInfoToRoom(room, requestUser, event);
    }
    async handleStartEvent(socket) {
        const event = 'start';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player.isHost) {
            throw new ws_exception_filter_1.SocketException('????????? ????????? ????????? ??? ????????????.', 400, event);
        }
        let room = requestUser.player.room;
        room = await this.roomService.updateIsGameOn(room.roomId);
        await this.updateRoomListToMain();
        const gameResults = await this.gamesService.createGameResultPerPlayer(room.roomId);
        await this.gamesService.createGameMap(room, gameResults);
        room = await this.controlGameTurns(room);
        room = await this.gamesService.handleGameEndEvent(room);
        this.announceUpdateRoomInfo({ room, state: 'updated' }, null, 'game-end');
    }
    async sendChatRequest(socket, { data }) {
        const event = 'send-chat';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('????????? ???????????????.', 400, event);
        }
        let type = 'chat';
        const room = requestUser.player.room;
        let turn;
        if (requestUser.player.room.turns.length) {
            turn = await this.gamesService.getTurnByTurnId(await this.gamesService.getGameMapCurrentTurnId(room.roomId));
        }
        if (room.isGameOn && turn) {
            const isAnswer = this.chatService.FilterAnswer(turn, requestUser.userInfo, data.message);
            if (isAnswer && requestUser.player.userInfo != turn.speechPlayer) {
                type = 'answer';
                const turnResult = await this.gamesService.recordPlayerScore(requestUser.userInfo, room);
                this.emitScoreEvent(room.roomId, requestUser.userInfo, turnResult.score);
                data.message = `${requestUser.user.nickname}?????? ????????? ??????????????????!`;
            }
        }
        return this.emitReceiveChatEvent(room.roomId, requestUser, data.message, type);
    }
    async handleTurnEvaluation(socket, { data }) {
        const event = 'turn-evaluate';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('????????? ???????????????.', 400, event);
        }
        const turn = await this.gamesService.getTurnByTurnId(await this.gamesService.getGameMapCurrentTurnId(requestUser.player.roomInfo));
        if (turn.currentEvent !== 'discussionTime') {
            throw new ws_exception_filter_1.SocketException('????????? ???????????? ????????? ??? ????????????.', 400, event);
        }
        const score = await this.gamesService.updateTurnMapSpeechScore(requestUser.player.roomInfo, data.score);
        this.emitScoreEvent(requestUser.player.roomInfo, turn.speechPlayer, score);
    }
    async handleIce(socket, { data }) {
        const event = 'webrtc-ice';
        const { candidateReceiveSocketId, ice } = data;
        socket.broadcast
            .to(candidateReceiveSocketId)
            .emit(event, { data: { ice, iceSendSocketId: socket.id } });
    }
    async handleOffer(socket, { data }) {
        const event = 'webrtc-offer';
        const { sessionDescription, offerReceiveSocketId } = data;
        socket.broadcast
            .to(offerReceiveSocketId)
            .emit(event, { data: { sessionDescription, offerSendSocketId: socket.id } });
    }
    async handleAnswer(socket, { data }) {
        const event = 'webrtc-answer';
        const { sessionDescription, answerReceiveSocketId } = data;
        socket.broadcast
            .to(answerReceiveSocketId)
            .emit(event, { data: { sessionDescription, answerSendSocketId: socket.id } });
    }
    async handler(socket) {
        const event = 'webrtc-leave';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('????????? ???????????????.', 400, event);
        }
        this.server
            .to(`${requestUser.player.roomInfo}`)
            .emit(event, { data: { leaverSocketId: socket.id } });
    }
    async handleChangeStream(socket, { data }) {
        const event = 'update-userstream';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('????????? ???????????????.', 400, event);
        }
        this.server.to(`${requestUser.player.roomInfo}`).emit(event, {
            data: { socketId: socket.id, video: data.video, audio: data.audio },
        });
    }
    async socketAuthentication(socketId, event) {
        const requestUser = await this.playersService.getUserBySocketId(socketId);
        if (!requestUser) {
            throw new ws_exception_filter_1.SocketException('???????????? ????????? ??????????????????.', 403, event);
        }
        return requestUser;
    }
    async handleLeaveRoomRequest(socket, requestUser) {
        const roomId = requestUser.player.roomInfo;
        await this.RemovePlayerFromRoom(requestUser.player.roomInfo, requestUser, socket);
        const updateRoom = await this.updateRoomAfterEnterOrLeave(roomId);
        this.announceUpdateRoomInfo(updateRoom, requestUser, 'leave');
        if (requestUser.player.room.isGameOn) {
            await this.gamesService.removePlayerFromGameMapRemainingTurns(roomId, requestUser.userInfo);
            await this.gamesService.reduceGameMapCurrentPlayers(roomId);
            if ((await this.gamesService.getGameMapKeywordsCount(roomId)) >
                (await this.gamesService.getGameMapRemainingTurns(roomId))) {
                await this.gamesService.popGameMapKeywords(roomId);
            }
            let turn;
            if (requestUser.player.room.turns.length) {
                turn = await this.gamesService.getTurnByTurnId(await this.gamesService.getGameMapCurrentTurnId(roomId));
            }
            if (turn &&
                requestUser.player.userInfo === turn.speechPlayer &&
                (turn.currentEvent === 'readyTime' || turn.currentEvent === 'speechTime')) {
                await this.handleEndTurnBySpeechPlayerLeaveEvent(turn, socket);
                if ((await this.gamesService.getGameMapCurrentPlayers(roomId)) === 1) {
                    await this.emitCannotStartError(roomId);
                    const room = await this.gamesService.handleGameEndEvent(requestUser.player.room);
                    return this.announceUpdateRoomInfo({ room, state: 'updated' }, null, 'game-end');
                }
                if (!(await this.gamesService.getGameMapRemainingTurns(roomId))) {
                    const room = await this.gamesService.handleGameEndEvent(requestUser.player.room);
                    return this.announceUpdateRoomInfo({ room, state: 'updated' }, null, 'game-end');
                }
                if (await this.gamesService.getGameMapRemainingTurns(roomId)) {
                    return this.controlGameTurns(updateRoom.room);
                }
            }
            if ((await this.gamesService.getGameMapCurrentPlayers(roomId)) === 1) {
                if (turn && turn.speechPlayer === requestUser.userInfo) {
                    await this.gamesService.createSpeechPlayerTurnResult(roomId, turn);
                }
                await this.handleEndGameByPlayerLeaveEvent(requestUser.player.room);
            }
        }
    }
    async RemovePlayerFromRoom(roomId, requestUser, socket) {
        socket.leave(`${roomId}`);
        if (requestUser)
            await this.playersService.removePlayerByUserId(requestUser.userInfo);
    }
    async updateHostPlayer(updateRoom) {
        const newHostPlayer = {
            userInfo: updateRoom.players[0].userInfo,
            isHost: true,
        };
        await this.playersService.updatePlayerStatusByUserId(newHostPlayer);
        return false;
    }
    async updateRoomAfterEnterOrLeave(roomId) {
        const room = await this.roomService.getOneRoomByRoomId(roomId);
        if (!room.players.length) {
            await this.roomService.removeRoomByRoomId(roomId);
            return { room, state: 'deleted' };
        }
        if (!room.players[0].isHost) {
            await this.updateHostPlayer(room);
        }
        const updateRoom = await this.roomService.updateIsGameReadyToStart(room.roomId);
        return { room: updateRoom, state: 'updated' };
    }
    async announceUpdateRoomInfo(roomUpdate, requestUser, event) {
        if (roomUpdate.state === 'updated') {
            this.updateRoomInfoToRoom(roomUpdate.room, requestUser, event);
        }
        await this.updateRoomListToMain();
    }
    updateRoomInfoToRoom(room, requestUser, event) {
        const eventUserInfo = (0, event_user_info_constructor_1.eventUserInfoConstructor)(requestUser);
        const updateRoom = (0, update_room_info_constructor_1.updateRoomInfoConstructor)(room);
        this.server.to(`${updateRoom.roomId}`).emit('update-room', {
            data: { room: updateRoom, eventUserInfo, event },
        });
    }
    async updateRoomListToMain() {
        const roomList = await this.roomService.getAllRoomList();
        const roomIdList = (() => {
            return roomList.map((room) => {
                return `${room.roomId}`;
            });
        })();
        this.server.except(roomIdList).emit('room-list', { data: roomList });
    }
    async controlGameTurns(room) {
        await this.controlTurnTimer(room, 'startCount');
        while (await this.gamesService.getGameMapRemainingTurns(room.roomId)) {
            await this.throwCannotStartError(room.roomId);
            let turn = await this.gamesService.createTurn(room.roomId);
            await this.controlTurnTimer(room, 'readyTime', turn);
            await this.controlTurnTimer(room, 'speechTime', turn);
            await this.gamesService.updateTurnMapNumberOfEvaluators(room.roomId);
            await this.controlTurnTimer(room, 'discussionTime', turn);
            room = await this.roomService.getOneRoomByRoomId(room.roomId);
        }
        return room;
    }
    async controlTurnTimer(room, eventName, turn) {
        const roomId = room.roomId;
        const timer = eventName === 'startCount' ? 5000 : room[eventName];
        const event = eventName === 'startCount' ? eventName : `${eventName}r`;
        this.throwCannotStartError(room.roomId);
        if (event != 'startCount')
            turn = await this.gamesService.updateTurn(turn, eventName);
        if (event === 'readyTimer') {
            this.emitGameInfo(turn, roomId);
        }
        const currentTurn = event === 'startCount' ? null : turn.turn;
        this.emitTimeStartEvent(roomId, timer, event, currentTurn);
        await this.gamesService.createTimer(timer, roomId);
        if (event === 'discussionTimer') {
            const extraScore = await this.gamesService.createSpeechPlayerTurnResult(roomId, turn);
            this.emitScoreEvent(roomId, turn.speechPlayer, extraScore);
        }
        await this.emitTimeEndEvent(roomId, timer, event, currentTurn);
        return;
    }
    async handleEndTurnBySpeechPlayerLeaveEvent(turn, socket) {
        await this.gamesService.breakTimer(turn.roomInfo, common_1.Next);
        socket.to(`${turn.roomInfo}`).emit('error', {
            error: {
                errorMessage: '???????????? ????????????!',
                status: 400,
                event: 'leave-game',
            },
        });
        await this.gamesService.deleteTurnByTurnId(turn.turnId);
    }
    async handleEndGameByPlayerLeaveEvent(room) {
        await this.emitCannotStartError(room.roomId);
        room = await this.gamesService.handleGameEndEvent(room);
        const updateRoom = await this.updateRoomAfterEnterOrLeave(room.roomId);
        return this.announceUpdateRoomInfo(updateRoom, null, 'game-end');
    }
    async emitCannotStartError(roomId) {
        if ((await this.gamesService.getGameMapCurrentPlayers(roomId)) < 2) {
            await this.gamesService.breakTimer(roomId, common_1.Next);
            this.server.to(`${roomId}`).emit('error', {
                errorMessage: '????????? ????????? ??? ????????????.',
                status: 400,
                event: 'game',
            });
        }
    }
    async throwCannotStartError(roomId) {
        if ((await this.gamesService.getGameMapCurrentPlayers(roomId)) < 2) {
            await this.gamesService.breakTimer(roomId, common_1.Next);
            this.server.to(`${roomId}`).emit('error', {
                errorMessage: '????????? ????????? ??? ????????????.',
                status: 400,
                event: 'game',
            });
            throw new ws_exception_filter_1.SocketException('????????? ????????? ??? ????????????.', 400, 'game');
        }
    }
    emitGameInfo(turn, roomId) {
        const turnInfo = {
            currentTurn: turn.turn,
            speechPlayer: turn.speechPlayer,
            keyword: turn.keyword,
            hint: turn.hint,
        };
        this.server.to(`${roomId}`).emit('game-info', { data: turnInfo });
    }
    emitTimeStartEvent(roomId, timer, event, turn) {
        this.server.to(`${roomId}`).emit('time-start', {
            data: {
                currentTurn: turn ? turn : 1,
                timer,
                event,
            },
        });
    }
    emitScoreEvent(roomId, userId, score) {
        this.server.to(`${roomId}`).emit('score', { data: { userId, score } });
    }
    async emitTimeEndEvent(roomId, timer, event, turn) {
        let key = 'currentTurn';
        if (event === 'discussionTimer') {
            turn = (await this.gamesService.getGameMapRemainingTurns(roomId)) ? turn + 1 : 0;
            key = 'nextTurn';
        }
        const data = {
            [key]: turn || turn === 0 ? turn : 1,
            timer,
            event,
        };
        this.server.to(`${roomId}`).emit('time-end', { data });
    }
    emitReceiveChatEvent(roomId, requestUser, message, type) {
        const eventUserInfo = (0, event_user_info_constructor_1.eventUserInfoConstructor)(requestUser);
        this.server
            .to(`${roomId}`)
            .emit('receive-chat', { data: { message, eventUserInfo, type } });
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
    (0, websockets_1.SubscribeMessage)('valid-room-password'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleValidRoomPassword", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleLeaveRoomEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ready'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleReadyEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleStartEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "sendChatRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('turn-evaluate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleTurnEvaluation", null);
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
    (0, common_1.UseFilters)(new ws_exception_filter_1.SocketExceptionFilter()),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['https://gachimind.com', 'http://localhost:3001'],
            credentials: true,
            allowedHeaders: ['my-custom-header'],
            methods: ['GET', 'POST'],
        },
    }),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        players_service_1.PlayersService,
        chat_service_1.ChatService,
        games_service_1.GamesService])
], GamesGateway);
exports.GamesGateway = GamesGateway;
//# sourceMappingURL=games.gateway.js.map