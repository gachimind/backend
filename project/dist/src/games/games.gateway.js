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
const promises_1 = require("timers/promises");
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
const room_service_1 = require("./room.service");
const players_service_1 = require("./players.service");
const chat_service_1 = require("./chat.service");
const games_service_1 = require("./games.service");
const event_user_info_constructor_1 = require("./util/event.user.info.constructor");
const update_room_info_constructor_1 = require("./util/update-room.info.constructor");
const game_timer_map_1 = require("./util/game-timer.map");
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
        await this.playersService.removeSocketBySocketId(socket.id);
        if (requestUser.player) {
            const turn = requestUser.player.room.turns.at(-1);
            if (turn &&
                turn.speechPlayer === requestUser.userInfo &&
                (turn.currentEvent === 'readyTime' || turn.currentEvent === 'speechTime')) {
                await this.handleSpeechPlayerLeaveRoomRequest(turn, socket, common_1.Next);
            }
            socket.leave(`${requestUser.player.roomInfo}`);
            const updateRoom = await this.updateRoom(requestUser.player.roomInfo);
            if (updateRoom.room.isGameOn)
                await this.controlGameTurns(updateRoom.room, common_1.Next);
            await this.announceUpdateRoomInfo(updateRoom, requestUser, 'leave');
        }
        return console.log('disconnected socket', socket.id);
    }
    async socketIdMapToLoginUser(socket, { data }) {
        const token = data.authorization;
        if (!token) {
            throw new ws_exception_filter_1.SocketException('사용자 인증에 실패했습니다.', 401, 'log-in');
        }
        const requestUser = await this.playersService.getUserIdByToken(token);
        if (!requestUser) {
            throw new ws_exception_filter_1.SocketException('사용자 정보를 찾을 수 없습니다', 404, 'log-in');
        }
        const prevLogInInfo = await this.playersService.getUserByUserID(requestUser.userId);
        if (prevLogInInfo) {
            await this.playersService.removeSocketBySocketId(prevLogInInfo.socketId);
            const prevSockets = await this.server.in(prevLogInInfo.socketId).fetchSockets();
            if (prevSockets.length > 0) {
                prevSockets[0].emit('error', {
                    error: {
                        errorMessage: '해당 유저가 새로운 socketId로 로그인 하였습니다.',
                        status: 409,
                        event: 'log-in',
                    },
                });
                prevSockets[0].disconnect(true);
            }
        }
        await this.playersService.socketIdMapToLoginUser(requestUser.userId, socket.id);
        await this.playersService.createTodayResult(requestUser.userId);
        console.log('로그인 성공!');
        socket.emit('log-in', { message: '로그인 성공!' });
    }
    async socketIdMapToLogOutUser(socket) {
        const event = 'log-out';
        const requestUser = await this.socketAuthentication(socket.id, event);
        await this.playersService.removeSocketBySocketId(socket.id);
        if (requestUser.player) {
            const turn = requestUser.player.room.turns.at(-1);
            if (turn &&
                turn.speechPlayer === requestUser.userInfo &&
                (turn.currentEvent === 'readyTime' || turn.currentEvent === 'speechTime')) {
                await this.handleSpeechPlayerLeaveRoomRequest(turn, socket, common_1.Next);
            }
            socket.leave(`${requestUser.player.roomInfo}`);
            const updateRoom = await this.updateRoom(requestUser.player.roomInfo);
            if (updateRoom.room.isGameOn)
                await this.controlGameTurns(updateRoom.room, common_1.Next);
            await this.announceUpdateRoomInfo(updateRoom, requestUser, 'leave');
        }
        console.log('로그아웃 성공!');
        socket.emit('log-out', { message: '로그아웃 성공!' });
    }
    async handleCreateRoomRequest(socket, { data }) {
        const event = 'create-room';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, event);
        }
        const roomId = await this.roomService.createRoom(data);
        socket.emit('create-room', { data: { roomId } });
    }
    async handleEnterRoomRequest(socket, { data: requestRoom }) {
        const event = 'enter-room';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, event);
        }
        await this.roomService.enterRoom(requestUser, requestRoom);
        socket.join(`${requestRoom.roomId}`);
        const updateRoom = await this.updateRoom(requestRoom.roomId);
        await this.announceUpdateRoomInfo(updateRoom, requestUser, 'enter');
    }
    async handleValidRoomPassword(socket, { data: { password, roomId } }) {
        await this.socketAuthentication(socket.id, 'valid-room-password');
        await this.roomService.validateRoomPassword(password, roomId);
        socket.emit('valid-room-password');
    }
    async handleLeaveRoomEvent(socket, next) {
        const event = 'leave-room';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 요청입니다.', 400, event);
        }
        await this.handleLeaveRoomRequest(socket, requestUser);
    }
    async handleReadyEvent(socket) {
        const event = 'ready';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player || requestUser.player.isHost) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, event);
        }
        await this.playersService.setPlayerReady(requestUser.player);
        const room = await this.roomService.updateIsGameReadyToStart(requestUser.player.roomInfo);
        await this.updateRoomInfoToRoom(room, requestUser, event);
    }
    async handleStartEvent(socket) {
        const event = 'start';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player.isHost) {
            throw new ws_exception_filter_1.SocketException('방장만 게임을 시작할 수 있습니다.', 400, event);
        }
        let room = requestUser.player.room;
        room = await this.roomService.updateIsGameOn(room.roomId);
        await this.updateRoomListToMain();
        await this.gamesService.createGameResultPerPlayer(room.roomId);
        await this.controlTurnTimer(room, 'startCount');
        await this.controlGameTurns(room, common_1.Next);
    }
    async sendChatRequest(socket, { data }) {
        const event = 'send-chat';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 요청입니다.', 400, event);
        }
        const currentTurn = requestUser.player.room.turns.at(-1);
        let type = 'chat';
        if (requestUser.player.room.isGameOn &&
            (currentTurn.currentEvent === 'readyTime' || currentTurn.currentEvent === 'speechTime')) {
            const isAnswer = this.chatService.checkAnswer(data.message, requestUser.player.room);
            if (isAnswer && requestUser.userInfo === currentTurn.speechPlayer) {
                throw new ws_exception_filter_1.SocketException('발표자는 정답을 채팅으로 알릴 수 없습니다.', 400, 'send-chat');
            }
            if (currentTurn.currentEvent === 'speechTime') {
                if (isAnswer) {
                    const result = await this.gamesService.recordPlayerScore(requestUser.player.user, requestUser.player.roomInfo);
                    type = 'answer';
                    this.server.to(`${requestUser.player.roomInfo}`).emit('score', {
                        data: { userId: requestUser.userInfo, score: result.score },
                    });
                }
            }
        }
        if (type === 'answer') {
            data.message = `${requestUser.user.nickname}님이 정답을 맞추셨습니다!`;
        }
        const eventUserInfo = (0, event_user_info_constructor_1.eventUserInfoConstructor)(requestUser);
        this.server
            .to(`${requestUser.player.roomInfo}`)
            .emit('receive-chat', { data: { message: data.message, eventUserInfo, type } });
    }
    async handleTurnEvaluation(socket, { data }) {
        const event = 'turn-evaluate';
        const requestUser = await this.socketAuthentication(socket.id, event);
        const roomId = requestUser.player.roomInfo;
        this.gamesService.saveEvaluationScore(roomId, data);
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
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, event);
        }
        this.server
            .to(`${requestUser.player.roomInfo}`)
            .emit(event, { data: { leaverSocketId: socket.id } });
    }
    async handleChangeStream(socket, { data }) {
        const event = 'update-userstream';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, event);
        }
        this.server.to(`${requestUser.player.roomInfo}`).emit(event, {
            data: { socketId: socket.id, video: data.video, audio: data.audio },
        });
    }
    async socketAuthentication(socketId, event) {
        const requestUser = await this.playersService.getUserBySocketId(socketId);
        if (!requestUser) {
            throw new ws_exception_filter_1.SocketException('로그인이 필요한 서비스입니다.', 403, event);
        }
        return requestUser;
    }
    async handleLeaveRoomRequest(socket, requestUser) {
        await this.RemovePlayerFromRoom(requestUser.player.roomInfo, requestUser, socket);
        const room = await this.roomService.getOneRoomByRoomId(requestUser.player.roomInfo);
        if (room.isGameOn) {
            const allTurns = await this.gamesService.getAllTurnsByRoomId(room.roomId);
            if (allTurns.length &&
                (allTurns.at(-1).currentEvent === 'readyTime' ||
                    allTurns.at(-1).currentEvent === 'speechTime')) {
                if (allTurns.at(-1).speechPlayer === requestUser.userInfo) {
                    await this.handleSpeechPlayerLeaveRoomRequest(allTurns.at(-1), socket, common_1.Next);
                    if (room.players.length === allTurns.length || room.players.length < 2) {
                        return await this.handleEndGameByPlayerLeaveEvent(room, common_1.Next);
                    }
                    await this.controlGameTurns(room, common_1.Next);
                }
                if (room.players.length === allTurns.length || room.players.length < 2) {
                    return await this.handleEndGameByPlayerLeaveEvent(room, common_1.Next);
                }
            }
        }
        const updateRoom = await this.updateRoom(requestUser.player.roomInfo);
        await this.announceUpdateRoomInfo(updateRoom, requestUser, 'leave');
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
    async updateRoom(roomId) {
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
        if (event === 'game-end') {
            console.log('game-end announcement');
        }
        if (roomUpdate.state === 'updated') {
            console.log('update state');
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
    async controlGameTurns(room, next) {
        let turn = await this.gamesService.createTurn(room.roomId);
        let turnCount = room.turns.length - 1;
        while (turnCount < room.players.length) {
            await this.controlTurnTimer(room, 'readyTime', turn);
            await this.controlTurnTimer(room, 'speechTime', turn);
            room = await this.roomService.getOneRoomByRoomId(room.roomId);
            if (!room) {
                throw new ws_exception_filter_1.SocketException('방이 존재하지 않습니다.', 500, 'start');
            }
            let nextTurn = turn;
            if (turn.turn < room.players.length) {
                nextTurn = await this.gamesService.createTurn(room.roomId);
            }
            await this.controlTurnTimer(room, 'discussionTime', turn, nextTurn);
            room = await this.roomService.getOneRoomByRoomId(room.roomId);
            if (!room) {
                throw new ws_exception_filter_1.SocketException('방이 존재하지 않습니다.', 500, 'start');
            }
            turn = nextTurn;
            turnCount++;
        }
    }
    async controlTurnTimer(room, eventName, turn, nextTurn) {
        room = await this.roomService.getOneRoomByRoomId(room.roomId);
        if (!room) {
            throw new ws_exception_filter_1.SocketException('방이 존재하지 않습니다.', 500, 'start');
        }
        const roomId = room.roomId;
        const timer = eventName === 'startCount' ? 10000 : room[eventName];
        const event = eventName === 'startCount' ? eventName : `${eventName}r`;
        if (event != 'startCount')
            turn = await this.gamesService.updateTurn(turn, eventName);
        if (event === 'readyTimer') {
            this.emitGameInfo(turn, roomId);
        }
        let currentTurn = 1;
        if (turn)
            currentTurn = turn.turn;
        this.emitTimeStartEvent(roomId, currentTurn, timer, event);
        await this.createTimer(timer, roomId);
        this.emitTimeEndEvent(roomId, timer, event, turn, nextTurn);
        if (event === 'discussionTimer') {
            await this.emitSpeechPlayerScoreEvent(roomId, turn);
            if (!nextTurn.turn) {
                room = await this.gamesService.handleGameEndEvent(room);
                this.announceUpdateRoomInfo({ room, state: 'update' }, null, 'game-end');
            }
        }
    }
    async handleSpeechPlayerLeaveRoomRequest(turn, socket, next) {
        try {
            game_timer_map_1.gameTimerMap[turn.roomInfo].ac.abort();
        }
        catch (err) {
            next();
        }
        socket.to(`${turn.roomInfo}`).emit('error', {
            error: {
                errorMessage: '발표자가 나갔어요!',
                status: 400,
                event: 'leave-game',
            },
        });
        await this.gamesService.deleteTurnByTurnId(turn);
    }
    async handleEndGameByPlayerLeaveEvent(room, next) {
        try {
            game_timer_map_1.gameTimerMap[room.roomId].ac.abort();
        }
        catch (err) {
            next();
        }
        room = await this.gamesService.handleGameEndEvent(room);
        return this.announceUpdateRoomInfo({ room, state: 'updated' }, null, 'game-end');
    }
    async createTimer(time, roomId) {
        const ac = new AbortController();
        game_timer_map_1.gameTimerMap[roomId] = {
            ac,
        };
        game_timer_map_1.gameTimerMap[roomId].ac;
        game_timer_map_1.gameTimerMap[roomId].timer = await (0, promises_1.setTimeout)(time, 'timer-end', {
            signal: game_timer_map_1.gameTimerMap[roomId].ac.signal,
        });
        return game_timer_map_1.gameTimerMap[roomId].timer;
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
    emitTimeStartEvent(roomId, currentTurn, timer, event) {
        this.server.to(`${roomId}`).emit('time-start', {
            data: {
                currentTurn,
                timer,
                event,
            },
        });
    }
    async emitSpeechPlayerScoreEvent(roomId, turn) {
        const turnResult = await this.gamesService.recordSpeechPlayerScore(roomId, turn.turn, turn.keyword, turn.speechPlayer, turn.speechPlayerNickname);
        this.server
            .to(`${roomId}`)
            .emit('score', { data: { userId: turn.speechPlayer, score: turnResult.score } });
    }
    emitTimeEndEvent(roomId, timer, event, turn, nextTurn) {
        let key = 'currentTurn';
        if (event === 'discussionTimer') {
            key = 'nextTurn';
            if (turn === nextTurn) {
                nextTurn.turn = 0;
            }
        }
        let currentTurn = 1;
        if (turn)
            currentTurn = turn.turn;
        const data = {
            [key]: key === 'currentTurn' ? currentTurn : nextTurn.turn,
            timer,
            event,
        };
        this.server.to(`${roomId}`).emit('time-end', { data });
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
    __metadata("design:paramtypes", [socket_io_1.Socket, Function]),
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
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        players_service_1.PlayersService,
        chat_service_1.ChatService,
        games_service_1.GamesService])
], GamesGateway);
exports.GamesGateway = GamesGateway;
//# sourceMappingURL=games.gateway.js.map