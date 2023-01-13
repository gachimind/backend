"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 25:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamesGateway = void 0;
const websockets_1 = __webpack_require__(26);
const socket_io_1 = __webpack_require__(27);
const room_service_1 = __webpack_require__(28);
const chat_service_1 = __webpack_require__(31);
const ws_exception_filter_1 = __webpack_require__(29);
const players_service_1 = __webpack_require__(32);
let GamesGateway = class GamesGateway {
    constructor(roomService, chatService, playersService) {
        this.roomService = roomService;
        this.chatService = chatService;
        this.playersService = playersService;
    }
    getToken(token) {
        if (!token) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 401, 'log-in');
        }
        return token;
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
        await this.playersService.removeSocketBySocketId({ socketId: socket.id });
        console.log('disconnected socket', socket.id);
    }
    async socketIdMapToLoginUser(socket, { data }) {
        const token = this.getToken(data.authorization);
        await this.playersService.socketIdMapToLoginUser(token, socket.id);
        console.log('로그인 성공!');
        socket.emit('log-in', { message: '로그인 성공!' });
    }
    async socketIdMapToLogOutUser(socket) {
        const requestUser = await this.playersService.getUserBySocketId({
            socketId: socket.id,
        });
        if (!requestUser) {
            throw new ws_exception_filter_1.SocketException('로그인이 필요한 서비스입니다.', 403, 'leave-room');
        }
        await this.playersService.removeSocketBySocketId({ socketId: socket.id });
        console.log('로그아웃 성공!');
        socket.emit('log-out', { message: '로그아웃 성공!' });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_d = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _d : Object)
], GamesGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('log-in'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "socketIdMapToLoginUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('log-out'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "socketIdMapToLogOutUser", null);
GamesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof room_service_1.RoomService !== "undefined" && room_service_1.RoomService) === "function" ? _a : Object, typeof (_b = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _b : Object, typeof (_c = typeof players_service_1.PlayersService !== "undefined" && players_service_1.PlayersService) === "function" ? _c : Object])
], GamesGateway);
exports.GamesGateway = GamesGateway;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("c491b5422f9a61ff03ed")
/******/ })();
/******/ 
/******/ }
;