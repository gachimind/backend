"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 21:
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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamesGateway = void 0;
const websockets_1 = __webpack_require__(22);
const socket_io_1 = __webpack_require__(23);
const common_1 = __webpack_require__(8);
const room_service_1 = __webpack_require__(24);
const chat_service_1 = __webpack_require__(25);
const ws_exception_filter_1 = __webpack_require__(26);
const inGame_users_service_1 = __webpack_require__(28);
let GamesGateway = class GamesGateway {
    constructor(roomService, chatService, inGameUsersService) {
        this.roomService = roomService;
        this.chatService = chatService;
        this.inGameUsersService = inGameUsersService;
    }
    afterInit(server) {
        console.log('webSocketServer init');
    }
    handleConnection(socket) {
        console.log('connected socket', socket.id);
        throw new ws_exception_filter_1.SocketException('exception test', 400, 'error');
        const data = this.roomService.getAllRoomList();
        socket.emit('room-list', { data });
    }
    handleDisconnect(socket) {
        this.inGameUsersService.handleDisconnect(socket);
        console.log('disconnected socket', socket.id);
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
    __metadata("design:returntype", Object)
], GamesGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object]),
    __metadata("design:returntype", Object)
], GamesGateway.prototype, "handleDisconnect", null);
GamesGateway = __decorate([
    (0, common_1.UseFilters)(new common_1.WsExceptionFilter()),
    (0, websockets_1.WebSocketGateway)({
        transports: ['websocket'],
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof room_service_1.RoomService !== "undefined" && room_service_1.RoomService) === "function" ? _a : Object, typeof (_b = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _b : Object, typeof (_c = typeof inGame_users_service_1.InGameUsersService !== "undefined" && inGame_users_service_1.InGameUsersService) === "function" ? _c : Object])
], GamesGateway);
exports.GamesGateway = GamesGateway;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("e69dc3c01cae545027cb")
/******/ })();
/******/ 
/******/ }
;