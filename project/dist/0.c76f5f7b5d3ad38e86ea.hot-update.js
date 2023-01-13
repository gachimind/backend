"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 32:
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayersService = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(15);
const ws_exception_filter_1 = __webpack_require__(29);
const token_map_entity_1 = __webpack_require__(17);
const socketIdMap_entity_1 = __webpack_require__(33);
const player_entity_1 = __webpack_require__(35);
let PlayersService = class PlayersService {
    constructor(tokenMapRepository, socketIdMapRepository, playerRepository) {
        this.tokenMapRepository = tokenMapRepository;
        this.socketIdMapRepository = socketIdMapRepository;
        this.playerRepository = playerRepository;
    }
    async getUserBySocketId(socketId) {
        return await this.socketIdMapRepository.findOneBy(socketId);
    }
    async getUserIdBySocketId(socketId) {
        const user = await this.socketIdMapRepository.findOneBy(socketId);
        return user ? user.userId : null;
    }
    async getCurrentRoomBySocketId(socketId) {
        const user = await this.socketIdMapRepository.findOneBy(socketId);
        return user ? user.currentRoom : null;
    }
    async removeSocketBySocketId(socketId) {
        return await this.socketIdMapRepository.remove(socketId);
    }
    async socketIdMapToLoginUser(token, socketId) {
        const requestUser = await this.tokenMapRepository.findOneOrFail({
            where: { token },
            select: { userId: true },
        });
        const userId = requestUser.userId;
        if (!requestUser.userId) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 401, 'log-in');
        }
        if (await this.getUserIdBySocketId({ socketId })) {
            throw new ws_exception_filter_1.SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
        }
        if (await this.socketIdMapRepository.findOneBy({ userId })) {
            console.log('중복 로그인!!');
            throw new ws_exception_filter_1.SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
        }
        const user = { socketId, userId, currentRoom: null };
        return await this.socketIdMapRepository.insert(user);
    }
    handleLeaveRoom(socketId) { }
};
PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __param(1, (0, typeorm_1.InjectRepository)(socketIdMap_entity_1.SocketIdMap)),
    __param(2, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], PlayersService);
exports.PlayersService = PlayersService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("1a438821df63854d7b0a")
/******/ })();
/******/ 
/******/ }
;