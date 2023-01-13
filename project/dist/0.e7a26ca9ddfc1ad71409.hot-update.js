exports.id = 0;
exports.ids = null;
exports.modules = [
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const users_controller_1 = __webpack_require__(10);
const users_service_1 = __webpack_require__(14);
const kakao_serializer_1 = __webpack_require__(20);
const user_entity_1 = __webpack_require__(42);
const kakao_guards_1 = __webpack_require__(18);
const kakao_strategy_1 = __webpack_require__(21);
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
        controllers: [users_controller_1.UsersController],
        providers: [
            users_service_1.UsersService,
            kakao_serializer_1.SessionSerializer,
            kakao_guards_1.KakaoAuthGuard,
            kakao_strategy_1.KakaoStrategy,
            {
                provide: 'USER_SERVICE',
                useClass: users_service_1.UsersService,
            },
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], UsersModule);
exports.UsersModule = UsersModule;


/***/ }),
/* 9 */,
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(7);
const undefinedToNull_interceptor_1 = __webpack_require__(11);
const common_2 = __webpack_require__(7);
const resultToData_interceptor_1 = __webpack_require__(13);
const users_service_1 = __webpack_require__(14);
const express_1 = __webpack_require__(17);
const kakao_guards_1 = __webpack_require__(18);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    handleLogin() {
        return { msg: 'Kakao-Talk Authentication' };
    }
    handleRedirect(code) {
        return { msg: 'OK' };
    }
    user(request) {
        if (!request.user)
            throw new common_2.HttpException('토큰값이 일치하지 않습니다.', 401);
        return { message: '토큰 인증이 완료되었습니다.', status: 202 };
    }
    async kakaoLogin(req, res) {
        const { accessToken, refreshToken } = await this.usersService.kakaoLogin(req.headers.authorization);
        res.cookie('accessToken', accessToken);
        res.cookie('refreshToken', refreshToken);
    }
    getUserDetailsByUserId(userId) {
        return this.usersService.getUserDetailsByUserId(userId);
    }
};
__decorate([
    (0, common_1.Get)('login/kakao'),
    (0, common_1.UseGuards)(kakao_guards_1.KakaoAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "handleLogin", null);
__decorate([
    (0, common_1.Get)('login/kakao/redirect'),
    (0, common_1.UseGuards)(kakao_guards_1.KakaoAuthGuard),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "handleRedirect", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "user", null);
__decorate([
    (0, common_1.Post)('login/kakao'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "kakaoLogin", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserDetailsByUserId", null);
UsersController = __decorate([
    (0, common_1.UseInterceptors)(undefinedToNull_interceptor_1.UndefinedToNullInterceptor, resultToData_interceptor_1.ResultToDataInterceptor),
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);
exports.UsersController = UsersController;


/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const common_2 = __webpack_require__(7);
const typeorm_2 = __webpack_require__(15);
const user_entity_1 = __webpack_require__(42);
const jwt_1 = __webpack_require__(43);
const axios_1 = __webpack_require__(52);
const bcrypt = __webpack_require__(53);
let UsersService = class UsersService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async validateUser(details) {
        const user = await this.usersRepository.findOneBy({
            email: details.email,
        });
        if (user)
            return user;
        const newUser = this.usersRepository.create(details);
        return this.usersRepository.save(newUser);
    }
    async findUserById(userId) {
        const user = await this.usersRepository.findOneBy({ userId });
        return user;
    }
    async kakaoLogin(authorization) {
        if (!authorization)
            throw new common_2.HttpException('토큰 정보가 없습니다.', 401);
        const kakaoAccessToken = authorization;
        const { data: kakaoUser } = await (0, axios_1.default)('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `${kakaoAccessToken}`,
            },
        });
        console.log('카카오에서 받아온 유저 정보 >>>> ', kakaoUser);
        const userId = kakaoUser.profile._json.id;
        const profileImg = kakaoUser.properties.profile_image;
        const nickname = kakaoUser.properties.nickname;
        const email = kakaoUser.kakao_account.email;
        const exUser = await this.usersRepository.findOne({
            where: { userId },
        });
        if (!exUser) {
            const newUser = await this.usersRepository.save({
                userId,
                nickname,
                profileImg,
                email,
            });
            console.log(newUser, '<================================저장한 값');
            console.log('회원정보 저장 후 토큰발급');
            const accessToken = await this.makeAccessToken(newUser.userId);
            const refreshToken = await this.makeAccessToken(newUser.userId);
            await this.CurrnetRefreshToken(refreshToken, newUser.userId);
            return { accessToken, refreshToken };
        }
        else {
            const { userId } = exUser;
            console.log('로그인 토큰발급');
            const accessToken = await this.makeAccessToken(exUser.userId);
            const refreshToken = await this.makeAccessToken(exUser.userId);
            await this.CurrnetRefreshToken(refreshToken, userId);
            return { accessToken, refreshToken };
        }
    }
    async makeAccessToken(email) {
        const payload = { email };
        const accessToken = await this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '60m',
        });
        return accessToken;
    }
    async makeRefreshToken(email) {
        const payload = { email };
        const refreshToken = await this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '15d',
        });
        return refreshToken;
    }
    async CurrnetRefreshToken(refreshToken, userId) {
        const salt = await bcrypt.genSalt();
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        await this.usersRepository.update(userId, { currentHashedRefreshToken });
    }
    async getUserDetailsByUserId(userId) {
        const user = await this.usersRepository.findOne({
            select: { userId: true, email: true, nickname: true, profileImg: true },
            where: { userId },
        });
        if (!user) {
            throw new common_2.HttpException('회원 인증에 실패했습니다.', 402);
        }
        return user;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], UsersService);
exports.UsersService = UsersService;


/***/ }),
/* 15 */,
/* 16 */
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/ts-loader/index.js):\nError: ENOENT: no such file or directory, open 'C:\\Users\\DOYOUNG PYEON\\Desktop\\CODING\\01_projects\\projects_gachimind\\backend\\project\\src\\users\\entities\\user.entity.ts'");

/***/ }),
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SessionSerializer = void 0;
const common_1 = __webpack_require__(7);
const passport_1 = __webpack_require__(19);
const users_service_1 = __webpack_require__(14);
let SessionSerializer = class SessionSerializer extends passport_1.PassportSerializer {
    constructor(usersService) {
        super();
        this.usersService = usersService;
    }
    serializeUser(user, done) {
        done(null, user);
    }
    async deserializeUser(payload, done) {
        const user = await this.usersService.findUserById(payload.userId);
        return user ? done(null, user) : done(null, null);
    }
};
SessionSerializer = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], SessionSerializer);
exports.SessionSerializer = SessionSerializer;


/***/ }),
/* 21 */,
/* 22 */,
/* 23 */
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/ts-loader/index.js):\nError: ENOENT: no such file or directory, open 'C:\\Users\\DOYOUNG PYEON\\Desktop\\CODING\\01_projects\\projects_gachimind\\backend\\project\\src\\users\\entities\\token-map.entity.ts'");

/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamesModule = void 0;
const common_1 = __webpack_require__(7);
const games_gateway_1 = __webpack_require__(25);
const room_service_1 = __webpack_require__(28);
const chat_service_1 = __webpack_require__(31);
const users_module_1 = __webpack_require__(8);
const inGame_users_service_1 = __webpack_require__(174);
let GamesModule = class GamesModule {
};
GamesModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule],
        providers: [games_gateway_1.GamesGateway, room_service_1.RoomService, chat_service_1.ChatService, inGame_users_service_1.InGameUsersService],
        exports: [games_gateway_1.GamesGateway],
    })
], GamesModule);
exports.GamesModule = GamesModule;


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamesGateway = void 0;
const websockets_1 = __webpack_require__(26);
const socket_io_1 = __webpack_require__(27);
const room_service_1 = __webpack_require__(28);
const chat_service_1 = __webpack_require__(31);
const ws_exception_filter_1 = __webpack_require__(29);
const inGame_users_service_1 = __webpack_require__(174);
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
__decorate([
    (0, websockets_1.SubscribeMessage)('create-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _j : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleCreateRoomRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('enter-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _k : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleEnterRoomRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleLeaveRoomEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _m : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "sendChatRequest", null);
GamesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof room_service_1.RoomService !== "undefined" && room_service_1.RoomService) === "function" ? _a : Object, typeof (_b = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _b : Object, typeof (_c = typeof inGame_users_service_1.InGameUsersService !== "undefined" && inGame_users_service_1.InGameUsersService) === "function" ? _c : Object])
], GamesGateway);
exports.GamesGateway = GamesGateway;


/***/ }),
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/ts-loader/index.js):\nError: ENOENT: no such file or directory, open 'C:\\Users\\DOYOUNG PYEON\\Desktop\\CODING\\01_projects\\projects_gachimind\\backend\\project\\src\\games\\entities\\room.entity.ts'");

/***/ }),
/* 34 */
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/ts-loader/index.js):\nError: ENOENT: no such file or directory, open 'C:\\Users\\DOYOUNG PYEON\\Desktop\\CODING\\01_projects\\projects_gachimind\\backend\\project\\src\\games\\entities\\player.entity.ts'");

/***/ }),
/* 35 */
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/ts-loader/index.js):\nError: ENOENT: no such file or directory, open 'C:\\Users\\DOYOUNG PYEON\\Desktop\\CODING\\01_projects\\projects_gachimind\\backend\\project\\src\\games\\entities\\socketIdMap.entity.ts'");

/***/ }),
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const typeorm_1 = __webpack_require__(15);
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], User.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { unique: true, length: 50 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], User.prototype, "profileImg", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "currentHashedRefreshToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], User.prototype, "deletedAt", void 0);
User = __decorate([
    (0, typeorm_1.Entity)({ name: 'User' })
], User);
exports.User = User;


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(__webpack_require__(44));


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(45), exports);
__exportStar(__webpack_require__(47), exports);
__exportStar(__webpack_require__(50), exports);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(46), exports);


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtSecretRequestType = void 0;
var JwtSecretRequestType;
(function (JwtSecretRequestType) {
    JwtSecretRequestType[JwtSecretRequestType["SIGN"] = 0] = "SIGN";
    JwtSecretRequestType[JwtSecretRequestType["VERIFY"] = 1] = "VERIFY";
})(JwtSecretRequestType = exports.JwtSecretRequestType || (exports.JwtSecretRequestType = {}));


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var JwtModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtModule = void 0;
const common_1 = __webpack_require__(7);
const jwt_constants_1 = __webpack_require__(48);
const jwt_providers_1 = __webpack_require__(49);
const jwt_service_1 = __webpack_require__(50);
let JwtModule = JwtModule_1 = class JwtModule {
    static register(options) {
        return {
            module: JwtModule_1,
            providers: (0, jwt_providers_1.createJwtProvider)(options)
        };
    }
    static registerAsync(options) {
        return {
            module: JwtModule_1,
            imports: options.imports || [],
            providers: this.createAsyncProviders(options)
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass
            }
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: jwt_constants_1.JWT_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: jwt_constants_1.JWT_MODULE_OPTIONS,
            useFactory: (optionsFactory) => __awaiter(this, void 0, void 0, function* () { return yield optionsFactory.createJwtOptions(); }),
            inject: [options.useExisting || options.useClass]
        };
    }
};
JwtModule = JwtModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [jwt_service_1.JwtService],
        exports: [jwt_service_1.JwtService]
    })
], JwtModule);
exports.JwtModule = JwtModule;


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JWT_MODULE_OPTIONS = void 0;
exports.JWT_MODULE_OPTIONS = 'JWT_MODULE_OPTIONS';


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createJwtProvider = void 0;
const jwt_constants_1 = __webpack_require__(48);
function createJwtProvider(options) {
    return [{ provide: jwt_constants_1.JWT_MODULE_OPTIONS, useValue: options || {} }];
}
exports.createJwtProvider = createJwtProvider;


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtService = void 0;
const common_1 = __webpack_require__(7);
const jwt = __webpack_require__(51);
const interfaces_1 = __webpack_require__(45);
const jwt_constants_1 = __webpack_require__(48);
let JwtService = class JwtService {
    constructor(options = {}) {
        this.options = options;
        this.logger = new common_1.Logger('JwtService');
    }
    sign(payload, options) {
        const signOptions = this.mergeJwtOptions(Object.assign({}, options), 'signOptions');
        const secret = this.getSecretKey(payload, options, 'privateKey', interfaces_1.JwtSecretRequestType.SIGN);
        return jwt.sign(payload, secret, signOptions);
    }
    signAsync(payload, options) {
        const signOptions = this.mergeJwtOptions(Object.assign({}, options), 'signOptions');
        const secret = this.getSecretKey(payload, options, 'privateKey', interfaces_1.JwtSecretRequestType.SIGN);
        return new Promise((resolve, reject) => jwt.sign(payload, secret, signOptions, (err, encoded) => err ? reject(err) : resolve(encoded)));
    }
    verify(token, options) {
        const verifyOptions = this.mergeJwtOptions(Object.assign({}, options), 'verifyOptions');
        const secret = this.getSecretKey(token, options, 'publicKey', interfaces_1.JwtSecretRequestType.VERIFY);
        return jwt.verify(token, secret, verifyOptions);
    }
    verifyAsync(token, options) {
        const verifyOptions = this.mergeJwtOptions(Object.assign({}, options), 'verifyOptions');
        const secret = this.getSecretKey(token, options, 'publicKey', interfaces_1.JwtSecretRequestType.VERIFY);
        return new Promise((resolve, reject) => jwt.verify(token, secret, verifyOptions, (err, decoded) => err ? reject(err) : resolve(decoded)));
    }
    decode(token, options) {
        return jwt.decode(token, options);
    }
    mergeJwtOptions(options, key) {
        delete options.secret;
        if (key === 'signOptions') {
            delete options.privateKey;
        }
        else {
            delete options.publicKey;
        }
        return options
            ? Object.assign(Object.assign({}, (this.options[key] || {})), options) : this.options[key];
    }
    getSecretKey(token, options, key, secretRequestType) {
        var _a, _b;
        let secret = this.options.secretOrKeyProvider
            ? this.options.secretOrKeyProvider(secretRequestType, token, options)
            : (options === null || options === void 0 ? void 0 : options.secret) ||
                this.options.secret ||
                (key === 'privateKey'
                    ? ((_a = options) === null || _a === void 0 ? void 0 : _a.privateKey) || this.options.privateKey
                    : ((_b = options) === null || _b === void 0 ? void 0 : _b.publicKey) ||
                        this.options.publicKey) ||
                this.options[key];
        if (this.options.secretOrPrivateKey) {
            this.logger.warn(`"secretOrPrivateKey" has been deprecated, please use the new explicit "secret" or use "secretOrKeyProvider" or "privateKey"/"publicKey" exclusively.`);
            secret = this.options.secretOrPrivateKey;
        }
        return secret;
    }
};
JwtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(jwt_constants_1.JWT_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], JwtService);
exports.JwtService = JwtService;


/***/ }),
/* 51 */
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),
/* 52 */
/***/ ((module) => {

"use strict";
module.exports = require("axios");

/***/ }),
/* 53 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var nodePreGyp = __webpack_require__(54);
var path = __webpack_require__(58);
var binding_path = nodePreGyp.find(path.resolve(path.join(__dirname, './package.json')));
var bindings = __webpack_require__(172)(binding_path);

var crypto = __webpack_require__(157);

var promises = __webpack_require__(173);

/// generate a salt (sync)
/// @param {Number} [rounds] number of rounds (default 10)
/// @return {String} salt
module.exports.genSaltSync = function genSaltSync(rounds, minor) {
    // default 10 rounds
    if (!rounds) {
        rounds = 10;
    } else if (typeof rounds !== 'number') {
        throw new Error('rounds must be a number');
    }

    if(!minor) {
        minor = 'b';
    } else if(minor !== 'b' && minor !== 'a') {
        throw new Error('minor must be either "a" or "b"');
    }

    return bindings.gen_salt_sync(minor, rounds, crypto.randomBytes(16));
};

/// generate a salt
/// @param {Number} [rounds] number of rounds (default 10)
/// @param {Function} cb callback(err, salt)
module.exports.genSalt = function genSalt(rounds, minor, cb) {
    var error;

    // if callback is first argument, then use defaults for others
    if (typeof arguments[0] === 'function') {
        // have to set callback first otherwise arguments are overriden
        cb = arguments[0];
        rounds = 10;
        minor = 'b';
    // callback is second argument
    } else if (typeof arguments[1] === 'function') {
        // have to set callback first otherwise arguments are overriden
        cb = arguments[1];
        minor = 'b';
    }

    if (!cb) {
        return promises.promise(genSalt, this, [rounds, minor]);
    }

    // default 10 rounds
    if (!rounds) {
        rounds = 10;
    } else if (typeof rounds !== 'number') {
        // callback error asynchronously
        error = new Error('rounds must be a number');
        return process.nextTick(function() {
            cb(error);
        });
    }

    if(!minor) {
        minor = 'b'
    } else if(minor !== 'b' && minor !== 'a') {
        error = new Error('minor must be either "a" or "b"');
        return process.nextTick(function() {
            cb(error);
        });
    }

    crypto.randomBytes(16, function(error, randomBytes) {
        if (error) {
            cb(error);
            return;
        }

        bindings.gen_salt(minor, rounds, randomBytes, cb);
    });
};

/// hash data using a salt
/// @param {String|Buffer} data the data to encrypt
/// @param {String} salt the salt to use when hashing
/// @return {String} hash
module.exports.hashSync = function hashSync(data, salt) {
    if (data == null || salt == null) {
        throw new Error('data and salt arguments required');
    }

    if (!(typeof data === 'string' || data instanceof Buffer) || (typeof salt !== 'string' && typeof salt !== 'number')) {
        throw new Error('data must be a string or Buffer and salt must either be a salt string or a number of rounds');
    }

    if (typeof salt === 'number') {
        salt = module.exports.genSaltSync(salt);
    }

    return bindings.encrypt_sync(data, salt);
};

/// hash data using a salt
/// @param {String|Buffer} data the data to encrypt
/// @param {String} salt the salt to use when hashing
/// @param {Function} cb callback(err, hash)
module.exports.hash = function hash(data, salt, cb) {
    var error;

    if (typeof data === 'function') {
        error = new Error('data must be a string or Buffer and salt must either be a salt string or a number of rounds');
        return process.nextTick(function() {
            data(error);
        });
    }

    if (typeof salt === 'function') {
        error = new Error('data must be a string or Buffer and salt must either be a salt string or a number of rounds');
        return process.nextTick(function() {
            salt(error);
        });
    }

    // cb exists but is not a function
    // return a rejecting promise
    if (cb && typeof cb !== 'function') {
        return promises.reject(new Error('cb must be a function or null to return a Promise'));
    }

    if (!cb) {
        return promises.promise(hash, this, [data, salt]);
    }

    if (data == null || salt == null) {
        error = new Error('data and salt arguments required');
        return process.nextTick(function() {
            cb(error);
        });
    }

    if (!(typeof data === 'string' || data instanceof Buffer) || (typeof salt !== 'string' && typeof salt !== 'number')) {
        error = new Error('data must be a string or Buffer and salt must either be a salt string or a number of rounds');
        return process.nextTick(function() {
            cb(error);
        });
    }


    if (typeof salt === 'number') {
        return module.exports.genSalt(salt, function(err, salt) {
            return bindings.encrypt(data, salt, cb);
        });
    }

    return bindings.encrypt(data, salt, cb);
};

/// compare raw data to hash
/// @param {String|Buffer} data the data to hash and compare
/// @param {String} hash expected hash
/// @return {bool} true if hashed data matches hash
module.exports.compareSync = function compareSync(data, hash) {
    if (data == null || hash == null) {
        throw new Error('data and hash arguments required');
    }

    if (!(typeof data === 'string' || data instanceof Buffer) || typeof hash !== 'string') {
        throw new Error('data must be a string or Buffer and hash must be a string');
    }

    return bindings.compare_sync(data, hash);
};

/// compare raw data to hash
/// @param {String|Buffer} data the data to hash and compare
/// @param {String} hash expected hash
/// @param {Function} cb callback(err, matched) - matched is true if hashed data matches hash
module.exports.compare = function compare(data, hash, cb) {
    var error;

    if (typeof data === 'function') {
        error = new Error('data and hash arguments required');
        return process.nextTick(function() {
            data(error);
        });
    }

    if (typeof hash === 'function') {
        error = new Error('data and hash arguments required');
        return process.nextTick(function() {
            hash(error);
        });
    }

    // cb exists but is not a function
    // return a rejecting promise
    if (cb && typeof cb !== 'function') {
        return promises.reject(new Error('cb must be a function or null to return a Promise'));
    }

    if (!cb) {
        return promises.promise(compare, this, [data, hash]);
    }

    if (data == null || hash == null) {
        error = new Error('data and hash arguments required');
        return process.nextTick(function() {
            cb(error);
        });
    }

    if (!(typeof data === 'string' || data instanceof Buffer) || typeof hash !== 'string') {
        error = new Error('data and hash must be strings');
        return process.nextTick(function() {
            cb(error);
        });
    }

    return bindings.compare(data, hash, cb);
};

/// @param {String} hash extract rounds from this hash
/// @return {Number} the number of rounds used to encrypt a given hash
module.exports.getRounds = function getRounds(hash) {
    if (hash == null) {
        throw new Error('hash argument required');
    }

    if (typeof hash !== 'string') {
        throw new Error('hash must be a string');
    }

    return bindings.get_rounds(hash);
};


/***/ }),
/* 54 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


/**
 * Module exports.
 */

module.exports = exports;

/**
 * Module dependencies.
 */

// load mocking control function for accessing s3 via https. the function is a noop always returning
// false if not mocking.
exports.mockS3Http = (__webpack_require__(55).get_mockS3Http)();
exports.mockS3Http('on');
const mocking = exports.mockS3Http('get');


const fs = __webpack_require__(57);
const path = __webpack_require__(58);
const nopt = __webpack_require__(60);
const log = __webpack_require__(63);
log.disableProgress();
const napi = __webpack_require__(98);

const EE = (__webpack_require__(68).EventEmitter);
const inherits = (__webpack_require__(66).inherits);
const cli_commands = [
  'clean',
  'install',
  'reinstall',
  'build',
  'rebuild',
  'package',
  'testpackage',
  'publish',
  'unpublish',
  'info',
  'testbinary',
  'reveal',
  'configure'
];
const aliases = {};

// differentiate node-pre-gyp's logs from npm's
log.heading = 'node-pre-gyp';

if (mocking) {
  log.warn(`mocking s3 to ${process.env.node_pre_gyp_mock_s3}`);
}

// this is a getter to avoid circular reference warnings with node v14.
Object.defineProperty(exports, "find", ({
  get: function() {
    return (__webpack_require__(100).find);
  },
  enumerable: true
}));

// in the following, "my_module" is using node-pre-gyp to
// prebuild and install pre-built binaries. "main_module"
// is using "my_module".
//
// "bin/node-pre-gyp" invokes Run() without a path. the
// expectation is that the working directory is the package
// root "my_module". this is true because in all cases npm is
// executing a script in the context of "my_module".
//
// "pre-binding.find()" is executed by "my_module" but in the
// context of "main_module". this is because "main_module" is
// executing and requires "my_module" which is then executing
// "pre-binding.find()" via "node-pre-gyp.find()", so the working
// directory is that of "main_module".
//
// that's why "find()" must pass the path to package.json.
//
function Run({ package_json_path = './package.json', argv }) {
  this.package_json_path = package_json_path;
  this.commands = {};

  const self = this;
  cli_commands.forEach((command) => {
    self.commands[command] = function(argvx, callback) {
      log.verbose('command', command, argvx);
      return __webpack_require__(108)("./" + command)(self, argvx, callback);
    };
  });

  this.parseArgv(argv);

  // this is set to true after the binary.host property was set to
  // either staging_host or production_host.
  this.binaryHostSet = false;
}
inherits(Run, EE);
exports.Run = Run;
const proto = Run.prototype;

/**
 * Export the contents of the package.json.
 */

proto.package = __webpack_require__(171);

/**
 * nopt configuration definitions
 */

proto.configDefs = {
  help: Boolean,     // everywhere
  arch: String,      // 'configure'
  debug: Boolean,    // 'build'
  directory: String, // bin
  proxy: String,     // 'install'
  loglevel: String  // everywhere
};

/**
 * nopt shorthands
 */

proto.shorthands = {
  release: '--no-debug',
  C: '--directory',
  debug: '--debug',
  j: '--jobs',
  silent: '--loglevel=silent',
  silly: '--loglevel=silly',
  verbose: '--loglevel=verbose'
};

/**
 * expose the command aliases for the bin file to use.
 */

proto.aliases = aliases;

/**
 * Parses the given argv array and sets the 'opts', 'argv',
 * 'command', and 'package_json' properties.
 */

proto.parseArgv = function parseOpts(argv) {
  this.opts = nopt(this.configDefs, this.shorthands, argv);
  this.argv = this.opts.argv.remain.slice();
  const commands = this.todo = [];

  // create a copy of the argv array with aliases mapped
  argv = this.argv.map((arg) => {
    // is this an alias?
    if (arg in this.aliases) {
      arg = this.aliases[arg];
    }
    return arg;
  });

  // process the mapped args into "command" objects ("name" and "args" props)
  argv.slice().forEach((arg) => {
    if (arg in this.commands) {
      const args = argv.splice(0, argv.indexOf(arg));
      argv.shift();
      if (commands.length > 0) {
        commands[commands.length - 1].args = args;
      }
      commands.push({ name: arg, args: [] });
    }
  });
  if (commands.length > 0) {
    commands[commands.length - 1].args = argv.splice(0);
  }


  // if a directory was specified package.json is assumed to be relative
  // to it.
  let package_json_path = this.package_json_path;
  if (this.opts.directory) {
    package_json_path = path.join(this.opts.directory, package_json_path);
  }

  this.package_json = JSON.parse(fs.readFileSync(package_json_path));

  // expand commands entries for multiple napi builds
  this.todo = napi.expand_commands(this.package_json, this.opts, commands);

  // support for inheriting config env variables from npm
  const npm_config_prefix = 'npm_config_';
  Object.keys(process.env).forEach((name) => {
    if (name.indexOf(npm_config_prefix) !== 0) return;
    const val = process.env[name];
    if (name === npm_config_prefix + 'loglevel') {
      log.level = val;
    } else {
      // add the user-defined options to the config
      name = name.substring(npm_config_prefix.length);
      // avoid npm argv clobber already present args
      // which avoids problem of 'npm test' calling
      // script that runs unique npm install commands
      if (name === 'argv') {
        if (this.opts.argv &&
             this.opts.argv.remain &&
             this.opts.argv.remain.length) {
          // do nothing
        } else {
          this.opts[name] = val;
        }
      } else {
        this.opts[name] = val;
      }
    }
  });

  if (this.opts.loglevel) {
    log.level = this.opts.loglevel;
  }
  log.resume();
};

/**
 * allow the binary.host property to be set at execution time.
 *
 * for this to take effect requires all the following to be true.
 * - binary is a property in package.json
 * - binary.host is falsey
 * - binary.staging_host is not empty
 * - binary.production_host is not empty
 *
 * if any of the previous checks fail then the function returns an empty string
 * and makes no changes to package.json's binary property.
 *
 *
 * if command is "publish" then the default is set to "binary.staging_host"
 * if command is not "publish" the the default is set to "binary.production_host"
 *
 * if the command-line option '--s3_host' is set to "staging" or "production" then
 * "binary.host" is set to the specified "staging_host" or "production_host". if
 * '--s3_host' is any other value an exception is thrown.
 *
 * if '--s3_host' is not present then "binary.host" is set to the default as above.
 *
 * this strategy was chosen so that any command other than "publish" or "unpublish" uses "production"
 * as the default without requiring any command-line options but that "publish" and "unpublish" require
 * '--s3_host production_host' to be specified in order to *really* publish (or unpublish). publishing
 * to staging can be done freely without worrying about disturbing any production releases.
 */
proto.setBinaryHostProperty = function(command) {
  if (this.binaryHostSet) {
    return this.package_json.binary.host;
  }
  const p = this.package_json;
  // don't set anything if host is present. it must be left blank to trigger this.
  if (!p || !p.binary || p.binary.host) {
    return '';
  }
  // and both staging and production must be present. errors will be reported later.
  if (!p.binary.staging_host || !p.binary.production_host) {
    return '';
  }
  let target = 'production_host';
  if (command === 'publish' || command === 'unpublish') {
    target = 'staging_host';
  }
  // the environment variable has priority over the default or the command line. if
  // either the env var or the command line option are invalid throw an error.
  const npg_s3_host = process.env.node_pre_gyp_s3_host;
  if (npg_s3_host === 'staging' || npg_s3_host === 'production') {
    target = `${npg_s3_host}_host`;
  } else if (this.opts['s3_host'] === 'staging' || this.opts['s3_host'] === 'production') {
    target = `${this.opts['s3_host']}_host`;
  } else if (this.opts['s3_host'] || npg_s3_host) {
    throw new Error(`invalid s3_host ${this.opts['s3_host'] || npg_s3_host}`);
  }

  p.binary.host = p.binary[target];
  this.binaryHostSet = true;

  return p.binary.host;
};

/**
 * Returns the usage instructions for node-pre-gyp.
 */

proto.usage = function usage() {
  const str = [
    '',
    '  Usage: node-pre-gyp <command> [options]',
    '',
    '  where <command> is one of:',
    cli_commands.map((c) => {
      return '    - ' + c + ' - ' + __webpack_require__(108)("./" + c).usage;
    }).join('\n'),
    '',
    'node-pre-gyp@' + this.version + '  ' + path.resolve(__dirname, '..'),
    'node@' + process.versions.node
  ].join('\n');
  return str;
};

/**
 * Version number getter.
 */

Object.defineProperty(proto, 'version', {
  get: function() {
    return this.package.version;
  },
  enumerable: true
});


/***/ }),
/* 55 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports;

const url = __webpack_require__(56);
const fs = __webpack_require__(57);
const path = __webpack_require__(58);

module.exports.detect = function(opts, config) {
  const to = opts.hosted_path;
  const uri = url.parse(to);
  config.prefix = (!uri.pathname || uri.pathname === '/') ? '' : uri.pathname.replace('/', '');
  if (opts.bucket && opts.region) {
    config.bucket = opts.bucket;
    config.region = opts.region;
    config.endpoint = opts.host;
    config.s3ForcePathStyle = opts.s3ForcePathStyle;
  } else {
    const parts = uri.hostname.split('.s3');
    const bucket = parts[0];
    if (!bucket) {
      return;
    }
    if (!config.bucket) {
      config.bucket = bucket;
    }
    if (!config.region) {
      const region = parts[1].slice(1).split('.')[0];
      if (region === 'amazonaws') {
        config.region = 'us-east-1';
      } else {
        config.region = region;
      }
    }
  }
};

module.exports.get_s3 = function(config) {

  if (process.env.node_pre_gyp_mock_s3) {
    // here we're mocking. node_pre_gyp_mock_s3 is the scratch directory
    // for the mock code.
    const AWSMock = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'mock-aws-s3'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    const os = __webpack_require__(59);

    AWSMock.config.basePath = `${os.tmpdir()}/mock`;

    const s3 = AWSMock.S3();

    // wrapped callback maker. fs calls return code of ENOENT but AWS.S3 returns
    // NotFound.
    const wcb = (fn) => (err, ...args) => {
      if (err && err.code === 'ENOENT') {
        err.code = 'NotFound';
      }
      return fn(err, ...args);
    };

    return {
      listObjects(params, callback) {
        return s3.listObjects(params, wcb(callback));
      },
      headObject(params, callback) {
        return s3.headObject(params, wcb(callback));
      },
      deleteObject(params, callback) {
        return s3.deleteObject(params, wcb(callback));
      },
      putObject(params, callback) {
        return s3.putObject(params, wcb(callback));
      }
    };
  }

  // if not mocking then setup real s3.
  const AWS = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'aws-sdk'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

  AWS.config.update(config);
  const s3 = new AWS.S3();

  // need to change if additional options need to be specified.
  return {
    listObjects(params, callback) {
      return s3.listObjects(params, callback);
    },
    headObject(params, callback) {
      return s3.headObject(params, callback);
    },
    deleteObject(params, callback) {
      return s3.deleteObject(params, callback);
    },
    putObject(params, callback) {
      return s3.putObject(params, callback);
    }
  };



};

//
// function to get the mocking control function. if not mocking it returns a no-op.
//
// if mocking it sets up the mock http interceptors that use the mocked s3 file system
// to fulfill reponses.
module.exports.get_mockS3Http = function() {
  let mock_s3 = false;
  if (!process.env.node_pre_gyp_mock_s3) {
    return () => mock_s3;
  }

  const nock = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'nock'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
  // the bucket used for testing, as addressed by https.
  const host = 'https://mapbox-node-pre-gyp-public-testing-bucket.s3.us-east-1.amazonaws.com';
  const mockDir = process.env.node_pre_gyp_mock_s3 + '/mapbox-node-pre-gyp-public-testing-bucket';

  // function to setup interceptors. they are "turned off" by setting mock_s3 to false.
  const mock_http = () => {
    // eslint-disable-next-line no-unused-vars
    function get(uri, requestBody) {
      const filepath = path.join(mockDir, uri.replace('%2B', '+'));

      try {
        fs.accessSync(filepath, fs.constants.R_OK);
      } catch (e) {
        return [404, 'not found\n'];
      }

      // the mock s3 functions just write to disk, so just read from it.
      return [200, fs.createReadStream(filepath)];
    }

    // eslint-disable-next-line no-unused-vars
    return nock(host)
      .persist()
      .get(() => mock_s3) // mock any uri for s3 when true
      .reply(get);
  };

  // setup interceptors. they check the mock_s3 flag to determine whether to intercept.
  mock_http(nock, host, mockDir);
  // function to turn matching all requests to s3 on/off.
  const mockS3Http = (action) => {
    const previous = mock_s3;
    if (action === 'off') {
      mock_s3 = false;
    } else if (action === 'on') {
      mock_s3 = true;
    } else if (action !== 'get') {
      throw new Error(`illegal action for setMockHttp ${action}`);
    }
    return previous;
  };

  // call mockS3Http with the argument
  // - 'on' - turn it on
  // - 'off' - turn it off (used by fetch.test.js so it doesn't interfere with redirects)
  // - 'get' - return true or false for 'on' or 'off'
  return mockS3Http;
};





/***/ }),
/* 56 */
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),
/* 57 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),
/* 58 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 59 */
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),
/* 60 */
/***/ ((module, exports, __webpack_require__) => {

// info about each config option.

var debug = process.env.DEBUG_NOPT || process.env.NOPT_DEBUG
  ? function () { console.error.apply(console, arguments) }
  : function () {}

var url = __webpack_require__(56)
  , path = __webpack_require__(58)
  , Stream = (__webpack_require__(61).Stream)
  , abbrev = __webpack_require__(62)
  , os = __webpack_require__(59)

module.exports = exports = nopt
exports.clean = clean

exports.typeDefs =
  { String  : { type: String,  validate: validateString  }
  , Boolean : { type: Boolean, validate: validateBoolean }
  , url     : { type: url,     validate: validateUrl     }
  , Number  : { type: Number,  validate: validateNumber  }
  , path    : { type: path,    validate: validatePath    }
  , Stream  : { type: Stream,  validate: validateStream  }
  , Date    : { type: Date,    validate: validateDate    }
  }

function nopt (types, shorthands, args, slice) {
  args = args || process.argv
  types = types || {}
  shorthands = shorthands || {}
  if (typeof slice !== "number") slice = 2

  debug(types, shorthands, args, slice)

  args = args.slice(slice)
  var data = {}
    , key
    , argv = {
        remain: [],
        cooked: args,
        original: args.slice(0)
      }

  parse(args, data, argv.remain, types, shorthands)
  // now data is full
  clean(data, types, exports.typeDefs)
  data.argv = argv
  Object.defineProperty(data.argv, 'toString', { value: function () {
    return this.original.map(JSON.stringify).join(" ")
  }, enumerable: false })
  return data
}

function clean (data, types, typeDefs) {
  typeDefs = typeDefs || exports.typeDefs
  var remove = {}
    , typeDefault = [false, true, null, String, Array]

  Object.keys(data).forEach(function (k) {
    if (k === "argv") return
    var val = data[k]
      , isArray = Array.isArray(val)
      , type = types[k]
    if (!isArray) val = [val]
    if (!type) type = typeDefault
    if (type === Array) type = typeDefault.concat(Array)
    if (!Array.isArray(type)) type = [type]

    debug("val=%j", val)
    debug("types=", type)
    val = val.map(function (val) {
      // if it's an unknown value, then parse false/true/null/numbers/dates
      if (typeof val === "string") {
        debug("string %j", val)
        val = val.trim()
        if ((val === "null" && ~type.indexOf(null))
            || (val === "true" &&
               (~type.indexOf(true) || ~type.indexOf(Boolean)))
            || (val === "false" &&
               (~type.indexOf(false) || ~type.indexOf(Boolean)))) {
          val = JSON.parse(val)
          debug("jsonable %j", val)
        } else if (~type.indexOf(Number) && !isNaN(val)) {
          debug("convert to number", val)
          val = +val
        } else if (~type.indexOf(Date) && !isNaN(Date.parse(val))) {
          debug("convert to date", val)
          val = new Date(val)
        }
      }

      if (!types.hasOwnProperty(k)) {
        return val
      }

      // allow `--no-blah` to set 'blah' to null if null is allowed
      if (val === false && ~type.indexOf(null) &&
          !(~type.indexOf(false) || ~type.indexOf(Boolean))) {
        val = null
      }

      var d = {}
      d[k] = val
      debug("prevalidated val", d, val, types[k])
      if (!validate(d, k, val, types[k], typeDefs)) {
        if (exports.invalidHandler) {
          exports.invalidHandler(k, val, types[k], data)
        } else if (exports.invalidHandler !== false) {
          debug("invalid: "+k+"="+val, types[k])
        }
        return remove
      }
      debug("validated val", d, val, types[k])
      return d[k]
    }).filter(function (val) { return val !== remove })

    // if we allow Array specifically, then an empty array is how we
    // express 'no value here', not null.  Allow it.
    if (!val.length && type.indexOf(Array) === -1) {
      debug('VAL HAS NO LENGTH, DELETE IT', val, k, type.indexOf(Array))
      delete data[k]
    }
    else if (isArray) {
      debug(isArray, data[k], val)
      data[k] = val
    } else data[k] = val[0]

    debug("k=%s val=%j", k, val, data[k])
  })
}

function validateString (data, k, val) {
  data[k] = String(val)
}

function validatePath (data, k, val) {
  if (val === true) return false
  if (val === null) return true

  val = String(val)

  var isWin       = process.platform === 'win32'
    , homePattern = isWin ? /^~(\/|\\)/ : /^~\//
    , home        = os.homedir()

  if (home && val.match(homePattern)) {
    data[k] = path.resolve(home, val.substr(2))
  } else {
    data[k] = path.resolve(val)
  }
  return true
}

function validateNumber (data, k, val) {
  debug("validate Number %j %j %j", k, val, isNaN(val))
  if (isNaN(val)) return false
  data[k] = +val
}

function validateDate (data, k, val) {
  var s = Date.parse(val)
  debug("validate Date %j %j %j", k, val, s)
  if (isNaN(s)) return false
  data[k] = new Date(val)
}

function validateBoolean (data, k, val) {
  if (val instanceof Boolean) val = val.valueOf()
  else if (typeof val === "string") {
    if (!isNaN(val)) val = !!(+val)
    else if (val === "null" || val === "false") val = false
    else val = true
  } else val = !!val
  data[k] = val
}

function validateUrl (data, k, val) {
  val = url.parse(String(val))
  if (!val.host) return false
  data[k] = val.href
}

function validateStream (data, k, val) {
  if (!(val instanceof Stream)) return false
  data[k] = val
}

function validate (data, k, val, type, typeDefs) {
  // arrays are lists of types.
  if (Array.isArray(type)) {
    for (var i = 0, l = type.length; i < l; i ++) {
      if (type[i] === Array) continue
      if (validate(data, k, val, type[i], typeDefs)) return true
    }
    delete data[k]
    return false
  }

  // an array of anything?
  if (type === Array) return true

  // NaN is poisonous.  Means that something is not allowed.
  if (type !== type) {
    debug("Poison NaN", k, val, type)
    delete data[k]
    return false
  }

  // explicit list of values
  if (val === type) {
    debug("Explicitly allowed %j", val)
    // if (isArray) (data[k] = data[k] || []).push(val)
    // else data[k] = val
    data[k] = val
    return true
  }

  // now go through the list of typeDefs, validate against each one.
  var ok = false
    , types = Object.keys(typeDefs)
  for (var i = 0, l = types.length; i < l; i ++) {
    debug("test type %j %j %j", k, val, types[i])
    var t = typeDefs[types[i]]
    if (t &&
      ((type && type.name && t.type && t.type.name) ? (type.name === t.type.name) : (type === t.type))) {
      var d = {}
      ok = false !== t.validate(d, k, val)
      val = d[k]
      if (ok) {
        // if (isArray) (data[k] = data[k] || []).push(val)
        // else data[k] = val
        data[k] = val
        break
      }
    }
  }
  debug("OK? %j (%j %j %j)", ok, k, val, types[i])

  if (!ok) delete data[k]
  return ok
}

function parse (args, data, remain, types, shorthands) {
  debug("parse", args, data, remain)

  var key = null
    , abbrevs = abbrev(Object.keys(types))
    , shortAbbr = abbrev(Object.keys(shorthands))

  for (var i = 0; i < args.length; i ++) {
    var arg = args[i]
    debug("arg", arg)

    if (arg.match(/^-{2,}$/)) {
      // done with keys.
      // the rest are args.
      remain.push.apply(remain, args.slice(i + 1))
      args[i] = "--"
      break
    }
    var hadEq = false
    if (arg.charAt(0) === "-" && arg.length > 1) {
      var at = arg.indexOf('=')
      if (at > -1) {
        hadEq = true
        var v = arg.substr(at + 1)
        arg = arg.substr(0, at)
        args.splice(i, 1, arg, v)
      }

      // see if it's a shorthand
      // if so, splice and back up to re-parse it.
      var shRes = resolveShort(arg, shorthands, shortAbbr, abbrevs)
      debug("arg=%j shRes=%j", arg, shRes)
      if (shRes) {
        debug(arg, shRes)
        args.splice.apply(args, [i, 1].concat(shRes))
        if (arg !== shRes[0]) {
          i --
          continue
        }
      }
      arg = arg.replace(/^-+/, "")
      var no = null
      while (arg.toLowerCase().indexOf("no-") === 0) {
        no = !no
        arg = arg.substr(3)
      }

      if (abbrevs[arg]) arg = abbrevs[arg]

      var argType = types[arg]
      var isTypeArray = Array.isArray(argType)
      if (isTypeArray && argType.length === 1) {
        isTypeArray = false
        argType = argType[0]
      }

      var isArray = argType === Array ||
        isTypeArray && argType.indexOf(Array) !== -1

      // allow unknown things to be arrays if specified multiple times.
      if (!types.hasOwnProperty(arg) && data.hasOwnProperty(arg)) {
        if (!Array.isArray(data[arg]))
          data[arg] = [data[arg]]
        isArray = true
      }

      var val
        , la = args[i + 1]

      var isBool = typeof no === 'boolean' ||
        argType === Boolean ||
        isTypeArray && argType.indexOf(Boolean) !== -1 ||
        (typeof argType === 'undefined' && !hadEq) ||
        (la === "false" &&
         (argType === null ||
          isTypeArray && ~argType.indexOf(null)))

      if (isBool) {
        // just set and move along
        val = !no
        // however, also support --bool true or --bool false
        if (la === "true" || la === "false") {
          val = JSON.parse(la)
          la = null
          if (no) val = !val
          i ++
        }

        // also support "foo":[Boolean, "bar"] and "--foo bar"
        if (isTypeArray && la) {
          if (~argType.indexOf(la)) {
            // an explicit type
            val = la
            i ++
          } else if ( la === "null" && ~argType.indexOf(null) ) {
            // null allowed
            val = null
            i ++
          } else if ( !la.match(/^-{2,}[^-]/) &&
                      !isNaN(la) &&
                      ~argType.indexOf(Number) ) {
            // number
            val = +la
            i ++
          } else if ( !la.match(/^-[^-]/) && ~argType.indexOf(String) ) {
            // string
            val = la
            i ++
          }
        }

        if (isArray) (data[arg] = data[arg] || []).push(val)
        else data[arg] = val

        continue
      }

      if (argType === String) {
        if (la === undefined) {
          la = ""
        } else if (la.match(/^-{1,2}[^-]+/)) {
          la = ""
          i --
        }
      }

      if (la && la.match(/^-{2,}$/)) {
        la = undefined
        i --
      }

      val = la === undefined ? true : la
      if (isArray) (data[arg] = data[arg] || []).push(val)
      else data[arg] = val

      i ++
      continue
    }
    remain.push(arg)
  }
}

function resolveShort (arg, shorthands, shortAbbr, abbrevs) {
  // handle single-char shorthands glommed together, like
  // npm ls -glp, but only if there is one dash, and only if
  // all of the chars are single-char shorthands, and it's
  // not a match to some other abbrev.
  arg = arg.replace(/^-+/, '')

  // if it's an exact known option, then don't go any further
  if (abbrevs[arg] === arg)
    return null

  // if it's an exact known shortopt, same deal
  if (shorthands[arg]) {
    // make it an array, if it's a list of words
    if (shorthands[arg] && !Array.isArray(shorthands[arg]))
      shorthands[arg] = shorthands[arg].split(/\s+/)

    return shorthands[arg]
  }

  // first check to see if this arg is a set of single-char shorthands
  var singles = shorthands.___singles
  if (!singles) {
    singles = Object.keys(shorthands).filter(function (s) {
      return s.length === 1
    }).reduce(function (l,r) {
      l[r] = true
      return l
    }, {})
    shorthands.___singles = singles
    debug('shorthand singles', singles)
  }

  var chrs = arg.split("").filter(function (c) {
    return singles[c]
  })

  if (chrs.join("") === arg) return chrs.map(function (c) {
    return shorthands[c]
  }).reduce(function (l, r) {
    return l.concat(r)
  }, [])


  // if it's an arg abbrev, and not a literal shorthand, then prefer the arg
  if (abbrevs[arg] && !shorthands[arg])
    return null

  // if it's an abbr for a shorthand, then use that
  if (shortAbbr[arg])
    arg = shortAbbr[arg]

  // make it an array, if it's a list of words
  if (shorthands[arg] && !Array.isArray(shorthands[arg]))
    shorthands[arg] = shorthands[arg].split(/\s+/)

  return shorthands[arg]
}


/***/ }),
/* 61 */
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),
/* 62 */
/***/ ((module, exports) => {

module.exports = exports = abbrev.abbrev = abbrev

abbrev.monkeyPatch = monkeyPatch

function monkeyPatch () {
  Object.defineProperty(Array.prototype, 'abbrev', {
    value: function () { return abbrev(this) },
    enumerable: false, configurable: true, writable: true
  })

  Object.defineProperty(Object.prototype, 'abbrev', {
    value: function () { return abbrev(Object.keys(this)) },
    enumerable: false, configurable: true, writable: true
  })
}

function abbrev (list) {
  if (arguments.length !== 1 || !Array.isArray(list)) {
    list = Array.prototype.slice.call(arguments, 0)
  }
  for (var i = 0, l = list.length, args = [] ; i < l ; i ++) {
    args[i] = typeof list[i] === "string" ? list[i] : String(list[i])
  }

  // sort them lexicographically, so that they're next to their nearest kin
  args = args.sort(lexSort)

  // walk through each, seeing how much it has in common with the next and previous
  var abbrevs = {}
    , prev = ""
  for (var i = 0, l = args.length ; i < l ; i ++) {
    var current = args[i]
      , next = args[i + 1] || ""
      , nextMatches = true
      , prevMatches = true
    if (current === next) continue
    for (var j = 0, cl = current.length ; j < cl ; j ++) {
      var curChar = current.charAt(j)
      nextMatches = nextMatches && curChar === next.charAt(j)
      prevMatches = prevMatches && curChar === prev.charAt(j)
      if (!nextMatches && !prevMatches) {
        j ++
        break
      }
    }
    prev = current
    if (j === cl) {
      abbrevs[current] = current
      continue
    }
    for (var a = current.substr(0, j) ; j <= cl ; j ++) {
      abbrevs[a] = current
      a += current.charAt(j)
    }
  }
  return abbrevs
}

function lexSort (a, b) {
  return a === b ? 0 : a > b ? 1 : -1
}


/***/ }),
/* 63 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";

var Progress = __webpack_require__(64)
var Gauge = __webpack_require__(73)
var EE = (__webpack_require__(68).EventEmitter)
var log = exports = module.exports = new EE()
var util = __webpack_require__(66)

var setBlocking = __webpack_require__(97)
var consoleControl = __webpack_require__(75)

setBlocking(true)
var stream = process.stderr
Object.defineProperty(log, 'stream', {
  set: function (newStream) {
    stream = newStream
    if (this.gauge) {
      this.gauge.setWriteTo(stream, stream)
    }
  },
  get: function () {
    return stream
  },
})

// by default, decide based on tty-ness.
var colorEnabled
log.useColor = function () {
  return colorEnabled != null ? colorEnabled : stream.isTTY
}

log.enableColor = function () {
  colorEnabled = true
  this.gauge.setTheme({hasColor: colorEnabled, hasUnicode: unicodeEnabled})
}
log.disableColor = function () {
  colorEnabled = false
  this.gauge.setTheme({hasColor: colorEnabled, hasUnicode: unicodeEnabled})
}

// default level
log.level = 'info'

log.gauge = new Gauge(stream, {
  enabled: false, // no progress bars unless asked
  theme: {hasColor: log.useColor()},
  template: [
    {type: 'progressbar', length: 20},
    {type: 'activityIndicator', kerning: 1, length: 1},
    {type: 'section', default: ''},
    ':',
    {type: 'logline', kerning: 1, default: ''},
  ],
})

log.tracker = new Progress.TrackerGroup()

// we track this separately as we may need to temporarily disable the
// display of the status bar for our own loggy purposes.
log.progressEnabled = log.gauge.isEnabled()

var unicodeEnabled

log.enableUnicode = function () {
  unicodeEnabled = true
  this.gauge.setTheme({hasColor: this.useColor(), hasUnicode: unicodeEnabled})
}

log.disableUnicode = function () {
  unicodeEnabled = false
  this.gauge.setTheme({hasColor: this.useColor(), hasUnicode: unicodeEnabled})
}

log.setGaugeThemeset = function (themes) {
  this.gauge.setThemeset(themes)
}

log.setGaugeTemplate = function (template) {
  this.gauge.setTemplate(template)
}

log.enableProgress = function () {
  if (this.progressEnabled) {
    return
  }

  this.progressEnabled = true
  this.tracker.on('change', this.showProgress)
  if (this._paused) {
    return
  }

  this.gauge.enable()
}

log.disableProgress = function () {
  if (!this.progressEnabled) {
    return
  }
  this.progressEnabled = false
  this.tracker.removeListener('change', this.showProgress)
  this.gauge.disable()
}

var trackerConstructors = ['newGroup', 'newItem', 'newStream']

var mixinLog = function (tracker) {
  // mixin the public methods from log into the tracker
  // (except: conflicts and one's we handle specially)
  Object.keys(log).forEach(function (P) {
    if (P[0] === '_') {
      return
    }

    if (trackerConstructors.filter(function (C) {
      return C === P
    }).length) {
      return
    }

    if (tracker[P]) {
      return
    }

    if (typeof log[P] !== 'function') {
      return
    }

    var func = log[P]
    tracker[P] = function () {
      return func.apply(log, arguments)
    }
  })
  // if the new tracker is a group, make sure any subtrackers get
  // mixed in too
  if (tracker instanceof Progress.TrackerGroup) {
    trackerConstructors.forEach(function (C) {
      var func = tracker[C]
      tracker[C] = function () {
        return mixinLog(func.apply(tracker, arguments))
      }
    })
  }
  return tracker
}

// Add tracker constructors to the top level log object
trackerConstructors.forEach(function (C) {
  log[C] = function () {
    return mixinLog(this.tracker[C].apply(this.tracker, arguments))
  }
})

log.clearProgress = function (cb) {
  if (!this.progressEnabled) {
    return cb && process.nextTick(cb)
  }

  this.gauge.hide(cb)
}

log.showProgress = function (name, completed) {
  if (!this.progressEnabled) {
    return
  }

  var values = {}
  if (name) {
    values.section = name
  }

  var last = log.record[log.record.length - 1]
  if (last) {
    values.subsection = last.prefix
    var disp = log.disp[last.level] || last.level
    var logline = this._format(disp, log.style[last.level])
    if (last.prefix) {
      logline += ' ' + this._format(last.prefix, this.prefixStyle)
    }

    logline += ' ' + last.message.split(/\r?\n/)[0]
    values.logline = logline
  }
  values.completed = completed || this.tracker.completed()
  this.gauge.show(values)
}.bind(log) // bind for use in tracker's on-change listener

// temporarily stop emitting, but don't drop
log.pause = function () {
  this._paused = true
  if (this.progressEnabled) {
    this.gauge.disable()
  }
}

log.resume = function () {
  if (!this._paused) {
    return
  }

  this._paused = false

  var b = this._buffer
  this._buffer = []
  b.forEach(function (m) {
    this.emitLog(m)
  }, this)
  if (this.progressEnabled) {
    this.gauge.enable()
  }
}

log._buffer = []

var id = 0
log.record = []
log.maxRecordSize = 10000
log.log = function (lvl, prefix, message) {
  var l = this.levels[lvl]
  if (l === undefined) {
    return this.emit('error', new Error(util.format(
      'Undefined log level: %j', lvl)))
  }

  var a = new Array(arguments.length - 2)
  var stack = null
  for (var i = 2; i < arguments.length; i++) {
    var arg = a[i - 2] = arguments[i]

    // resolve stack traces to a plain string.
    if (typeof arg === 'object' && arg instanceof Error && arg.stack) {
      Object.defineProperty(arg, 'stack', {
        value: stack = arg.stack + '',
        enumerable: true,
        writable: true,
      })
    }
  }
  if (stack) {
    a.unshift(stack + '\n')
  }
  message = util.format.apply(util, a)

  var m = {
    id: id++,
    level: lvl,
    prefix: String(prefix || ''),
    message: message,
    messageRaw: a,
  }

  this.emit('log', m)
  this.emit('log.' + lvl, m)
  if (m.prefix) {
    this.emit(m.prefix, m)
  }

  this.record.push(m)
  var mrs = this.maxRecordSize
  var n = this.record.length - mrs
  if (n > mrs / 10) {
    var newSize = Math.floor(mrs * 0.9)
    this.record = this.record.slice(-1 * newSize)
  }

  this.emitLog(m)
}.bind(log)

log.emitLog = function (m) {
  if (this._paused) {
    this._buffer.push(m)
    return
  }
  if (this.progressEnabled) {
    this.gauge.pulse(m.prefix)
  }

  var l = this.levels[m.level]
  if (l === undefined) {
    return
  }

  if (l < this.levels[this.level]) {
    return
  }

  if (l > 0 && !isFinite(l)) {
    return
  }

  // If 'disp' is null or undefined, use the lvl as a default
  // Allows: '', 0 as valid disp
  var disp = log.disp[m.level] != null ? log.disp[m.level] : m.level
  this.clearProgress()
  m.message.split(/\r?\n/).forEach(function (line) {
    if (this.heading) {
      this.write(this.heading, this.headingStyle)
      this.write(' ')
    }
    this.write(disp, log.style[m.level])
    var p = m.prefix || ''
    if (p) {
      this.write(' ')
    }

    this.write(p, this.prefixStyle)
    this.write(' ' + line + '\n')
  }, this)
  this.showProgress()
}

log._format = function (msg, style) {
  if (!stream) {
    return
  }

  var output = ''
  if (this.useColor()) {
    style = style || {}
    var settings = []
    if (style.fg) {
      settings.push(style.fg)
    }

    if (style.bg) {
      settings.push('bg' + style.bg[0].toUpperCase() + style.bg.slice(1))
    }

    if (style.bold) {
      settings.push('bold')
    }

    if (style.underline) {
      settings.push('underline')
    }

    if (style.inverse) {
      settings.push('inverse')
    }

    if (settings.length) {
      output += consoleControl.color(settings)
    }

    if (style.beep) {
      output += consoleControl.beep()
    }
  }
  output += msg
  if (this.useColor()) {
    output += consoleControl.color('reset')
  }

  return output
}

log.write = function (msg, style) {
  if (!stream) {
    return
  }

  stream.write(this._format(msg, style))
}

log.addLevel = function (lvl, n, style, disp) {
  // If 'disp' is null or undefined, use the lvl as a default
  if (disp == null) {
    disp = lvl
  }

  this.levels[lvl] = n
  this.style[lvl] = style
  if (!this[lvl]) {
    this[lvl] = function () {
      var a = new Array(arguments.length + 1)
      a[0] = lvl
      for (var i = 0; i < arguments.length; i++) {
        a[i + 1] = arguments[i]
      }

      return this.log.apply(this, a)
    }.bind(this)
  }
  this.disp[lvl] = disp
}

log.prefixStyle = { fg: 'magenta' }
log.headingStyle = { fg: 'white', bg: 'black' }

log.style = {}
log.levels = {}
log.disp = {}
log.addLevel('silly', -Infinity, { inverse: true }, 'sill')
log.addLevel('verbose', 1000, { fg: 'blue', bg: 'black' }, 'verb')
log.addLevel('info', 2000, { fg: 'green' })
log.addLevel('timing', 2500, { fg: 'green', bg: 'black' })
log.addLevel('http', 3000, { fg: 'green', bg: 'black' })
log.addLevel('notice', 3500, { fg: 'blue', bg: 'black' })
log.addLevel('warn', 4000, { fg: 'black', bg: 'yellow' }, 'WARN')
log.addLevel('error', 5000, { fg: 'red', bg: 'black' }, 'ERR!')
log.addLevel('silent', Infinity)

// allow 'error' prefix
log.on('error', function () {})


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.TrackerGroup = __webpack_require__(65)
exports.Tracker = __webpack_require__(69)
exports.TrackerStream = __webpack_require__(70)


/***/ }),
/* 65 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var util = __webpack_require__(66)
var TrackerBase = __webpack_require__(67)
var Tracker = __webpack_require__(69)
var TrackerStream = __webpack_require__(70)

var TrackerGroup = module.exports = function (name) {
  TrackerBase.call(this, name)
  this.parentGroup = null
  this.trackers = []
  this.completion = {}
  this.weight = {}
  this.totalWeight = 0
  this.finished = false
  this.bubbleChange = bubbleChange(this)
}
util.inherits(TrackerGroup, TrackerBase)

function bubbleChange (trackerGroup) {
  return function (name, completed, tracker) {
    trackerGroup.completion[tracker.id] = completed
    if (trackerGroup.finished) {
      return
    }
    trackerGroup.emit('change', name || trackerGroup.name, trackerGroup.completed(), trackerGroup)
  }
}

TrackerGroup.prototype.nameInTree = function () {
  var names = []
  var from = this
  while (from) {
    names.unshift(from.name)
    from = from.parentGroup
  }
  return names.join('/')
}

TrackerGroup.prototype.addUnit = function (unit, weight) {
  if (unit.addUnit) {
    var toTest = this
    while (toTest) {
      if (unit === toTest) {
        throw new Error(
          'Attempted to add tracker group ' +
          unit.name + ' to tree that already includes it ' +
          this.nameInTree(this))
      }
      toTest = toTest.parentGroup
    }
    unit.parentGroup = this
  }
  this.weight[unit.id] = weight || 1
  this.totalWeight += this.weight[unit.id]
  this.trackers.push(unit)
  this.completion[unit.id] = unit.completed()
  unit.on('change', this.bubbleChange)
  if (!this.finished) {
    this.emit('change', unit.name, this.completion[unit.id], unit)
  }
  return unit
}

TrackerGroup.prototype.completed = function () {
  if (this.trackers.length === 0) {
    return 0
  }
  var valPerWeight = 1 / this.totalWeight
  var completed = 0
  for (var ii = 0; ii < this.trackers.length; ii++) {
    var trackerId = this.trackers[ii].id
    completed +=
      valPerWeight * this.weight[trackerId] * this.completion[trackerId]
  }
  return completed
}

TrackerGroup.prototype.newGroup = function (name, weight) {
  return this.addUnit(new TrackerGroup(name), weight)
}

TrackerGroup.prototype.newItem = function (name, todo, weight) {
  return this.addUnit(new Tracker(name, todo), weight)
}

TrackerGroup.prototype.newStream = function (name, todo, weight) {
  return this.addUnit(new TrackerStream(name, todo), weight)
}

TrackerGroup.prototype.finish = function () {
  this.finished = true
  if (!this.trackers.length) {
    this.addUnit(new Tracker(), 1, true)
  }
  for (var ii = 0; ii < this.trackers.length; ii++) {
    var tracker = this.trackers[ii]
    tracker.finish()
    tracker.removeListener('change', this.bubbleChange)
  }
  this.emit('change', this.name, 1, this)
}

var buffer = '                                  '
TrackerGroup.prototype.debug = function (depth) {
  depth = depth || 0
  var indent = depth ? buffer.substr(0, depth) : ''
  var output = indent + (this.name || 'top') + ': ' + this.completed() + '\n'
  this.trackers.forEach(function (tracker) {
    if (tracker instanceof TrackerGroup) {
      output += tracker.debug(depth + 1)
    } else {
      output += indent + ' ' + tracker.name + ': ' + tracker.completed() + '\n'
    }
  })
  return output
}


/***/ }),
/* 66 */
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),
/* 67 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var EventEmitter = (__webpack_require__(68).EventEmitter)
var util = __webpack_require__(66)

var trackerId = 0
var TrackerBase = module.exports = function (name) {
  EventEmitter.call(this)
  this.id = ++trackerId
  this.name = name
}
util.inherits(TrackerBase, EventEmitter)


/***/ }),
/* 68 */
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),
/* 69 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var util = __webpack_require__(66)
var TrackerBase = __webpack_require__(67)

var Tracker = module.exports = function (name, todo) {
  TrackerBase.call(this, name)
  this.workDone = 0
  this.workTodo = todo || 0
}
util.inherits(Tracker, TrackerBase)

Tracker.prototype.completed = function () {
  return this.workTodo === 0 ? 0 : this.workDone / this.workTodo
}

Tracker.prototype.addWork = function (work) {
  this.workTodo += work
  this.emit('change', this.name, this.completed(), this)
}

Tracker.prototype.completeWork = function (work) {
  this.workDone += work
  if (this.workDone > this.workTodo) {
    this.workDone = this.workTodo
  }
  this.emit('change', this.name, this.completed(), this)
}

Tracker.prototype.finish = function () {
  this.workTodo = this.workDone = 1
  this.emit('change', this.name, 1, this)
}


/***/ }),
/* 70 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var util = __webpack_require__(66)
var stream = __webpack_require__(71)
var delegate = __webpack_require__(72)
var Tracker = __webpack_require__(69)

var TrackerStream = module.exports = function (name, size, options) {
  stream.Transform.call(this, options)
  this.tracker = new Tracker(name, size)
  this.name = name
  this.id = this.tracker.id
  this.tracker.on('change', delegateChange(this))
}
util.inherits(TrackerStream, stream.Transform)

function delegateChange (trackerStream) {
  return function (name, completion, tracker) {
    trackerStream.emit('change', name, completion, trackerStream)
  }
}

TrackerStream.prototype._transform = function (data, encoding, cb) {
  this.tracker.completeWork(data.length ? data.length : 1)
  this.push(data)
  cb()
}

TrackerStream.prototype._flush = function (cb) {
  this.tracker.finish()
  cb()
}

delegate(TrackerStream.prototype, 'tracker')
  .method('completed')
  .method('addWork')
  .method('finish')


/***/ }),
/* 71 */
/***/ ((module) => {

"use strict";
module.exports = require("readable-stream");

/***/ }),
/* 72 */
/***/ ((module) => {


/**
 * Expose `Delegator`.
 */

module.exports = Delegator;

/**
 * Initialize a delegator.
 *
 * @param {Object} proto
 * @param {String} target
 * @api public
 */

function Delegator(proto, target) {
  if (!(this instanceof Delegator)) return new Delegator(proto, target);
  this.proto = proto;
  this.target = target;
  this.methods = [];
  this.getters = [];
  this.setters = [];
  this.fluents = [];
}

/**
 * Delegate method `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.method = function(name){
  var proto = this.proto;
  var target = this.target;
  this.methods.push(name);

  proto[name] = function(){
    return this[target][name].apply(this[target], arguments);
  };

  return this;
};

/**
 * Delegator accessor `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.access = function(name){
  return this.getter(name).setter(name);
};

/**
 * Delegator getter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.getter = function(name){
  var proto = this.proto;
  var target = this.target;
  this.getters.push(name);

  proto.__defineGetter__(name, function(){
    return this[target][name];
  });

  return this;
};

/**
 * Delegator setter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.setter = function(name){
  var proto = this.proto;
  var target = this.target;
  this.setters.push(name);

  proto.__defineSetter__(name, function(val){
    return this[target][name] = val;
  });

  return this;
};

/**
 * Delegator fluent accessor
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.fluent = function (name) {
  var proto = this.proto;
  var target = this.target;
  this.fluents.push(name);

  proto[name] = function(val){
    if ('undefined' != typeof val) {
      this[target][name] = val;
      return this;
    } else {
      return this[target][name];
    }
  };

  return this;
};


/***/ }),
/* 73 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var Plumbing = __webpack_require__(74)
var hasUnicode = __webpack_require__(84)
var hasColor = __webpack_require__(85)
var onExit = __webpack_require__(87)
var defaultThemes = __webpack_require__(88)
var setInterval = __webpack_require__(94)
var process = __webpack_require__(95)
var setImmediate = __webpack_require__(96)

module.exports = Gauge

function callWith (obj, method) {
  return function () {
    return method.call(obj)
  }
}

function Gauge (arg1, arg2) {
  var options, writeTo
  if (arg1 && arg1.write) {
    writeTo = arg1
    options = arg2 || {}
  } else if (arg2 && arg2.write) {
    writeTo = arg2
    options = arg1 || {}
  } else {
    writeTo = process.stderr
    options = arg1 || arg2 || {}
  }

  this._status = {
    spun: 0,
    section: '',
    subsection: ''
  }
  this._paused = false // are we paused for back pressure?
  this._disabled = true // are all progress bar updates disabled?
  this._showing = false // do we WANT the progress bar on screen
  this._onScreen = false // IS the progress bar on screen
  this._needsRedraw = false // should we print something at next tick?
  this._hideCursor = options.hideCursor == null ? true : options.hideCursor
  this._fixedFramerate = options.fixedFramerate == null
    ? !(/^v0\.8\./.test(process.version))
    : options.fixedFramerate
  this._lastUpdateAt = null
  this._updateInterval = options.updateInterval == null ? 50 : options.updateInterval

  this._themes = options.themes || defaultThemes
  this._theme = options.theme
  var theme = this._computeTheme(options.theme)
  var template = options.template || [
    {type: 'progressbar', length: 20},
    {type: 'activityIndicator', kerning: 1, length: 1},
    {type: 'section', kerning: 1, default: ''},
    {type: 'subsection', kerning: 1, default: ''}
  ]
  this.setWriteTo(writeTo, options.tty)
  var PlumbingClass = options.Plumbing || Plumbing
  this._gauge = new PlumbingClass(theme, template, this.getWidth())

  this._$$doRedraw = callWith(this, this._doRedraw)
  this._$$handleSizeChange = callWith(this, this._handleSizeChange)

  this._cleanupOnExit = options.cleanupOnExit == null || options.cleanupOnExit
  this._removeOnExit = null

  if (options.enabled || (options.enabled == null && this._tty && this._tty.isTTY)) {
    this.enable()
  } else {
    this.disable()
  }
}
Gauge.prototype = {}

Gauge.prototype.isEnabled = function () {
  return !this._disabled
}

Gauge.prototype.setTemplate = function (template) {
  this._gauge.setTemplate(template)
  if (this._showing) this._requestRedraw()
}

Gauge.prototype._computeTheme = function (theme) {
  if (!theme) theme = {}
  if (typeof theme === 'string') {
    theme = this._themes.getTheme(theme)
  } else if (theme && (Object.keys(theme).length === 0 || theme.hasUnicode != null || theme.hasColor != null)) {
    var useUnicode = theme.hasUnicode == null ? hasUnicode() : theme.hasUnicode
    var useColor = theme.hasColor == null ? hasColor : theme.hasColor
    theme = this._themes.getDefault({hasUnicode: useUnicode, hasColor: useColor, platform: theme.platform})
  }
  return theme
}

Gauge.prototype.setThemeset = function (themes) {
  this._themes = themes
  this.setTheme(this._theme)
}

Gauge.prototype.setTheme = function (theme) {
  this._gauge.setTheme(this._computeTheme(theme))
  if (this._showing) this._requestRedraw()
  this._theme = theme
}

Gauge.prototype._requestRedraw = function () {
  this._needsRedraw = true
  if (!this._fixedFramerate) this._doRedraw()
}

Gauge.prototype.getWidth = function () {
  return ((this._tty && this._tty.columns) || 80) - 1
}

Gauge.prototype.setWriteTo = function (writeTo, tty) {
  var enabled = !this._disabled
  if (enabled) this.disable()
  this._writeTo = writeTo
  this._tty = tty ||
    (writeTo === process.stderr && process.stdout.isTTY && process.stdout) ||
    (writeTo.isTTY && writeTo) ||
    this._tty
  if (this._gauge) this._gauge.setWidth(this.getWidth())
  if (enabled) this.enable()
}

Gauge.prototype.enable = function () {
  if (!this._disabled) return
  this._disabled = false
  if (this._tty) this._enableEvents()
  if (this._showing) this.show()
}

Gauge.prototype.disable = function () {
  if (this._disabled) return
  if (this._showing) {
    this._lastUpdateAt = null
    this._showing = false
    this._doRedraw()
    this._showing = true
  }
  this._disabled = true
  if (this._tty) this._disableEvents()
}

Gauge.prototype._enableEvents = function () {
  if (this._cleanupOnExit) {
    this._removeOnExit = onExit(callWith(this, this.disable))
  }
  this._tty.on('resize', this._$$handleSizeChange)
  if (this._fixedFramerate) {
    this.redrawTracker = setInterval(this._$$doRedraw, this._updateInterval)
    if (this.redrawTracker.unref) this.redrawTracker.unref()
  }
}

Gauge.prototype._disableEvents = function () {
  this._tty.removeListener('resize', this._$$handleSizeChange)
  if (this._fixedFramerate) clearInterval(this.redrawTracker)
  if (this._removeOnExit) this._removeOnExit()
}

Gauge.prototype.hide = function (cb) {
  if (this._disabled) return cb && process.nextTick(cb)
  if (!this._showing) return cb && process.nextTick(cb)
  this._showing = false
  this._doRedraw()
  cb && setImmediate(cb)
}

Gauge.prototype.show = function (section, completed) {
  this._showing = true
  if (typeof section === 'string') {
    this._status.section = section
  } else if (typeof section === 'object') {
    var sectionKeys = Object.keys(section)
    for (var ii = 0; ii < sectionKeys.length; ++ii) {
      var key = sectionKeys[ii]
      this._status[key] = section[key]
    }
  }
  if (completed != null) this._status.completed = completed
  if (this._disabled) return
  this._requestRedraw()
}

Gauge.prototype.pulse = function (subsection) {
  this._status.subsection = subsection || ''
  this._status.spun++
  if (this._disabled) return
  if (!this._showing) return
  this._requestRedraw()
}

Gauge.prototype._handleSizeChange = function () {
  this._gauge.setWidth(this._tty.columns - 1)
  this._requestRedraw()
}

Gauge.prototype._doRedraw = function () {
  if (this._disabled || this._paused) return
  if (!this._fixedFramerate) {
    var now = Date.now()
    if (this._lastUpdateAt && now - this._lastUpdateAt < this._updateInterval) return
    this._lastUpdateAt = now
  }
  if (!this._showing && this._onScreen) {
    this._onScreen = false
    var result = this._gauge.hide()
    if (this._hideCursor) {
      result += this._gauge.showCursor()
    }
    return this._writeTo.write(result)
  }
  if (!this._showing && !this._onScreen) return
  if (this._showing && !this._onScreen) {
    this._onScreen = true
    this._needsRedraw = true
    if (this._hideCursor) {
      this._writeTo.write(this._gauge.hideCursor())
    }
  }
  if (!this._needsRedraw) return
  if (!this._writeTo.write(this._gauge.show(this._status))) {
    this._paused = true
    this._writeTo.on('drain', callWith(this, function () {
      this._paused = false
      this._doRedraw()
    }))
  }
}


/***/ }),
/* 74 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var consoleControl = __webpack_require__(75)
var renderTemplate = __webpack_require__(76)
var validate = __webpack_require__(79)

var Plumbing = module.exports = function (theme, template, width) {
  if (!width) width = 80
  validate('OAN', [theme, template, width])
  this.showing = false
  this.theme = theme
  this.width = width
  this.template = template
}
Plumbing.prototype = {}

Plumbing.prototype.setTheme = function (theme) {
  validate('O', [theme])
  this.theme = theme
}

Plumbing.prototype.setTemplate = function (template) {
  validate('A', [template])
  this.template = template
}

Plumbing.prototype.setWidth = function (width) {
  validate('N', [width])
  this.width = width
}

Plumbing.prototype.hide = function () {
  return consoleControl.gotoSOL() + consoleControl.eraseLine()
}

Plumbing.prototype.hideCursor = consoleControl.hideCursor

Plumbing.prototype.showCursor = consoleControl.showCursor

Plumbing.prototype.show = function (status) {
  var values = Object.create(this.theme)
  for (var key in status) {
    values[key] = status[key]
  }

  return renderTemplate(this.width, this.template, values).trim() +
         consoleControl.color('reset') +
         consoleControl.eraseLine() + consoleControl.gotoSOL()
}


/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


// These tables borrowed from `ansi`

var prefix = '\x1b['

exports.up = function up (num) {
  return prefix + (num || '') + 'A'
}

exports.down = function down (num) {
  return prefix + (num || '') + 'B'
}

exports.forward = function forward (num) {
  return prefix + (num || '') + 'C'
}

exports.back = function back (num) {
  return prefix + (num || '') + 'D'
}

exports.nextLine = function nextLine (num) {
  return prefix + (num || '') + 'E'
}

exports.previousLine = function previousLine (num) {
  return prefix + (num || '') + 'F'
}

exports.horizontalAbsolute = function horizontalAbsolute (num) {
  if (num == null) throw new Error('horizontalAboslute requires a column to position to')
  return prefix + num + 'G'
}

exports.eraseData = function eraseData () {
  return prefix + 'J'
}

exports.eraseLine = function eraseLine () {
  return prefix + 'K'
}

exports.goto = function (x, y) {
  return prefix + y + ';' + x + 'H'
}

exports.gotoSOL = function () {
  return '\r'
}

exports.beep = function () {
  return '\x07'
}

exports.hideCursor = function hideCursor () {
  return prefix + '?25l'
}

exports.showCursor = function showCursor () {
  return prefix + '?25h'
}

var colors = {
  reset: 0,
// styles
  bold: 1,
  italic: 3,
  underline: 4,
  inverse: 7,
// resets
  stopBold: 22,
  stopItalic: 23,
  stopUnderline: 24,
  stopInverse: 27,
// colors
  white: 37,
  black: 30,
  blue: 34,
  cyan: 36,
  green: 32,
  magenta: 35,
  red: 31,
  yellow: 33,
  bgWhite: 47,
  bgBlack: 40,
  bgBlue: 44,
  bgCyan: 46,
  bgGreen: 42,
  bgMagenta: 45,
  bgRed: 41,
  bgYellow: 43,

  grey: 90,
  brightBlack: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97,

  bgGrey: 100,
  bgBrightBlack: 100,
  bgBrightRed: 101,
  bgBrightGreen: 102,
  bgBrightYellow: 103,
  bgBrightBlue: 104,
  bgBrightMagenta: 105,
  bgBrightCyan: 106,
  bgBrightWhite: 107
}

exports.color = function color (colorWith) {
  if (arguments.length !== 1 || !Array.isArray(colorWith)) {
    colorWith = Array.prototype.slice.call(arguments)
  }
  return prefix + colorWith.map(colorNameToCode).join(';') + 'm'
}

function colorNameToCode (color) {
  if (colors[color] != null) return colors[color]
  throw new Error('Unknown color or style name: ' + color)
}


/***/ }),
/* 76 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var align = __webpack_require__(77)
var validate = __webpack_require__(79)
var wideTruncate = __webpack_require__(80)
var error = __webpack_require__(82)
var TemplateItem = __webpack_require__(83)

function renderValueWithValues (values) {
  return function (item) {
    return renderValue(item, values)
  }
}

var renderTemplate = module.exports = function (width, template, values) {
  var items = prepareItems(width, template, values)
  var rendered = items.map(renderValueWithValues(values)).join('')
  return align.left(wideTruncate(rendered, width), width)
}

function preType (item) {
  var cappedTypeName = item.type[0].toUpperCase() + item.type.slice(1)
  return 'pre' + cappedTypeName
}

function postType (item) {
  var cappedTypeName = item.type[0].toUpperCase() + item.type.slice(1)
  return 'post' + cappedTypeName
}

function hasPreOrPost (item, values) {
  if (!item.type) return
  return values[preType(item)] || values[postType(item)]
}

function generatePreAndPost (baseItem, parentValues) {
  var item = Object.assign({}, baseItem)
  var values = Object.create(parentValues)
  var template = []
  var pre = preType(item)
  var post = postType(item)
  if (values[pre]) {
    template.push({value: values[pre]})
    values[pre] = null
  }
  item.minLength = null
  item.length = null
  item.maxLength = null
  template.push(item)
  values[item.type] = values[item.type]
  if (values[post]) {
    template.push({value: values[post]})
    values[post] = null
  }
  return function ($1, $2, length) {
    return renderTemplate(length, template, values)
  }
}

function prepareItems (width, template, values) {
  function cloneAndObjectify (item, index, arr) {
    var cloned = new TemplateItem(item, width)
    var type = cloned.type
    if (cloned.value == null) {
      if (!(type in values)) {
        if (cloned.default == null) {
          throw new error.MissingTemplateValue(cloned, values)
        } else {
          cloned.value = cloned.default
        }
      } else {
        cloned.value = values[type]
      }
    }
    if (cloned.value == null || cloned.value === '') return null
    cloned.index = index
    cloned.first = index === 0
    cloned.last = index === arr.length - 1
    if (hasPreOrPost(cloned, values)) cloned.value = generatePreAndPost(cloned, values)
    return cloned
  }

  var output = template.map(cloneAndObjectify).filter(function (item) { return item != null })

  var remainingSpace = width
  var variableCount = output.length

  function consumeSpace (length) {
    if (length > remainingSpace) length = remainingSpace
    remainingSpace -= length
  }

  function finishSizing (item, length) {
    if (item.finished) throw new error.Internal('Tried to finish template item that was already finished')
    if (length === Infinity) throw new error.Internal('Length of template item cannot be infinity')
    if (length != null) item.length = length
    item.minLength = null
    item.maxLength = null
    --variableCount
    item.finished = true
    if (item.length == null) item.length = item.getBaseLength()
    if (item.length == null) throw new error.Internal('Finished template items must have a length')
    consumeSpace(item.getLength())
  }

  output.forEach(function (item) {
    if (!item.kerning) return
    var prevPadRight = item.first ? 0 : output[item.index - 1].padRight
    if (!item.first && prevPadRight < item.kerning) item.padLeft = item.kerning - prevPadRight
    if (!item.last) item.padRight = item.kerning
  })

  // Finish any that have a fixed (literal or intuited) length
  output.forEach(function (item) {
    if (item.getBaseLength() == null) return
    finishSizing(item)
  })

  var resized = 0
  var resizing
  var hunkSize
  do {
    resizing = false
    hunkSize = Math.round(remainingSpace / variableCount)
    output.forEach(function (item) {
      if (item.finished) return
      if (!item.maxLength) return
      if (item.getMaxLength() < hunkSize) {
        finishSizing(item, item.maxLength)
        resizing = true
      }
    })
  } while (resizing && resized++ < output.length)
  if (resizing) throw new error.Internal('Resize loop iterated too many times while determining maxLength')

  resized = 0
  do {
    resizing = false
    hunkSize = Math.round(remainingSpace / variableCount)
    output.forEach(function (item) {
      if (item.finished) return
      if (!item.minLength) return
      if (item.getMinLength() >= hunkSize) {
        finishSizing(item, item.minLength)
        resizing = true
      }
    })
  } while (resizing && resized++ < output.length)
  if (resizing) throw new error.Internal('Resize loop iterated too many times while determining minLength')

  hunkSize = Math.round(remainingSpace / variableCount)
  output.forEach(function (item) {
    if (item.finished) return
    finishSizing(item, hunkSize)
  })

  return output
}

function renderFunction (item, values, length) {
  validate('OON', arguments)
  if (item.type) {
    return item.value(values, values[item.type + 'Theme'] || {}, length)
  } else {
    return item.value(values, {}, length)
  }
}

function renderValue (item, values) {
  var length = item.getBaseLength()
  var value = typeof item.value === 'function' ? renderFunction(item, values, length) : item.value
  if (value == null || value === '') return ''
  var alignWith = align[item.align] || align.left
  var leftPadding = item.padLeft ? align.left('', item.padLeft) : ''
  var rightPadding = item.padRight ? align.right('', item.padRight) : ''
  var truncated = wideTruncate(String(value), length)
  var aligned = alignWith(truncated, length)
  return leftPadding + aligned + rightPadding
}


/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var stringWidth = __webpack_require__(78)

exports.center = alignCenter
exports.left = alignLeft
exports.right = alignRight

// lodash's way of generating pad characters.

function createPadding (width) {
  var result = ''
  var string = ' '
  var n = width
  do {
    if (n % 2) {
      result += string;
    }
    n = Math.floor(n / 2);
    string += string;
  } while (n);

  return result;
}

function alignLeft (str, width) {
  var trimmed = str.trimRight()
  if (trimmed.length === 0 && str.length >= width) return str
  var padding = ''
  var strWidth = stringWidth(trimmed)

  if (strWidth < width) {
    padding = createPadding(width - strWidth)
  }

  return trimmed + padding
}

function alignRight (str, width) {
  var trimmed = str.trimLeft()
  if (trimmed.length === 0 && str.length >= width) return str
  var padding = ''
  var strWidth = stringWidth(trimmed)

  if (strWidth < width) {
    padding = createPadding(width - strWidth)
  }

  return padding + trimmed
}

function alignCenter (str, width) {
  var trimmed = str.trim()
  if (trimmed.length === 0 && str.length >= width) return str
  var padLeft = ''
  var padRight = ''
  var strWidth = stringWidth(trimmed)

  if (strWidth < width) {
    var padLeftBy = parseInt((width - strWidth) / 2, 10) 
    padLeft = createPadding(padLeftBy)
    padRight = createPadding(width - (strWidth + padLeftBy))
  }

  return padLeft + trimmed + padRight
}


/***/ }),
/* 78 */
/***/ ((module) => {

"use strict";
module.exports = require("string-width");

/***/ }),
/* 79 */
/***/ ((module) => {

"use strict";

module.exports = validate

function isArguments (thingy) {
  return thingy != null && typeof thingy === 'object' && thingy.hasOwnProperty('callee')
}

const types = {
  '*': {label: 'any', check: () => true},
  A: {label: 'array', check: _ => Array.isArray(_) || isArguments(_)},
  S: {label: 'string', check: _ => typeof _ === 'string'},
  N: {label: 'number', check: _ => typeof _ === 'number'},
  F: {label: 'function', check: _ => typeof _ === 'function'},
  O: {label: 'object', check: _ => typeof _ === 'object' && _ != null && !types.A.check(_) && !types.E.check(_)},
  B: {label: 'boolean', check: _ => typeof _ === 'boolean'},
  E: {label: 'error', check: _ => _ instanceof Error},
  Z: {label: 'null', check: _ => _ == null}
}

function addSchema (schema, arity) {
  const group = arity[schema.length] = arity[schema.length] || []
  if (group.indexOf(schema) === -1) group.push(schema)
}

function validate (rawSchemas, args) {
  if (arguments.length !== 2) throw wrongNumberOfArgs(['SA'], arguments.length)
  if (!rawSchemas) throw missingRequiredArg(0, 'rawSchemas')
  if (!args) throw missingRequiredArg(1, 'args')
  if (!types.S.check(rawSchemas)) throw invalidType(0, ['string'], rawSchemas)
  if (!types.A.check(args)) throw invalidType(1, ['array'], args)
  const schemas = rawSchemas.split('|')
  const arity = {}

  schemas.forEach(schema => {
    for (let ii = 0; ii < schema.length; ++ii) {
      const type = schema[ii]
      if (!types[type]) throw unknownType(ii, type)
    }
    if (/E.*E/.test(schema)) throw moreThanOneError(schema)
    addSchema(schema, arity)
    if (/E/.test(schema)) {
      addSchema(schema.replace(/E.*$/, 'E'), arity)
      addSchema(schema.replace(/E/, 'Z'), arity)
      if (schema.length === 1) addSchema('', arity)
    }
  })
  let matching = arity[args.length]
  if (!matching) {
    throw wrongNumberOfArgs(Object.keys(arity), args.length)
  }
  for (let ii = 0; ii < args.length; ++ii) {
    let newMatching = matching.filter(schema => {
      const type = schema[ii]
      const typeCheck = types[type].check
      return typeCheck(args[ii])
    })
    if (!newMatching.length) {
      const labels = matching.map(_ => types[_[ii]].label).filter(_ => _ != null)
      throw invalidType(ii, labels, args[ii])
    }
    matching = newMatching
  }
}

function missingRequiredArg (num) {
  return newException('EMISSINGARG', 'Missing required argument #' + (num + 1))
}

function unknownType (num, type) {
  return newException('EUNKNOWNTYPE', 'Unknown type ' + type + ' in argument #' + (num + 1))
}

function invalidType (num, expectedTypes, value) {
  let valueType
  Object.keys(types).forEach(typeCode => {
    if (types[typeCode].check(value)) valueType = types[typeCode].label
  })
  return newException('EINVALIDTYPE', 'Argument #' + (num + 1) + ': Expected ' +
    englishList(expectedTypes) + ' but got ' + valueType)
}

function englishList (list) {
  return list.join(', ').replace(/, ([^,]+)$/, ' or $1')
}

function wrongNumberOfArgs (expected, got) {
  const english = englishList(expected)
  const args = expected.every(ex => ex.length === 1)
    ? 'argument'
    : 'arguments'
  return newException('EWRONGARGCOUNT', 'Expected ' + english + ' ' + args + ' but got ' + got)
}

function moreThanOneError (schema) {
  return newException('ETOOMANYERRORTYPES',
    'Only one error type per argument signature is allowed, more than one found in "' + schema + '"')
}

function newException (code, msg) {
  const err = new Error(msg)
  err.code = code
  /* istanbul ignore else */
  if (Error.captureStackTrace) Error.captureStackTrace(err, validate)
  return err
}


/***/ }),
/* 80 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var stringWidth = __webpack_require__(78)
var stripAnsi = __webpack_require__(81)

module.exports = wideTruncate

function wideTruncate (str, target) {
  if (stringWidth(str) === 0) return str
  if (target <= 0) return ''
  if (stringWidth(str) <= target) return str

  // We compute the number of bytes of ansi sequences here and add
  // that to our initial truncation to ensure that we don't slice one
  // that we want to keep in half.
  var noAnsi = stripAnsi(str)
  var ansiSize = str.length + noAnsi.length
  var truncated = str.slice(0, target + ansiSize)

  // we have to shrink the result to account for our ansi sequence buffer
  // (if an ansi sequence was truncated) and double width characters.
  while (stringWidth(truncated) > target) {
    truncated = truncated.slice(0, -1)
  }
  return truncated
}


/***/ }),
/* 81 */
/***/ ((module) => {

"use strict";
module.exports = require("strip-ansi");

/***/ }),
/* 82 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var util = __webpack_require__(66)

var User = exports.User = function User (msg) {
  var err = new Error(msg)
  Error.captureStackTrace(err, User)
  err.code = 'EGAUGE'
  return err
}

exports.MissingTemplateValue = function MissingTemplateValue (item, values) {
  var err = new User(util.format('Missing template value "%s"', item.type))
  Error.captureStackTrace(err, MissingTemplateValue)
  err.template = item
  err.values = values
  return err
}

exports.Internal = function Internal (msg) {
  var err = new Error(msg)
  Error.captureStackTrace(err, Internal)
  err.code = 'EGAUGEINTERNAL'
  return err
}


/***/ }),
/* 83 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var stringWidth = __webpack_require__(78)

module.exports = TemplateItem

function isPercent (num) {
  if (typeof num !== 'string') return false
  return num.slice(-1) === '%'
}

function percent (num) {
  return Number(num.slice(0, -1)) / 100
}

function TemplateItem (values, outputLength) {
  this.overallOutputLength = outputLength
  this.finished = false
  this.type = null
  this.value = null
  this.length = null
  this.maxLength = null
  this.minLength = null
  this.kerning = null
  this.align = 'left'
  this.padLeft = 0
  this.padRight = 0
  this.index = null
  this.first = null
  this.last = null
  if (typeof values === 'string') {
    this.value = values
  } else {
    for (var prop in values) this[prop] = values[prop]
  }
  // Realize percents
  if (isPercent(this.length)) {
    this.length = Math.round(this.overallOutputLength * percent(this.length))
  }
  if (isPercent(this.minLength)) {
    this.minLength = Math.round(this.overallOutputLength * percent(this.minLength))
  }
  if (isPercent(this.maxLength)) {
    this.maxLength = Math.round(this.overallOutputLength * percent(this.maxLength))
  }
  return this
}

TemplateItem.prototype = {}

TemplateItem.prototype.getBaseLength = function () {
  var length = this.length
  if (length == null && typeof this.value === 'string' && this.maxLength == null && this.minLength == null) {
    length = stringWidth(this.value)
  }
  return length
}

TemplateItem.prototype.getLength = function () {
  var length = this.getBaseLength()
  if (length == null) return null
  return length + this.padLeft + this.padRight
}

TemplateItem.prototype.getMaxLength = function () {
  if (this.maxLength == null) return null
  return this.maxLength + this.padLeft + this.padRight
}

TemplateItem.prototype.getMinLength = function () {
  if (this.minLength == null) return null
  return this.minLength + this.padLeft + this.padRight
}


/***/ }),
/* 84 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var os = __webpack_require__(59)

var hasUnicode = module.exports = function () {
  // Recent Win32 platforms (>XP) CAN support unicode in the console but
  // don't have to, and in non-english locales often use traditional local
  // code pages. There's no way, short of windows system calls or execing
  // the chcp command line program to figure this out. As such, we default
  // this to false and encourage your users to override it via config if
  // appropriate.
  if (os.type() == "Windows_NT") { return false }

  var isUTF8 = /UTF-?8$/i
  var ctype = process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG
  return isUTF8.test(ctype)
}


/***/ }),
/* 85 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var colorSupport = __webpack_require__(86)

module.exports = colorSupport().hasBasic


/***/ }),
/* 86 */
/***/ ((module) => {

// call it on itself so we can test the export val for basic stuff
module.exports = colorSupport({ alwaysReturn: true }, colorSupport)

function hasNone (obj, options) {
  obj.level = 0
  obj.hasBasic = false
  obj.has256 = false
  obj.has16m = false
  if (!options.alwaysReturn) {
    return false
  }
  return obj
}

function hasBasic (obj) {
  obj.hasBasic = true
  obj.has256 = false
  obj.has16m = false
  obj.level = 1
  return obj
}

function has256 (obj) {
  obj.hasBasic = true
  obj.has256 = true
  obj.has16m = false
  obj.level = 2
  return obj
}

function has16m (obj) {
  obj.hasBasic = true
  obj.has256 = true
  obj.has16m = true
  obj.level = 3
  return obj
}

function colorSupport (options, obj) {
  options = options || {}

  obj = obj || {}

  // if just requesting a specific level, then return that.
  if (typeof options.level === 'number') {
    switch (options.level) {
      case 0:
        return hasNone(obj, options)
      case 1:
        return hasBasic(obj)
      case 2:
        return has256(obj)
      case 3:
        return has16m(obj)
    }
  }

  obj.level = 0
  obj.hasBasic = false
  obj.has256 = false
  obj.has16m = false

  if (typeof process === 'undefined' ||
      !process ||
      !process.stdout ||
      !process.env ||
      !process.platform) {
    return hasNone(obj, options)
  }

  var env = options.env || process.env
  var stream = options.stream || process.stdout
  var term = options.term || env.TERM || ''
  var platform = options.platform || process.platform

  if (!options.ignoreTTY && !stream.isTTY) {
    return hasNone(obj, options)
  }

  if (!options.ignoreDumb && term === 'dumb' && !env.COLORTERM) {
    return hasNone(obj, options)
  }

  if (platform === 'win32') {
    return hasBasic(obj)
  }

  if (env.TMUX) {
    return has256(obj)
  }

  if (!options.ignoreCI && (env.CI || env.TEAMCITY_VERSION)) {
    if (env.TRAVIS) {
      return has256(obj)
    } else {
      return hasNone(obj, options)
    }
  }

  // TODO: add more term programs
  switch (env.TERM_PROGRAM) {
    case 'iTerm.app':
      var ver = env.TERM_PROGRAM_VERSION || '0.'
      if (/^[0-2]\./.test(ver)) {
        return has256(obj)
      } else {
        return has16m(obj)
      }

    case 'HyperTerm':
    case 'Hyper':
      return has16m(obj)

    case 'MacTerm':
      return has16m(obj)

    case 'Apple_Terminal':
      return has256(obj)
  }

  if (/^xterm-256/.test(term)) {
    return has256(obj)
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(term)) {
    return hasBasic(obj)
  }

  if (env.COLORTERM) {
    return hasBasic(obj)
  }

  return hasNone(obj, options)
}


/***/ }),
/* 87 */
/***/ ((module) => {

"use strict";
module.exports = require("signal-exit");

/***/ }),
/* 88 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var color = (__webpack_require__(75).color)
var ThemeSet = __webpack_require__(89)

var themes = module.exports = new ThemeSet()

themes.addTheme('ASCII', {
  preProgressbar: '[',
  postProgressbar: ']',
  progressbarTheme: {
    complete: '#',
    remaining: '.'
  },
  activityIndicatorTheme: '-\\|/',
  preSubsection: '>'
})

themes.addTheme('colorASCII', themes.getTheme('ASCII'), {
  progressbarTheme: {
    preComplete: color('bgBrightWhite', 'brightWhite'),
    complete: '#',
    postComplete: color('reset'),
    preRemaining: color('bgBrightBlack', 'brightBlack'),
    remaining: '.',
    postRemaining: color('reset')
  }
})

themes.addTheme('brailleSpinner', {
  preProgressbar: '⸨',
  postProgressbar: '⸩',
  progressbarTheme: {
    complete: '#',
    remaining: '⠂'
  },
  activityIndicatorTheme: '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏',
  preSubsection: '>'
})

themes.addTheme('colorBrailleSpinner', themes.getTheme('brailleSpinner'), {
  progressbarTheme: {
    preComplete: color('bgBrightWhite', 'brightWhite'),
    complete: '#',
    postComplete: color('reset'),
    preRemaining: color('bgBrightBlack', 'brightBlack'),
    remaining: '⠂',
    postRemaining: color('reset')
  }
})

themes.setDefault({}, 'ASCII')
themes.setDefault({hasColor: true}, 'colorASCII')
themes.setDefault({platform: 'darwin', hasUnicode: true}, 'brailleSpinner')
themes.setDefault({platform: 'darwin', hasUnicode: true, hasColor: true}, 'colorBrailleSpinner')
themes.setDefault({platform: 'linux', hasUnicode: true}, 'brailleSpinner')
themes.setDefault({platform: 'linux', hasUnicode: true, hasColor: true}, 'colorBrailleSpinner')


/***/ }),
/* 89 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var objectAssign = __webpack_require__(90)

module.exports = function () {
  return ThemeSetProto.newThemeSet()
}

var ThemeSetProto = {}

ThemeSetProto.baseTheme = __webpack_require__(91)

ThemeSetProto.newTheme = function (parent, theme) {
  if (!theme) {
    theme = parent
    parent = this.baseTheme
  }
  return objectAssign({}, parent, theme)
}

ThemeSetProto.getThemeNames = function () {
  return Object.keys(this.themes)
}

ThemeSetProto.addTheme = function (name, parent, theme) {
  this.themes[name] = this.newTheme(parent, theme)
}

ThemeSetProto.addToAllThemes = function (theme) {
  var themes = this.themes
  Object.keys(themes).forEach(function (name) {
    objectAssign(themes[name], theme)
  })
  objectAssign(this.baseTheme, theme)
}

ThemeSetProto.getTheme = function (name) {
  if (!this.themes[name]) throw this.newMissingThemeError(name)
  return this.themes[name]
}

ThemeSetProto.setDefault = function (opts, name) {
  if (name == null) {
    name = opts
    opts = {}
  }
  var platform = opts.platform == null ? 'fallback' : opts.platform
  var hasUnicode = !!opts.hasUnicode
  var hasColor = !!opts.hasColor
  if (!this.defaults[platform]) this.defaults[platform] = {true: {}, false: {}}
  this.defaults[platform][hasUnicode][hasColor] = name
}

ThemeSetProto.getDefault = function (opts) {
  if (!opts) opts = {}
  var platformName = opts.platform || process.platform
  var platform = this.defaults[platformName] || this.defaults.fallback
  var hasUnicode = !!opts.hasUnicode
  var hasColor = !!opts.hasColor
  if (!platform) throw this.newMissingDefaultThemeError(platformName, hasUnicode, hasColor)
  if (!platform[hasUnicode][hasColor]) {
    if (hasUnicode && hasColor && platform[!hasUnicode][hasColor]) {
      hasUnicode = false
    } else if (hasUnicode && hasColor && platform[hasUnicode][!hasColor]) {
      hasColor = false
    } else if (hasUnicode && hasColor && platform[!hasUnicode][!hasColor]) {
      hasUnicode = false
      hasColor = false
    } else if (hasUnicode && !hasColor && platform[!hasUnicode][hasColor]) {
      hasUnicode = false
    } else if (!hasUnicode && hasColor && platform[hasUnicode][!hasColor]) {
      hasColor = false
    } else if (platform === this.defaults.fallback) {
      throw this.newMissingDefaultThemeError(platformName, hasUnicode, hasColor)
    }
  }
  if (platform[hasUnicode][hasColor]) {
    return this.getTheme(platform[hasUnicode][hasColor])
  } else {
    return this.getDefault(objectAssign({}, opts, {platform: 'fallback'}))
  }
}

ThemeSetProto.newMissingThemeError = function newMissingThemeError (name) {
  var err = new Error('Could not find a gauge theme named "' + name + '"')
  Error.captureStackTrace.call(err, newMissingThemeError)
  err.theme = name
  err.code = 'EMISSINGTHEME'
  return err
}

ThemeSetProto.newMissingDefaultThemeError = function newMissingDefaultThemeError (platformName, hasUnicode, hasColor) {
  var err = new Error(
    'Could not find a gauge theme for your platform/unicode/color use combo:\n' +
    '    platform = ' + platformName + '\n' +
    '    hasUnicode = ' + hasUnicode + '\n' +
    '    hasColor = ' + hasColor)
  Error.captureStackTrace.call(err, newMissingDefaultThemeError)
  err.platform = platformName
  err.hasUnicode = hasUnicode
  err.hasColor = hasColor
  err.code = 'EMISSINGTHEME'
  return err
}

ThemeSetProto.newThemeSet = function () {
  var themeset = function (opts) {
    return themeset.getDefault(opts)
  }
  return objectAssign(themeset, ThemeSetProto, {
    themes: objectAssign({}, this.themes),
    baseTheme: objectAssign({}, this.baseTheme),
    defaults: JSON.parse(JSON.stringify(this.defaults || {}))
  })
}


/***/ }),
/* 90 */
/***/ ((module) => {

"use strict";
module.exports = require("object-assign");

/***/ }),
/* 91 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var spin = __webpack_require__(92)
var progressBar = __webpack_require__(93)

module.exports = {
  activityIndicator: function (values, theme, width) {
    if (values.spun == null) return
    return spin(theme, values.spun)
  },
  progressbar: function (values, theme, width) {
    if (values.completed == null) return
    return progressBar(theme, width, values.completed)
  }
}


/***/ }),
/* 92 */
/***/ ((module) => {

"use strict";


module.exports = function spin (spinstr, spun) {
  return spinstr[spun % spinstr.length]
}


/***/ }),
/* 93 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var validate = __webpack_require__(79)
var renderTemplate = __webpack_require__(76)
var wideTruncate = __webpack_require__(80)
var stringWidth = __webpack_require__(78)

module.exports = function (theme, width, completed) {
  validate('ONN', [theme, width, completed])
  if (completed < 0) completed = 0
  if (completed > 1) completed = 1
  if (width <= 0) return ''
  var sofar = Math.round(width * completed)
  var rest = width - sofar
  var template = [
    {type: 'complete', value: repeat(theme.complete, sofar), length: sofar},
    {type: 'remaining', value: repeat(theme.remaining, rest), length: rest}
  ]
  return renderTemplate(width, template, theme)
}

// lodash's way of repeating
function repeat (string, width) {
  var result = ''
  var n = width
  do {
    if (n % 2) {
      result += string
    }
    n = Math.floor(n / 2)
    /* eslint no-self-assign: 0 */
    string += string
  } while (n && stringWidth(result) < width)

  return wideTruncate(result, width)
}


/***/ }),
/* 94 */
/***/ ((module) => {

"use strict";

// this exists so we can replace it during testing
module.exports = setInterval


/***/ }),
/* 95 */
/***/ ((module) => {

"use strict";

// this exists so we can replace it during testing
module.exports = process


/***/ }),
/* 96 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var process = __webpack_require__(95)
try {
  module.exports = setImmediate
} catch (ex) {
  module.exports = process.nextTick
}


/***/ }),
/* 97 */
/***/ ((module) => {

module.exports = function (blocking) {
  [process.stdout, process.stderr].forEach(function (stream) {
    if (stream._handle && stream.isTTY && typeof stream._handle.setBlocking === 'function') {
      stream._handle.setBlocking(blocking)
    }
  })
}


/***/ }),
/* 98 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


const fs = __webpack_require__(57);

module.exports = exports;

const versionArray = process.version
  .substr(1)
  .replace(/-.*$/, '')
  .split('.')
  .map((item) => {
    return +item;
  });

const napi_multiple_commands = [
  'build',
  'clean',
  'configure',
  'package',
  'publish',
  'reveal',
  'testbinary',
  'testpackage',
  'unpublish'
];

const napi_build_version_tag = 'napi_build_version=';

module.exports.get_napi_version = function() {
  // returns the non-zero numeric napi version or undefined if napi is not supported.
  // correctly supporting target requires an updated cross-walk
  let version = process.versions.napi; // can be undefined
  if (!version) { // this code should never need to be updated
    if (versionArray[0] === 9 && versionArray[1] >= 3) version = 2; // 9.3.0+
    else if (versionArray[0] === 8) version = 1; // 8.0.0+
  }
  return version;
};

module.exports.get_napi_version_as_string = function(target) {
  // returns the napi version as a string or an empty string if napi is not supported.
  const version = module.exports.get_napi_version(target);
  return version ? '' + version : '';
};

module.exports.validate_package_json = function(package_json, opts) { // throws Error

  const binary = package_json.binary;
  const module_path_ok = pathOK(binary.module_path);
  const remote_path_ok = pathOK(binary.remote_path);
  const package_name_ok = pathOK(binary.package_name);
  const napi_build_versions = module.exports.get_napi_build_versions(package_json, opts, true);
  const napi_build_versions_raw = module.exports.get_napi_build_versions_raw(package_json);

  if (napi_build_versions) {
    napi_build_versions.forEach((napi_build_version)=> {
      if (!(parseInt(napi_build_version, 10) === napi_build_version && napi_build_version > 0)) {
        throw new Error('All values specified in napi_versions must be positive integers.');
      }
    });
  }

  if (napi_build_versions && (!module_path_ok || (!remote_path_ok && !package_name_ok))) {
    throw new Error('When napi_versions is specified; module_path and either remote_path or ' +
			"package_name must contain the substitution string '{napi_build_version}`.");
  }

  if ((module_path_ok || remote_path_ok || package_name_ok) && !napi_build_versions_raw) {
    throw new Error("When the substitution string '{napi_build_version}` is specified in " +
			'module_path, remote_path, or package_name; napi_versions must also be specified.');
  }

  if (napi_build_versions && !module.exports.get_best_napi_build_version(package_json, opts) &&
	module.exports.build_napi_only(package_json)) {
    throw new Error(
      'The Node-API version of this Node instance is ' + module.exports.get_napi_version(opts ? opts.target : undefined) + '. ' +
			'This module supports Node-API version(s) ' + module.exports.get_napi_build_versions_raw(package_json) + '. ' +
			'This Node instance cannot run this module.');
  }

  if (napi_build_versions_raw && !napi_build_versions && module.exports.build_napi_only(package_json)) {
    throw new Error(
      'The Node-API version of this Node instance is ' + module.exports.get_napi_version(opts ? opts.target : undefined) + '. ' +
			'This module supports Node-API version(s) ' + module.exports.get_napi_build_versions_raw(package_json) + '. ' +
			'This Node instance cannot run this module.');
  }

};

function pathOK(path) {
  return path && (path.indexOf('{napi_build_version}') !== -1 || path.indexOf('{node_napi_label}') !== -1);
}

module.exports.expand_commands = function(package_json, opts, commands) {
  const expanded_commands = [];
  const napi_build_versions = module.exports.get_napi_build_versions(package_json, opts);
  commands.forEach((command)=> {
    if (napi_build_versions && command.name === 'install') {
      const napi_build_version = module.exports.get_best_napi_build_version(package_json, opts);
      const args = napi_build_version ? [napi_build_version_tag + napi_build_version] : [];
      expanded_commands.push({ name: command.name, args: args });
    } else if (napi_build_versions && napi_multiple_commands.indexOf(command.name) !== -1) {
      napi_build_versions.forEach((napi_build_version)=> {
        const args = command.args.slice();
        args.push(napi_build_version_tag + napi_build_version);
        expanded_commands.push({ name: command.name, args: args });
      });
    } else {
      expanded_commands.push(command);
    }
  });
  return expanded_commands;
};

module.exports.get_napi_build_versions = function(package_json, opts, warnings) { // opts may be undefined
  const log = __webpack_require__(63);
  let napi_build_versions = [];
  const supported_napi_version = module.exports.get_napi_version(opts ? opts.target : undefined);
  // remove duplicates, verify each napi version can actaully be built
  if (package_json.binary && package_json.binary.napi_versions) {
    package_json.binary.napi_versions.forEach((napi_version) => {
      const duplicated = napi_build_versions.indexOf(napi_version) !== -1;
      if (!duplicated && supported_napi_version && napi_version <= supported_napi_version) {
        napi_build_versions.push(napi_version);
      } else if (warnings && !duplicated && supported_napi_version) {
        log.info('This Node instance does not support builds for Node-API version', napi_version);
      }
    });
  }
  if (opts && opts['build-latest-napi-version-only']) {
    let latest_version = 0;
    napi_build_versions.forEach((napi_version) => {
      if (napi_version > latest_version) latest_version = napi_version;
    });
    napi_build_versions = latest_version ? [latest_version] : [];
  }
  return napi_build_versions.length ? napi_build_versions : undefined;
};

module.exports.get_napi_build_versions_raw = function(package_json) {
  const napi_build_versions = [];
  // remove duplicates
  if (package_json.binary && package_json.binary.napi_versions) {
    package_json.binary.napi_versions.forEach((napi_version) => {
      if (napi_build_versions.indexOf(napi_version) === -1) {
        napi_build_versions.push(napi_version);
      }
    });
  }
  return napi_build_versions.length ? napi_build_versions : undefined;
};

module.exports.get_command_arg = function(napi_build_version) {
  return napi_build_version_tag + napi_build_version;
};

module.exports.get_napi_build_version_from_command_args = function(command_args) {
  for (let i = 0; i < command_args.length; i++) {
    const arg = command_args[i];
    if (arg.indexOf(napi_build_version_tag) === 0) {
      return parseInt(arg.substr(napi_build_version_tag.length), 10);
    }
  }
  return undefined;
};

module.exports.swap_build_dir_out = function(napi_build_version) {
  if (napi_build_version) {
    const rm = __webpack_require__(99);
    rm.sync(module.exports.get_build_dir(napi_build_version));
    fs.renameSync('build', module.exports.get_build_dir(napi_build_version));
  }
};

module.exports.swap_build_dir_in = function(napi_build_version) {
  if (napi_build_version) {
    const rm = __webpack_require__(99);
    rm.sync('build');
    fs.renameSync(module.exports.get_build_dir(napi_build_version), 'build');
  }
};

module.exports.get_build_dir = function(napi_build_version) {
  return 'build-tmp-napi-v' + napi_build_version;
};

module.exports.get_best_napi_build_version = function(package_json, opts) {
  let best_napi_build_version = 0;
  const napi_build_versions = module.exports.get_napi_build_versions(package_json, opts);
  if (napi_build_versions) {
    const our_napi_version = module.exports.get_napi_version(opts ? opts.target : undefined);
    napi_build_versions.forEach((napi_build_version)=> {
      if (napi_build_version > best_napi_build_version &&
				napi_build_version <= our_napi_version) {
        best_napi_build_version = napi_build_version;
      }
    });
  }
  return best_napi_build_version === 0 ? undefined : best_napi_build_version;
};

module.exports.build_napi_only = function(package_json) {
  return package_json.binary && package_json.binary.package_name &&
	package_json.binary.package_name.indexOf('{node_napi_label}') === -1;
};


/***/ }),
/* 99 */
/***/ ((module) => {

"use strict";
module.exports = require("rimraf");

/***/ }),
/* 100 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


const npg = __webpack_require__(54);
const versioning = __webpack_require__(101);
const napi = __webpack_require__(98);
const existsSync = (__webpack_require__(57).existsSync) || (__webpack_require__(58).existsSync);
const path = __webpack_require__(58);

module.exports = exports;

exports.usage = 'Finds the require path for the node-pre-gyp installed module';

exports.validate = function(package_json, opts) {
  versioning.validate_config(package_json, opts);
};

exports.find = function(package_json_path, opts) {
  if (!existsSync(package_json_path)) {
    throw new Error(package_json_path + 'does not exist');
  }
  const prog = new npg.Run({ package_json_path, argv: process.argv });
  prog.setBinaryHostProperty();
  const package_json = prog.package_json;

  versioning.validate_config(package_json, opts);
  let napi_build_version;
  if (napi.get_napi_build_versions(package_json, opts)) {
    napi_build_version = napi.get_best_napi_build_version(package_json, opts);
  }
  opts = opts || {};
  if (!opts.module_root) opts.module_root = path.dirname(package_json_path);
  const meta = versioning.evaluate(package_json, opts, napi_build_version);
  return meta.module;
};


/***/ }),
/* 101 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports;

const path = __webpack_require__(58);
const semver = __webpack_require__(102);
const url = __webpack_require__(56);
const detect_libc = __webpack_require__(103);
const napi = __webpack_require__(98);

let abi_crosswalk;

// This is used for unit testing to provide a fake
// ABI crosswalk that emulates one that is not updated
// for the current version
if (process.env.NODE_PRE_GYP_ABI_CROSSWALK) {
  abi_crosswalk = __webpack_require__(106)(process.env.NODE_PRE_GYP_ABI_CROSSWALK);
} else {
  abi_crosswalk = __webpack_require__(107);
}

const major_versions = {};
Object.keys(abi_crosswalk).forEach((v) => {
  const major = v.split('.')[0];
  if (!major_versions[major]) {
    major_versions[major] = v;
  }
});

function get_electron_abi(runtime, target_version) {
  if (!runtime) {
    throw new Error('get_electron_abi requires valid runtime arg');
  }
  if (typeof target_version === 'undefined') {
    // erroneous CLI call
    throw new Error('Empty target version is not supported if electron is the target.');
  }
  // Electron guarantees that patch version update won't break native modules.
  const sem_ver = semver.parse(target_version);
  return runtime + '-v' + sem_ver.major + '.' + sem_ver.minor;
}
module.exports.get_electron_abi = get_electron_abi;

function get_node_webkit_abi(runtime, target_version) {
  if (!runtime) {
    throw new Error('get_node_webkit_abi requires valid runtime arg');
  }
  if (typeof target_version === 'undefined') {
    // erroneous CLI call
    throw new Error('Empty target version is not supported if node-webkit is the target.');
  }
  return runtime + '-v' + target_version;
}
module.exports.get_node_webkit_abi = get_node_webkit_abi;

function get_node_abi(runtime, versions) {
  if (!runtime) {
    throw new Error('get_node_abi requires valid runtime arg');
  }
  if (!versions) {
    throw new Error('get_node_abi requires valid process.versions object');
  }
  const sem_ver = semver.parse(versions.node);
  if (sem_ver.major === 0 && sem_ver.minor % 2) { // odd series
    // https://github.com/mapbox/node-pre-gyp/issues/124
    return runtime + '-v' + versions.node;
  } else {
    // process.versions.modules added in >= v0.10.4 and v0.11.7
    // https://github.com/joyent/node/commit/ccabd4a6fa8a6eb79d29bc3bbe9fe2b6531c2d8e
    return versions.modules ? runtime + '-v' + (+versions.modules) :
      'v8-' + versions.v8.split('.').slice(0, 2).join('.');
  }
}
module.exports.get_node_abi = get_node_abi;

function get_runtime_abi(runtime, target_version) {
  if (!runtime) {
    throw new Error('get_runtime_abi requires valid runtime arg');
  }
  if (runtime === 'node-webkit') {
    return get_node_webkit_abi(runtime, target_version || process.versions['node-webkit']);
  } else if (runtime === 'electron') {
    return get_electron_abi(runtime, target_version || process.versions.electron);
  } else {
    if (runtime !== 'node') {
      throw new Error("Unknown Runtime: '" + runtime + "'");
    }
    if (!target_version) {
      return get_node_abi(runtime, process.versions);
    } else {
      let cross_obj;
      // abi_crosswalk generated with ./scripts/abi_crosswalk.js
      if (abi_crosswalk[target_version]) {
        cross_obj = abi_crosswalk[target_version];
      } else {
        const target_parts = target_version.split('.').map((i) => { return +i; });
        if (target_parts.length !== 3) { // parse failed
          throw new Error('Unknown target version: ' + target_version);
        }
        /*
                    The below code tries to infer the last known ABI compatible version
                    that we have recorded in the abi_crosswalk.json when an exact match
                    is not possible. The reasons for this to exist are complicated:

                       - We support passing --target to be able to allow developers to package binaries for versions of node
                         that are not the same one as they are running. This might also be used in combination with the
                         --target_arch or --target_platform flags to also package binaries for alternative platforms
                       - When --target is passed we can't therefore determine the ABI (process.versions.modules) from the node
                         version that is running in memory
                       - So, therefore node-pre-gyp keeps an "ABI crosswalk" (lib/util/abi_crosswalk.json) to be able to look
                         this info up for all versions
                       - But we cannot easily predict what the future ABI will be for released versions
                       - And node-pre-gyp needs to be a `bundledDependency` in apps that depend on it in order to work correctly
                         by being fully available at install time.
                       - So, the speed of node releases and the bundled nature of node-pre-gyp mean that a new node-pre-gyp release
                         need to happen for every node.js/io.js/node-webkit/nw.js/atom-shell/etc release that might come online if
                         you want the `--target` flag to keep working for the latest version
                       - Which is impractical ^^
                       - Hence the below code guesses about future ABI to make the need to update node-pre-gyp less demanding.

                    In practice then you can have a dependency of your app like `node-sqlite3` that bundles a `node-pre-gyp` that
                    only knows about node v0.10.33 in the `abi_crosswalk.json` but target node v0.10.34 (which is assumed to be
                    ABI compatible with v0.10.33).

                    TODO: use semver module instead of custom version parsing
                */
        const major = target_parts[0];
        let minor = target_parts[1];
        let patch = target_parts[2];
        // io.js: yeah if node.js ever releases 1.x this will break
        // but that is unlikely to happen: https://github.com/iojs/io.js/pull/253#issuecomment-69432616
        if (major === 1) {
          // look for last release that is the same major version
          // e.g. we assume io.js 1.x is ABI compatible with >= 1.0.0
          while (true) {
            if (minor > 0) --minor;
            if (patch > 0) --patch;
            const new_iojs_target = '' + major + '.' + minor + '.' + patch;
            if (abi_crosswalk[new_iojs_target]) {
              cross_obj = abi_crosswalk[new_iojs_target];
              console.log('Warning: node-pre-gyp could not find exact match for ' + target_version);
              console.log('Warning: but node-pre-gyp successfully choose ' + new_iojs_target + ' as ABI compatible target');
              break;
            }
            if (minor === 0 && patch === 0) {
              break;
            }
          }
        } else if (major >= 2) {
          // look for last release that is the same major version
          if (major_versions[major]) {
            cross_obj = abi_crosswalk[major_versions[major]];
            console.log('Warning: node-pre-gyp could not find exact match for ' + target_version);
            console.log('Warning: but node-pre-gyp successfully choose ' + major_versions[major] + ' as ABI compatible target');
          }
        } else if (major === 0) { // node.js
          if (target_parts[1] % 2 === 0) { // for stable/even node.js series
            // look for the last release that is the same minor release
            // e.g. we assume node 0.10.x is ABI compatible with >= 0.10.0
            while (--patch > 0) {
              const new_node_target = '' + major + '.' + minor + '.' + patch;
              if (abi_crosswalk[new_node_target]) {
                cross_obj = abi_crosswalk[new_node_target];
                console.log('Warning: node-pre-gyp could not find exact match for ' + target_version);
                console.log('Warning: but node-pre-gyp successfully choose ' + new_node_target + ' as ABI compatible target');
                break;
              }
            }
          }
        }
      }
      if (!cross_obj) {
        throw new Error('Unsupported target version: ' + target_version);
      }
      // emulate process.versions
      const versions_obj = {
        node: target_version,
        v8: cross_obj.v8 + '.0',
        // abi_crosswalk uses 1 for node versions lacking process.versions.modules
        // process.versions.modules added in >= v0.10.4 and v0.11.7
        modules: cross_obj.node_abi > 1 ? cross_obj.node_abi : undefined
      };
      return get_node_abi(runtime, versions_obj);
    }
  }
}
module.exports.get_runtime_abi = get_runtime_abi;

const required_parameters = [
  'module_name',
  'module_path',
  'host'
];

function validate_config(package_json, opts) {
  const msg = package_json.name + ' package.json is not node-pre-gyp ready:\n';
  const missing = [];
  if (!package_json.main) {
    missing.push('main');
  }
  if (!package_json.version) {
    missing.push('version');
  }
  if (!package_json.name) {
    missing.push('name');
  }
  if (!package_json.binary) {
    missing.push('binary');
  }
  const o = package_json.binary;
  if (o) {
    required_parameters.forEach((p) => {
      if (!o[p] || typeof o[p] !== 'string') {
        missing.push('binary.' + p);
      }
    });
  }

  if (missing.length >= 1) {
    throw new Error(msg + 'package.json must declare these properties: \n' + missing.join('\n'));
  }
  if (o) {
    // enforce https over http
    const protocol = url.parse(o.host).protocol;
    if (protocol === 'http:') {
      throw new Error("'host' protocol (" + protocol + ") is invalid - only 'https:' is accepted");
    }
  }
  napi.validate_package_json(package_json, opts);
}

module.exports.validate_config = validate_config;

function eval_template(template, opts) {
  Object.keys(opts).forEach((key) => {
    const pattern = '{' + key + '}';
    while (template.indexOf(pattern) > -1) {
      template = template.replace(pattern, opts[key]);
    }
  });
  return template;
}

// url.resolve needs single trailing slash
// to behave correctly, otherwise a double slash
// may end up in the url which breaks requests
// and a lacking slash may not lead to proper joining
function fix_slashes(pathname) {
  if (pathname.slice(-1) !== '/') {
    return pathname + '/';
  }
  return pathname;
}

// remove double slashes
// note: path.normalize will not work because
// it will convert forward to back slashes
function drop_double_slashes(pathname) {
  return pathname.replace(/\/\//g, '/');
}

function get_process_runtime(versions) {
  let runtime = 'node';
  if (versions['node-webkit']) {
    runtime = 'node-webkit';
  } else if (versions.electron) {
    runtime = 'electron';
  }
  return runtime;
}

module.exports.get_process_runtime = get_process_runtime;

const default_package_name = '{module_name}-v{version}-{node_abi}-{platform}-{arch}.tar.gz';
const default_remote_path = '';

module.exports.evaluate = function(package_json, options, napi_build_version) {
  options = options || {};
  validate_config(package_json, options); // options is a suitable substitute for opts in this case
  const v = package_json.version;
  const module_version = semver.parse(v);
  const runtime = options.runtime || get_process_runtime(process.versions);
  const opts = {
    name: package_json.name,
    configuration: options.debug ? 'Debug' : 'Release',
    debug: options.debug,
    module_name: package_json.binary.module_name,
    version: module_version.version,
    prerelease: module_version.prerelease.length ? module_version.prerelease.join('.') : '',
    build: module_version.build.length ? module_version.build.join('.') : '',
    major: module_version.major,
    minor: module_version.minor,
    patch: module_version.patch,
    runtime: runtime,
    node_abi: get_runtime_abi(runtime, options.target),
    node_abi_napi: napi.get_napi_version(options.target) ? 'napi' : get_runtime_abi(runtime, options.target),
    napi_version: napi.get_napi_version(options.target), // non-zero numeric, undefined if unsupported
    napi_build_version: napi_build_version || '',
    node_napi_label: napi_build_version ? 'napi-v' + napi_build_version : get_runtime_abi(runtime, options.target),
    target: options.target || '',
    platform: options.target_platform || process.platform,
    target_platform: options.target_platform || process.platform,
    arch: options.target_arch || process.arch,
    target_arch: options.target_arch || process.arch,
    libc: options.target_libc || detect_libc.familySync() || 'unknown',
    module_main: package_json.main,
    toolset: options.toolset || '', // address https://github.com/mapbox/node-pre-gyp/issues/119
    bucket: package_json.binary.bucket,
    region: package_json.binary.region,
    s3ForcePathStyle: package_json.binary.s3ForcePathStyle || false
  };
    // support host mirror with npm config `--{module_name}_binary_host_mirror`
    // e.g.: https://github.com/node-inspector/v8-profiler/blob/master/package.json#L25
    // > npm install v8-profiler --profiler_binary_host_mirror=https://npm.taobao.org/mirrors/node-inspector/
  const validModuleName = opts.module_name.replace('-', '_');
  const host = process.env['npm_config_' + validModuleName + '_binary_host_mirror'] || package_json.binary.host;
  opts.host = fix_slashes(eval_template(host, opts));
  opts.module_path = eval_template(package_json.binary.module_path, opts);
  // now we resolve the module_path to ensure it is absolute so that binding.gyp variables work predictably
  if (options.module_root) {
    // resolve relative to known module root: works for pre-binding require
    opts.module_path = path.join(options.module_root, opts.module_path);
  } else {
    // resolve relative to current working directory: works for node-pre-gyp commands
    opts.module_path = path.resolve(opts.module_path);
  }
  opts.module = path.join(opts.module_path, opts.module_name + '.node');
  opts.remote_path = package_json.binary.remote_path ? drop_double_slashes(fix_slashes(eval_template(package_json.binary.remote_path, opts))) : default_remote_path;
  const package_name = package_json.binary.package_name ? package_json.binary.package_name : default_package_name;
  opts.package_name = eval_template(package_name, opts);
  opts.staged_tarball = path.join('build/stage', opts.remote_path, opts.package_name);
  opts.hosted_path = url.resolve(opts.host, opts.remote_path);
  opts.hosted_tarball = url.resolve(opts.hosted_path, opts.package_name);
  return opts;
};


/***/ }),
/* 102 */
/***/ ((module) => {

"use strict";
module.exports = require("semver");

/***/ }),
/* 103 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const childProcess = __webpack_require__(104);
const { isLinux, getReport } = __webpack_require__(105);

const command = 'getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true';
let commandOut = '';

const safeCommand = () => {
  if (!commandOut) {
    return new Promise((resolve) => {
      childProcess.exec(command, (err, out) => {
        commandOut = err ? ' ' : out;
        resolve(commandOut);
      });
    });
  }
  return commandOut;
};

const safeCommandSync = () => {
  if (!commandOut) {
    try {
      commandOut = childProcess.execSync(command, { encoding: 'utf8' });
    } catch (_err) {
      commandOut = ' ';
    }
  }
  return commandOut;
};

/**
 * A String constant containing the value `glibc`.
 * @type {string}
 * @public
 */
const GLIBC = 'glibc';

/**
 * A String constant containing the value `musl`.
 * @type {string}
 * @public
 */
const MUSL = 'musl';

const isFileMusl = (f) => f.includes('libc.musl-') || f.includes('ld-musl-');

const familyFromReport = () => {
  const report = getReport();
  if (report.header && report.header.glibcVersionRuntime) {
    return GLIBC;
  }
  if (Array.isArray(report.sharedObjects)) {
    if (report.sharedObjects.some(isFileMusl)) {
      return MUSL;
    }
  }
  return null;
};

const familyFromCommand = (out) => {
  const [getconf, ldd1] = out.split(/[\r\n]+/);
  if (getconf && getconf.includes(GLIBC)) {
    return GLIBC;
  }
  if (ldd1 && ldd1.includes(MUSL)) {
    return MUSL;
  }
  return null;
};

/**
 * Resolves with the libc family when it can be determined, `null` otherwise.
 * @returns {Promise<?string>}
 */
const family = async () => {
  let family = null;
  if (isLinux()) {
    family = familyFromReport();
    if (!family) {
      const out = await safeCommand();
      family = familyFromCommand(out);
    }
  }
  return family;
};

/**
 * Returns the libc family when it can be determined, `null` otherwise.
 * @returns {?string}
 */
const familySync = () => {
  let family = null;
  if (isLinux()) {
    family = familyFromReport();
    if (!family) {
      const out = safeCommandSync();
      family = familyFromCommand(out);
    }
  }
  return family;
};

/**
 * Resolves `true` only when the platform is Linux and the libc family is not `glibc`.
 * @returns {Promise<boolean>}
 */
const isNonGlibcLinux = async () => isLinux() && await family() !== GLIBC;

/**
 * Returns `true` only when the platform is Linux and the libc family is not `glibc`.
 * @returns {boolean}
 */
const isNonGlibcLinuxSync = () => isLinux() && familySync() !== GLIBC;

const versionFromReport = () => {
  const report = getReport();
  if (report.header && report.header.glibcVersionRuntime) {
    return report.header.glibcVersionRuntime;
  }
  return null;
};

const versionSuffix = (s) => s.trim().split(/\s+/)[1];

const versionFromCommand = (out) => {
  const [getconf, ldd1, ldd2] = out.split(/[\r\n]+/);
  if (getconf && getconf.includes(GLIBC)) {
    return versionSuffix(getconf);
  }
  if (ldd1 && ldd2 && ldd1.includes(MUSL)) {
    return versionSuffix(ldd2);
  }
  return null;
};

/**
 * Resolves with the libc version when it can be determined, `null` otherwise.
 * @returns {Promise<?string>}
 */
const version = async () => {
  let version = null;
  if (isLinux()) {
    version = versionFromReport();
    if (!version) {
      const out = await safeCommand();
      version = versionFromCommand(out);
    }
  }
  return version;
};

/**
 * Returns the libc version when it can be determined, `null` otherwise.
 * @returns {?string}
 */
const versionSync = () => {
  let version = null;
  if (isLinux()) {
    version = versionFromReport();
    if (!version) {
      const out = safeCommandSync();
      version = versionFromCommand(out);
    }
  }
  return version;
};

module.exports = {
  GLIBC,
  MUSL,
  family,
  familySync,
  isNonGlibcLinux,
  isNonGlibcLinuxSync,
  version,
  versionSync
};


/***/ }),
/* 104 */
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),
/* 105 */
/***/ ((module) => {

"use strict";


const isLinux = () => process.platform === 'linux';

let report = null;
const getReport = () => {
  if (!report) {
    /* istanbul ignore next */
    report = isLinux() && process.report
      ? process.report.getReport()
      : {};
  }
  return report;
};

module.exports = { isLinux, getReport };


/***/ }),
/* 106 */
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 106;
module.exports = webpackEmptyContext;

/***/ }),
/* 107 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"0.1.14":{"node_abi":null,"v8":"1.3"},"0.1.15":{"node_abi":null,"v8":"1.3"},"0.1.16":{"node_abi":null,"v8":"1.3"},"0.1.17":{"node_abi":null,"v8":"1.3"},"0.1.18":{"node_abi":null,"v8":"1.3"},"0.1.19":{"node_abi":null,"v8":"2.0"},"0.1.20":{"node_abi":null,"v8":"2.0"},"0.1.21":{"node_abi":null,"v8":"2.0"},"0.1.22":{"node_abi":null,"v8":"2.0"},"0.1.23":{"node_abi":null,"v8":"2.0"},"0.1.24":{"node_abi":null,"v8":"2.0"},"0.1.25":{"node_abi":null,"v8":"2.0"},"0.1.26":{"node_abi":null,"v8":"2.0"},"0.1.27":{"node_abi":null,"v8":"2.1"},"0.1.28":{"node_abi":null,"v8":"2.1"},"0.1.29":{"node_abi":null,"v8":"2.1"},"0.1.30":{"node_abi":null,"v8":"2.1"},"0.1.31":{"node_abi":null,"v8":"2.1"},"0.1.32":{"node_abi":null,"v8":"2.1"},"0.1.33":{"node_abi":null,"v8":"2.1"},"0.1.90":{"node_abi":null,"v8":"2.2"},"0.1.91":{"node_abi":null,"v8":"2.2"},"0.1.92":{"node_abi":null,"v8":"2.2"},"0.1.93":{"node_abi":null,"v8":"2.2"},"0.1.94":{"node_abi":null,"v8":"2.2"},"0.1.95":{"node_abi":null,"v8":"2.2"},"0.1.96":{"node_abi":null,"v8":"2.2"},"0.1.97":{"node_abi":null,"v8":"2.2"},"0.1.98":{"node_abi":null,"v8":"2.2"},"0.1.99":{"node_abi":null,"v8":"2.2"},"0.1.100":{"node_abi":null,"v8":"2.2"},"0.1.101":{"node_abi":null,"v8":"2.3"},"0.1.102":{"node_abi":null,"v8":"2.3"},"0.1.103":{"node_abi":null,"v8":"2.3"},"0.1.104":{"node_abi":null,"v8":"2.3"},"0.2.0":{"node_abi":1,"v8":"2.3"},"0.2.1":{"node_abi":1,"v8":"2.3"},"0.2.2":{"node_abi":1,"v8":"2.3"},"0.2.3":{"node_abi":1,"v8":"2.3"},"0.2.4":{"node_abi":1,"v8":"2.3"},"0.2.5":{"node_abi":1,"v8":"2.3"},"0.2.6":{"node_abi":1,"v8":"2.3"},"0.3.0":{"node_abi":1,"v8":"2.5"},"0.3.1":{"node_abi":1,"v8":"2.5"},"0.3.2":{"node_abi":1,"v8":"3.0"},"0.3.3":{"node_abi":1,"v8":"3.0"},"0.3.4":{"node_abi":1,"v8":"3.0"},"0.3.5":{"node_abi":1,"v8":"3.0"},"0.3.6":{"node_abi":1,"v8":"3.0"},"0.3.7":{"node_abi":1,"v8":"3.0"},"0.3.8":{"node_abi":1,"v8":"3.1"},"0.4.0":{"node_abi":1,"v8":"3.1"},"0.4.1":{"node_abi":1,"v8":"3.1"},"0.4.2":{"node_abi":1,"v8":"3.1"},"0.4.3":{"node_abi":1,"v8":"3.1"},"0.4.4":{"node_abi":1,"v8":"3.1"},"0.4.5":{"node_abi":1,"v8":"3.1"},"0.4.6":{"node_abi":1,"v8":"3.1"},"0.4.7":{"node_abi":1,"v8":"3.1"},"0.4.8":{"node_abi":1,"v8":"3.1"},"0.4.9":{"node_abi":1,"v8":"3.1"},"0.4.10":{"node_abi":1,"v8":"3.1"},"0.4.11":{"node_abi":1,"v8":"3.1"},"0.4.12":{"node_abi":1,"v8":"3.1"},"0.5.0":{"node_abi":1,"v8":"3.1"},"0.5.1":{"node_abi":1,"v8":"3.4"},"0.5.2":{"node_abi":1,"v8":"3.4"},"0.5.3":{"node_abi":1,"v8":"3.4"},"0.5.4":{"node_abi":1,"v8":"3.5"},"0.5.5":{"node_abi":1,"v8":"3.5"},"0.5.6":{"node_abi":1,"v8":"3.6"},"0.5.7":{"node_abi":1,"v8":"3.6"},"0.5.8":{"node_abi":1,"v8":"3.6"},"0.5.9":{"node_abi":1,"v8":"3.6"},"0.5.10":{"node_abi":1,"v8":"3.7"},"0.6.0":{"node_abi":1,"v8":"3.6"},"0.6.1":{"node_abi":1,"v8":"3.6"},"0.6.2":{"node_abi":1,"v8":"3.6"},"0.6.3":{"node_abi":1,"v8":"3.6"},"0.6.4":{"node_abi":1,"v8":"3.6"},"0.6.5":{"node_abi":1,"v8":"3.6"},"0.6.6":{"node_abi":1,"v8":"3.6"},"0.6.7":{"node_abi":1,"v8":"3.6"},"0.6.8":{"node_abi":1,"v8":"3.6"},"0.6.9":{"node_abi":1,"v8":"3.6"},"0.6.10":{"node_abi":1,"v8":"3.6"},"0.6.11":{"node_abi":1,"v8":"3.6"},"0.6.12":{"node_abi":1,"v8":"3.6"},"0.6.13":{"node_abi":1,"v8":"3.6"},"0.6.14":{"node_abi":1,"v8":"3.6"},"0.6.15":{"node_abi":1,"v8":"3.6"},"0.6.16":{"node_abi":1,"v8":"3.6"},"0.6.17":{"node_abi":1,"v8":"3.6"},"0.6.18":{"node_abi":1,"v8":"3.6"},"0.6.19":{"node_abi":1,"v8":"3.6"},"0.6.20":{"node_abi":1,"v8":"3.6"},"0.6.21":{"node_abi":1,"v8":"3.6"},"0.7.0":{"node_abi":1,"v8":"3.8"},"0.7.1":{"node_abi":1,"v8":"3.8"},"0.7.2":{"node_abi":1,"v8":"3.8"},"0.7.3":{"node_abi":1,"v8":"3.9"},"0.7.4":{"node_abi":1,"v8":"3.9"},"0.7.5":{"node_abi":1,"v8":"3.9"},"0.7.6":{"node_abi":1,"v8":"3.9"},"0.7.7":{"node_abi":1,"v8":"3.9"},"0.7.8":{"node_abi":1,"v8":"3.9"},"0.7.9":{"node_abi":1,"v8":"3.11"},"0.7.10":{"node_abi":1,"v8":"3.9"},"0.7.11":{"node_abi":1,"v8":"3.11"},"0.7.12":{"node_abi":1,"v8":"3.11"},"0.8.0":{"node_abi":1,"v8":"3.11"},"0.8.1":{"node_abi":1,"v8":"3.11"},"0.8.2":{"node_abi":1,"v8":"3.11"},"0.8.3":{"node_abi":1,"v8":"3.11"},"0.8.4":{"node_abi":1,"v8":"3.11"},"0.8.5":{"node_abi":1,"v8":"3.11"},"0.8.6":{"node_abi":1,"v8":"3.11"},"0.8.7":{"node_abi":1,"v8":"3.11"},"0.8.8":{"node_abi":1,"v8":"3.11"},"0.8.9":{"node_abi":1,"v8":"3.11"},"0.8.10":{"node_abi":1,"v8":"3.11"},"0.8.11":{"node_abi":1,"v8":"3.11"},"0.8.12":{"node_abi":1,"v8":"3.11"},"0.8.13":{"node_abi":1,"v8":"3.11"},"0.8.14":{"node_abi":1,"v8":"3.11"},"0.8.15":{"node_abi":1,"v8":"3.11"},"0.8.16":{"node_abi":1,"v8":"3.11"},"0.8.17":{"node_abi":1,"v8":"3.11"},"0.8.18":{"node_abi":1,"v8":"3.11"},"0.8.19":{"node_abi":1,"v8":"3.11"},"0.8.20":{"node_abi":1,"v8":"3.11"},"0.8.21":{"node_abi":1,"v8":"3.11"},"0.8.22":{"node_abi":1,"v8":"3.11"},"0.8.23":{"node_abi":1,"v8":"3.11"},"0.8.24":{"node_abi":1,"v8":"3.11"},"0.8.25":{"node_abi":1,"v8":"3.11"},"0.8.26":{"node_abi":1,"v8":"3.11"},"0.8.27":{"node_abi":1,"v8":"3.11"},"0.8.28":{"node_abi":1,"v8":"3.11"},"0.9.0":{"node_abi":1,"v8":"3.11"},"0.9.1":{"node_abi":10,"v8":"3.11"},"0.9.2":{"node_abi":10,"v8":"3.11"},"0.9.3":{"node_abi":10,"v8":"3.13"},"0.9.4":{"node_abi":10,"v8":"3.13"},"0.9.5":{"node_abi":10,"v8":"3.13"},"0.9.6":{"node_abi":10,"v8":"3.15"},"0.9.7":{"node_abi":10,"v8":"3.15"},"0.9.8":{"node_abi":10,"v8":"3.15"},"0.9.9":{"node_abi":11,"v8":"3.15"},"0.9.10":{"node_abi":11,"v8":"3.15"},"0.9.11":{"node_abi":11,"v8":"3.14"},"0.9.12":{"node_abi":11,"v8":"3.14"},"0.10.0":{"node_abi":11,"v8":"3.14"},"0.10.1":{"node_abi":11,"v8":"3.14"},"0.10.2":{"node_abi":11,"v8":"3.14"},"0.10.3":{"node_abi":11,"v8":"3.14"},"0.10.4":{"node_abi":11,"v8":"3.14"},"0.10.5":{"node_abi":11,"v8":"3.14"},"0.10.6":{"node_abi":11,"v8":"3.14"},"0.10.7":{"node_abi":11,"v8":"3.14"},"0.10.8":{"node_abi":11,"v8":"3.14"},"0.10.9":{"node_abi":11,"v8":"3.14"},"0.10.10":{"node_abi":11,"v8":"3.14"},"0.10.11":{"node_abi":11,"v8":"3.14"},"0.10.12":{"node_abi":11,"v8":"3.14"},"0.10.13":{"node_abi":11,"v8":"3.14"},"0.10.14":{"node_abi":11,"v8":"3.14"},"0.10.15":{"node_abi":11,"v8":"3.14"},"0.10.16":{"node_abi":11,"v8":"3.14"},"0.10.17":{"node_abi":11,"v8":"3.14"},"0.10.18":{"node_abi":11,"v8":"3.14"},"0.10.19":{"node_abi":11,"v8":"3.14"},"0.10.20":{"node_abi":11,"v8":"3.14"},"0.10.21":{"node_abi":11,"v8":"3.14"},"0.10.22":{"node_abi":11,"v8":"3.14"},"0.10.23":{"node_abi":11,"v8":"3.14"},"0.10.24":{"node_abi":11,"v8":"3.14"},"0.10.25":{"node_abi":11,"v8":"3.14"},"0.10.26":{"node_abi":11,"v8":"3.14"},"0.10.27":{"node_abi":11,"v8":"3.14"},"0.10.28":{"node_abi":11,"v8":"3.14"},"0.10.29":{"node_abi":11,"v8":"3.14"},"0.10.30":{"node_abi":11,"v8":"3.14"},"0.10.31":{"node_abi":11,"v8":"3.14"},"0.10.32":{"node_abi":11,"v8":"3.14"},"0.10.33":{"node_abi":11,"v8":"3.14"},"0.10.34":{"node_abi":11,"v8":"3.14"},"0.10.35":{"node_abi":11,"v8":"3.14"},"0.10.36":{"node_abi":11,"v8":"3.14"},"0.10.37":{"node_abi":11,"v8":"3.14"},"0.10.38":{"node_abi":11,"v8":"3.14"},"0.10.39":{"node_abi":11,"v8":"3.14"},"0.10.40":{"node_abi":11,"v8":"3.14"},"0.10.41":{"node_abi":11,"v8":"3.14"},"0.10.42":{"node_abi":11,"v8":"3.14"},"0.10.43":{"node_abi":11,"v8":"3.14"},"0.10.44":{"node_abi":11,"v8":"3.14"},"0.10.45":{"node_abi":11,"v8":"3.14"},"0.10.46":{"node_abi":11,"v8":"3.14"},"0.10.47":{"node_abi":11,"v8":"3.14"},"0.10.48":{"node_abi":11,"v8":"3.14"},"0.11.0":{"node_abi":12,"v8":"3.17"},"0.11.1":{"node_abi":12,"v8":"3.18"},"0.11.2":{"node_abi":12,"v8":"3.19"},"0.11.3":{"node_abi":12,"v8":"3.19"},"0.11.4":{"node_abi":12,"v8":"3.20"},"0.11.5":{"node_abi":12,"v8":"3.20"},"0.11.6":{"node_abi":12,"v8":"3.20"},"0.11.7":{"node_abi":12,"v8":"3.20"},"0.11.8":{"node_abi":13,"v8":"3.21"},"0.11.9":{"node_abi":13,"v8":"3.22"},"0.11.10":{"node_abi":13,"v8":"3.22"},"0.11.11":{"node_abi":14,"v8":"3.22"},"0.11.12":{"node_abi":14,"v8":"3.22"},"0.11.13":{"node_abi":14,"v8":"3.25"},"0.11.14":{"node_abi":14,"v8":"3.26"},"0.11.15":{"node_abi":14,"v8":"3.28"},"0.11.16":{"node_abi":14,"v8":"3.28"},"0.12.0":{"node_abi":14,"v8":"3.28"},"0.12.1":{"node_abi":14,"v8":"3.28"},"0.12.2":{"node_abi":14,"v8":"3.28"},"0.12.3":{"node_abi":14,"v8":"3.28"},"0.12.4":{"node_abi":14,"v8":"3.28"},"0.12.5":{"node_abi":14,"v8":"3.28"},"0.12.6":{"node_abi":14,"v8":"3.28"},"0.12.7":{"node_abi":14,"v8":"3.28"},"0.12.8":{"node_abi":14,"v8":"3.28"},"0.12.9":{"node_abi":14,"v8":"3.28"},"0.12.10":{"node_abi":14,"v8":"3.28"},"0.12.11":{"node_abi":14,"v8":"3.28"},"0.12.12":{"node_abi":14,"v8":"3.28"},"0.12.13":{"node_abi":14,"v8":"3.28"},"0.12.14":{"node_abi":14,"v8":"3.28"},"0.12.15":{"node_abi":14,"v8":"3.28"},"0.12.16":{"node_abi":14,"v8":"3.28"},"0.12.17":{"node_abi":14,"v8":"3.28"},"0.12.18":{"node_abi":14,"v8":"3.28"},"1.0.0":{"node_abi":42,"v8":"3.31"},"1.0.1":{"node_abi":42,"v8":"3.31"},"1.0.2":{"node_abi":42,"v8":"3.31"},"1.0.3":{"node_abi":42,"v8":"4.1"},"1.0.4":{"node_abi":42,"v8":"4.1"},"1.1.0":{"node_abi":43,"v8":"4.1"},"1.2.0":{"node_abi":43,"v8":"4.1"},"1.3.0":{"node_abi":43,"v8":"4.1"},"1.4.1":{"node_abi":43,"v8":"4.1"},"1.4.2":{"node_abi":43,"v8":"4.1"},"1.4.3":{"node_abi":43,"v8":"4.1"},"1.5.0":{"node_abi":43,"v8":"4.1"},"1.5.1":{"node_abi":43,"v8":"4.1"},"1.6.0":{"node_abi":43,"v8":"4.1"},"1.6.1":{"node_abi":43,"v8":"4.1"},"1.6.2":{"node_abi":43,"v8":"4.1"},"1.6.3":{"node_abi":43,"v8":"4.1"},"1.6.4":{"node_abi":43,"v8":"4.1"},"1.7.1":{"node_abi":43,"v8":"4.1"},"1.8.1":{"node_abi":43,"v8":"4.1"},"1.8.2":{"node_abi":43,"v8":"4.1"},"1.8.3":{"node_abi":43,"v8":"4.1"},"1.8.4":{"node_abi":43,"v8":"4.1"},"2.0.0":{"node_abi":44,"v8":"4.2"},"2.0.1":{"node_abi":44,"v8":"4.2"},"2.0.2":{"node_abi":44,"v8":"4.2"},"2.1.0":{"node_abi":44,"v8":"4.2"},"2.2.0":{"node_abi":44,"v8":"4.2"},"2.2.1":{"node_abi":44,"v8":"4.2"},"2.3.0":{"node_abi":44,"v8":"4.2"},"2.3.1":{"node_abi":44,"v8":"4.2"},"2.3.2":{"node_abi":44,"v8":"4.2"},"2.3.3":{"node_abi":44,"v8":"4.2"},"2.3.4":{"node_abi":44,"v8":"4.2"},"2.4.0":{"node_abi":44,"v8":"4.2"},"2.5.0":{"node_abi":44,"v8":"4.2"},"3.0.0":{"node_abi":45,"v8":"4.4"},"3.1.0":{"node_abi":45,"v8":"4.4"},"3.2.0":{"node_abi":45,"v8":"4.4"},"3.3.0":{"node_abi":45,"v8":"4.4"},"3.3.1":{"node_abi":45,"v8":"4.4"},"4.0.0":{"node_abi":46,"v8":"4.5"},"4.1.0":{"node_abi":46,"v8":"4.5"},"4.1.1":{"node_abi":46,"v8":"4.5"},"4.1.2":{"node_abi":46,"v8":"4.5"},"4.2.0":{"node_abi":46,"v8":"4.5"},"4.2.1":{"node_abi":46,"v8":"4.5"},"4.2.2":{"node_abi":46,"v8":"4.5"},"4.2.3":{"node_abi":46,"v8":"4.5"},"4.2.4":{"node_abi":46,"v8":"4.5"},"4.2.5":{"node_abi":46,"v8":"4.5"},"4.2.6":{"node_abi":46,"v8":"4.5"},"4.3.0":{"node_abi":46,"v8":"4.5"},"4.3.1":{"node_abi":46,"v8":"4.5"},"4.3.2":{"node_abi":46,"v8":"4.5"},"4.4.0":{"node_abi":46,"v8":"4.5"},"4.4.1":{"node_abi":46,"v8":"4.5"},"4.4.2":{"node_abi":46,"v8":"4.5"},"4.4.3":{"node_abi":46,"v8":"4.5"},"4.4.4":{"node_abi":46,"v8":"4.5"},"4.4.5":{"node_abi":46,"v8":"4.5"},"4.4.6":{"node_abi":46,"v8":"4.5"},"4.4.7":{"node_abi":46,"v8":"4.5"},"4.5.0":{"node_abi":46,"v8":"4.5"},"4.6.0":{"node_abi":46,"v8":"4.5"},"4.6.1":{"node_abi":46,"v8":"4.5"},"4.6.2":{"node_abi":46,"v8":"4.5"},"4.7.0":{"node_abi":46,"v8":"4.5"},"4.7.1":{"node_abi":46,"v8":"4.5"},"4.7.2":{"node_abi":46,"v8":"4.5"},"4.7.3":{"node_abi":46,"v8":"4.5"},"4.8.0":{"node_abi":46,"v8":"4.5"},"4.8.1":{"node_abi":46,"v8":"4.5"},"4.8.2":{"node_abi":46,"v8":"4.5"},"4.8.3":{"node_abi":46,"v8":"4.5"},"4.8.4":{"node_abi":46,"v8":"4.5"},"4.8.5":{"node_abi":46,"v8":"4.5"},"4.8.6":{"node_abi":46,"v8":"4.5"},"4.8.7":{"node_abi":46,"v8":"4.5"},"4.9.0":{"node_abi":46,"v8":"4.5"},"4.9.1":{"node_abi":46,"v8":"4.5"},"5.0.0":{"node_abi":47,"v8":"4.6"},"5.1.0":{"node_abi":47,"v8":"4.6"},"5.1.1":{"node_abi":47,"v8":"4.6"},"5.2.0":{"node_abi":47,"v8":"4.6"},"5.3.0":{"node_abi":47,"v8":"4.6"},"5.4.0":{"node_abi":47,"v8":"4.6"},"5.4.1":{"node_abi":47,"v8":"4.6"},"5.5.0":{"node_abi":47,"v8":"4.6"},"5.6.0":{"node_abi":47,"v8":"4.6"},"5.7.0":{"node_abi":47,"v8":"4.6"},"5.7.1":{"node_abi":47,"v8":"4.6"},"5.8.0":{"node_abi":47,"v8":"4.6"},"5.9.0":{"node_abi":47,"v8":"4.6"},"5.9.1":{"node_abi":47,"v8":"4.6"},"5.10.0":{"node_abi":47,"v8":"4.6"},"5.10.1":{"node_abi":47,"v8":"4.6"},"5.11.0":{"node_abi":47,"v8":"4.6"},"5.11.1":{"node_abi":47,"v8":"4.6"},"5.12.0":{"node_abi":47,"v8":"4.6"},"6.0.0":{"node_abi":48,"v8":"5.0"},"6.1.0":{"node_abi":48,"v8":"5.0"},"6.2.0":{"node_abi":48,"v8":"5.0"},"6.2.1":{"node_abi":48,"v8":"5.0"},"6.2.2":{"node_abi":48,"v8":"5.0"},"6.3.0":{"node_abi":48,"v8":"5.0"},"6.3.1":{"node_abi":48,"v8":"5.0"},"6.4.0":{"node_abi":48,"v8":"5.0"},"6.5.0":{"node_abi":48,"v8":"5.1"},"6.6.0":{"node_abi":48,"v8":"5.1"},"6.7.0":{"node_abi":48,"v8":"5.1"},"6.8.0":{"node_abi":48,"v8":"5.1"},"6.8.1":{"node_abi":48,"v8":"5.1"},"6.9.0":{"node_abi":48,"v8":"5.1"},"6.9.1":{"node_abi":48,"v8":"5.1"},"6.9.2":{"node_abi":48,"v8":"5.1"},"6.9.3":{"node_abi":48,"v8":"5.1"},"6.9.4":{"node_abi":48,"v8":"5.1"},"6.9.5":{"node_abi":48,"v8":"5.1"},"6.10.0":{"node_abi":48,"v8":"5.1"},"6.10.1":{"node_abi":48,"v8":"5.1"},"6.10.2":{"node_abi":48,"v8":"5.1"},"6.10.3":{"node_abi":48,"v8":"5.1"},"6.11.0":{"node_abi":48,"v8":"5.1"},"6.11.1":{"node_abi":48,"v8":"5.1"},"6.11.2":{"node_abi":48,"v8":"5.1"},"6.11.3":{"node_abi":48,"v8":"5.1"},"6.11.4":{"node_abi":48,"v8":"5.1"},"6.11.5":{"node_abi":48,"v8":"5.1"},"6.12.0":{"node_abi":48,"v8":"5.1"},"6.12.1":{"node_abi":48,"v8":"5.1"},"6.12.2":{"node_abi":48,"v8":"5.1"},"6.12.3":{"node_abi":48,"v8":"5.1"},"6.13.0":{"node_abi":48,"v8":"5.1"},"6.13.1":{"node_abi":48,"v8":"5.1"},"6.14.0":{"node_abi":48,"v8":"5.1"},"6.14.1":{"node_abi":48,"v8":"5.1"},"6.14.2":{"node_abi":48,"v8":"5.1"},"6.14.3":{"node_abi":48,"v8":"5.1"},"6.14.4":{"node_abi":48,"v8":"5.1"},"6.15.0":{"node_abi":48,"v8":"5.1"},"6.15.1":{"node_abi":48,"v8":"5.1"},"6.16.0":{"node_abi":48,"v8":"5.1"},"6.17.0":{"node_abi":48,"v8":"5.1"},"6.17.1":{"node_abi":48,"v8":"5.1"},"7.0.0":{"node_abi":51,"v8":"5.4"},"7.1.0":{"node_abi":51,"v8":"5.4"},"7.2.0":{"node_abi":51,"v8":"5.4"},"7.2.1":{"node_abi":51,"v8":"5.4"},"7.3.0":{"node_abi":51,"v8":"5.4"},"7.4.0":{"node_abi":51,"v8":"5.4"},"7.5.0":{"node_abi":51,"v8":"5.4"},"7.6.0":{"node_abi":51,"v8":"5.5"},"7.7.0":{"node_abi":51,"v8":"5.5"},"7.7.1":{"node_abi":51,"v8":"5.5"},"7.7.2":{"node_abi":51,"v8":"5.5"},"7.7.3":{"node_abi":51,"v8":"5.5"},"7.7.4":{"node_abi":51,"v8":"5.5"},"7.8.0":{"node_abi":51,"v8":"5.5"},"7.9.0":{"node_abi":51,"v8":"5.5"},"7.10.0":{"node_abi":51,"v8":"5.5"},"7.10.1":{"node_abi":51,"v8":"5.5"},"8.0.0":{"node_abi":57,"v8":"5.8"},"8.1.0":{"node_abi":57,"v8":"5.8"},"8.1.1":{"node_abi":57,"v8":"5.8"},"8.1.2":{"node_abi":57,"v8":"5.8"},"8.1.3":{"node_abi":57,"v8":"5.8"},"8.1.4":{"node_abi":57,"v8":"5.8"},"8.2.0":{"node_abi":57,"v8":"5.8"},"8.2.1":{"node_abi":57,"v8":"5.8"},"8.3.0":{"node_abi":57,"v8":"6.0"},"8.4.0":{"node_abi":57,"v8":"6.0"},"8.5.0":{"node_abi":57,"v8":"6.0"},"8.6.0":{"node_abi":57,"v8":"6.0"},"8.7.0":{"node_abi":57,"v8":"6.1"},"8.8.0":{"node_abi":57,"v8":"6.1"},"8.8.1":{"node_abi":57,"v8":"6.1"},"8.9.0":{"node_abi":57,"v8":"6.1"},"8.9.1":{"node_abi":57,"v8":"6.1"},"8.9.2":{"node_abi":57,"v8":"6.1"},"8.9.3":{"node_abi":57,"v8":"6.1"},"8.9.4":{"node_abi":57,"v8":"6.1"},"8.10.0":{"node_abi":57,"v8":"6.2"},"8.11.0":{"node_abi":57,"v8":"6.2"},"8.11.1":{"node_abi":57,"v8":"6.2"},"8.11.2":{"node_abi":57,"v8":"6.2"},"8.11.3":{"node_abi":57,"v8":"6.2"},"8.11.4":{"node_abi":57,"v8":"6.2"},"8.12.0":{"node_abi":57,"v8":"6.2"},"8.13.0":{"node_abi":57,"v8":"6.2"},"8.14.0":{"node_abi":57,"v8":"6.2"},"8.14.1":{"node_abi":57,"v8":"6.2"},"8.15.0":{"node_abi":57,"v8":"6.2"},"8.15.1":{"node_abi":57,"v8":"6.2"},"8.16.0":{"node_abi":57,"v8":"6.2"},"8.16.1":{"node_abi":57,"v8":"6.2"},"8.16.2":{"node_abi":57,"v8":"6.2"},"8.17.0":{"node_abi":57,"v8":"6.2"},"9.0.0":{"node_abi":59,"v8":"6.2"},"9.1.0":{"node_abi":59,"v8":"6.2"},"9.2.0":{"node_abi":59,"v8":"6.2"},"9.2.1":{"node_abi":59,"v8":"6.2"},"9.3.0":{"node_abi":59,"v8":"6.2"},"9.4.0":{"node_abi":59,"v8":"6.2"},"9.5.0":{"node_abi":59,"v8":"6.2"},"9.6.0":{"node_abi":59,"v8":"6.2"},"9.6.1":{"node_abi":59,"v8":"6.2"},"9.7.0":{"node_abi":59,"v8":"6.2"},"9.7.1":{"node_abi":59,"v8":"6.2"},"9.8.0":{"node_abi":59,"v8":"6.2"},"9.9.0":{"node_abi":59,"v8":"6.2"},"9.10.0":{"node_abi":59,"v8":"6.2"},"9.10.1":{"node_abi":59,"v8":"6.2"},"9.11.0":{"node_abi":59,"v8":"6.2"},"9.11.1":{"node_abi":59,"v8":"6.2"},"9.11.2":{"node_abi":59,"v8":"6.2"},"10.0.0":{"node_abi":64,"v8":"6.6"},"10.1.0":{"node_abi":64,"v8":"6.6"},"10.2.0":{"node_abi":64,"v8":"6.6"},"10.2.1":{"node_abi":64,"v8":"6.6"},"10.3.0":{"node_abi":64,"v8":"6.6"},"10.4.0":{"node_abi":64,"v8":"6.7"},"10.4.1":{"node_abi":64,"v8":"6.7"},"10.5.0":{"node_abi":64,"v8":"6.7"},"10.6.0":{"node_abi":64,"v8":"6.7"},"10.7.0":{"node_abi":64,"v8":"6.7"},"10.8.0":{"node_abi":64,"v8":"6.7"},"10.9.0":{"node_abi":64,"v8":"6.8"},"10.10.0":{"node_abi":64,"v8":"6.8"},"10.11.0":{"node_abi":64,"v8":"6.8"},"10.12.0":{"node_abi":64,"v8":"6.8"},"10.13.0":{"node_abi":64,"v8":"6.8"},"10.14.0":{"node_abi":64,"v8":"6.8"},"10.14.1":{"node_abi":64,"v8":"6.8"},"10.14.2":{"node_abi":64,"v8":"6.8"},"10.15.0":{"node_abi":64,"v8":"6.8"},"10.15.1":{"node_abi":64,"v8":"6.8"},"10.15.2":{"node_abi":64,"v8":"6.8"},"10.15.3":{"node_abi":64,"v8":"6.8"},"10.16.0":{"node_abi":64,"v8":"6.8"},"10.16.1":{"node_abi":64,"v8":"6.8"},"10.16.2":{"node_abi":64,"v8":"6.8"},"10.16.3":{"node_abi":64,"v8":"6.8"},"10.17.0":{"node_abi":64,"v8":"6.8"},"10.18.0":{"node_abi":64,"v8":"6.8"},"10.18.1":{"node_abi":64,"v8":"6.8"},"10.19.0":{"node_abi":64,"v8":"6.8"},"10.20.0":{"node_abi":64,"v8":"6.8"},"10.20.1":{"node_abi":64,"v8":"6.8"},"10.21.0":{"node_abi":64,"v8":"6.8"},"10.22.0":{"node_abi":64,"v8":"6.8"},"10.22.1":{"node_abi":64,"v8":"6.8"},"10.23.0":{"node_abi":64,"v8":"6.8"},"10.23.1":{"node_abi":64,"v8":"6.8"},"10.23.2":{"node_abi":64,"v8":"6.8"},"10.23.3":{"node_abi":64,"v8":"6.8"},"10.24.0":{"node_abi":64,"v8":"6.8"},"10.24.1":{"node_abi":64,"v8":"6.8"},"11.0.0":{"node_abi":67,"v8":"7.0"},"11.1.0":{"node_abi":67,"v8":"7.0"},"11.2.0":{"node_abi":67,"v8":"7.0"},"11.3.0":{"node_abi":67,"v8":"7.0"},"11.4.0":{"node_abi":67,"v8":"7.0"},"11.5.0":{"node_abi":67,"v8":"7.0"},"11.6.0":{"node_abi":67,"v8":"7.0"},"11.7.0":{"node_abi":67,"v8":"7.0"},"11.8.0":{"node_abi":67,"v8":"7.0"},"11.9.0":{"node_abi":67,"v8":"7.0"},"11.10.0":{"node_abi":67,"v8":"7.0"},"11.10.1":{"node_abi":67,"v8":"7.0"},"11.11.0":{"node_abi":67,"v8":"7.0"},"11.12.0":{"node_abi":67,"v8":"7.0"},"11.13.0":{"node_abi":67,"v8":"7.0"},"11.14.0":{"node_abi":67,"v8":"7.0"},"11.15.0":{"node_abi":67,"v8":"7.0"},"12.0.0":{"node_abi":72,"v8":"7.4"},"12.1.0":{"node_abi":72,"v8":"7.4"},"12.2.0":{"node_abi":72,"v8":"7.4"},"12.3.0":{"node_abi":72,"v8":"7.4"},"12.3.1":{"node_abi":72,"v8":"7.4"},"12.4.0":{"node_abi":72,"v8":"7.4"},"12.5.0":{"node_abi":72,"v8":"7.5"},"12.6.0":{"node_abi":72,"v8":"7.5"},"12.7.0":{"node_abi":72,"v8":"7.5"},"12.8.0":{"node_abi":72,"v8":"7.5"},"12.8.1":{"node_abi":72,"v8":"7.5"},"12.9.0":{"node_abi":72,"v8":"7.6"},"12.9.1":{"node_abi":72,"v8":"7.6"},"12.10.0":{"node_abi":72,"v8":"7.6"},"12.11.0":{"node_abi":72,"v8":"7.7"},"12.11.1":{"node_abi":72,"v8":"7.7"},"12.12.0":{"node_abi":72,"v8":"7.7"},"12.13.0":{"node_abi":72,"v8":"7.7"},"12.13.1":{"node_abi":72,"v8":"7.7"},"12.14.0":{"node_abi":72,"v8":"7.7"},"12.14.1":{"node_abi":72,"v8":"7.7"},"12.15.0":{"node_abi":72,"v8":"7.7"},"12.16.0":{"node_abi":72,"v8":"7.8"},"12.16.1":{"node_abi":72,"v8":"7.8"},"12.16.2":{"node_abi":72,"v8":"7.8"},"12.16.3":{"node_abi":72,"v8":"7.8"},"12.17.0":{"node_abi":72,"v8":"7.8"},"12.18.0":{"node_abi":72,"v8":"7.8"},"12.18.1":{"node_abi":72,"v8":"7.8"},"12.18.2":{"node_abi":72,"v8":"7.8"},"12.18.3":{"node_abi":72,"v8":"7.8"},"12.18.4":{"node_abi":72,"v8":"7.8"},"12.19.0":{"node_abi":72,"v8":"7.8"},"12.19.1":{"node_abi":72,"v8":"7.8"},"12.20.0":{"node_abi":72,"v8":"7.8"},"12.20.1":{"node_abi":72,"v8":"7.8"},"12.20.2":{"node_abi":72,"v8":"7.8"},"12.21.0":{"node_abi":72,"v8":"7.8"},"12.22.0":{"node_abi":72,"v8":"7.8"},"12.22.1":{"node_abi":72,"v8":"7.8"},"12.22.2":{"node_abi":72,"v8":"7.8"},"12.22.3":{"node_abi":72,"v8":"7.8"},"12.22.4":{"node_abi":72,"v8":"7.8"},"12.22.5":{"node_abi":72,"v8":"7.8"},"12.22.6":{"node_abi":72,"v8":"7.8"},"12.22.7":{"node_abi":72,"v8":"7.8"},"13.0.0":{"node_abi":79,"v8":"7.8"},"13.0.1":{"node_abi":79,"v8":"7.8"},"13.1.0":{"node_abi":79,"v8":"7.8"},"13.2.0":{"node_abi":79,"v8":"7.9"},"13.3.0":{"node_abi":79,"v8":"7.9"},"13.4.0":{"node_abi":79,"v8":"7.9"},"13.5.0":{"node_abi":79,"v8":"7.9"},"13.6.0":{"node_abi":79,"v8":"7.9"},"13.7.0":{"node_abi":79,"v8":"7.9"},"13.8.0":{"node_abi":79,"v8":"7.9"},"13.9.0":{"node_abi":79,"v8":"7.9"},"13.10.0":{"node_abi":79,"v8":"7.9"},"13.10.1":{"node_abi":79,"v8":"7.9"},"13.11.0":{"node_abi":79,"v8":"7.9"},"13.12.0":{"node_abi":79,"v8":"7.9"},"13.13.0":{"node_abi":79,"v8":"7.9"},"13.14.0":{"node_abi":79,"v8":"7.9"},"14.0.0":{"node_abi":83,"v8":"8.1"},"14.1.0":{"node_abi":83,"v8":"8.1"},"14.2.0":{"node_abi":83,"v8":"8.1"},"14.3.0":{"node_abi":83,"v8":"8.1"},"14.4.0":{"node_abi":83,"v8":"8.1"},"14.5.0":{"node_abi":83,"v8":"8.3"},"14.6.0":{"node_abi":83,"v8":"8.4"},"14.7.0":{"node_abi":83,"v8":"8.4"},"14.8.0":{"node_abi":83,"v8":"8.4"},"14.9.0":{"node_abi":83,"v8":"8.4"},"14.10.0":{"node_abi":83,"v8":"8.4"},"14.10.1":{"node_abi":83,"v8":"8.4"},"14.11.0":{"node_abi":83,"v8":"8.4"},"14.12.0":{"node_abi":83,"v8":"8.4"},"14.13.0":{"node_abi":83,"v8":"8.4"},"14.13.1":{"node_abi":83,"v8":"8.4"},"14.14.0":{"node_abi":83,"v8":"8.4"},"14.15.0":{"node_abi":83,"v8":"8.4"},"14.15.1":{"node_abi":83,"v8":"8.4"},"14.15.2":{"node_abi":83,"v8":"8.4"},"14.15.3":{"node_abi":83,"v8":"8.4"},"14.15.4":{"node_abi":83,"v8":"8.4"},"14.15.5":{"node_abi":83,"v8":"8.4"},"14.16.0":{"node_abi":83,"v8":"8.4"},"14.16.1":{"node_abi":83,"v8":"8.4"},"14.17.0":{"node_abi":83,"v8":"8.4"},"14.17.1":{"node_abi":83,"v8":"8.4"},"14.17.2":{"node_abi":83,"v8":"8.4"},"14.17.3":{"node_abi":83,"v8":"8.4"},"14.17.4":{"node_abi":83,"v8":"8.4"},"14.17.5":{"node_abi":83,"v8":"8.4"},"14.17.6":{"node_abi":83,"v8":"8.4"},"14.18.0":{"node_abi":83,"v8":"8.4"},"14.18.1":{"node_abi":83,"v8":"8.4"},"15.0.0":{"node_abi":88,"v8":"8.6"},"15.0.1":{"node_abi":88,"v8":"8.6"},"15.1.0":{"node_abi":88,"v8":"8.6"},"15.2.0":{"node_abi":88,"v8":"8.6"},"15.2.1":{"node_abi":88,"v8":"8.6"},"15.3.0":{"node_abi":88,"v8":"8.6"},"15.4.0":{"node_abi":88,"v8":"8.6"},"15.5.0":{"node_abi":88,"v8":"8.6"},"15.5.1":{"node_abi":88,"v8":"8.6"},"15.6.0":{"node_abi":88,"v8":"8.6"},"15.7.0":{"node_abi":88,"v8":"8.6"},"15.8.0":{"node_abi":88,"v8":"8.6"},"15.9.0":{"node_abi":88,"v8":"8.6"},"15.10.0":{"node_abi":88,"v8":"8.6"},"15.11.0":{"node_abi":88,"v8":"8.6"},"15.12.0":{"node_abi":88,"v8":"8.6"},"15.13.0":{"node_abi":88,"v8":"8.6"},"15.14.0":{"node_abi":88,"v8":"8.6"},"16.0.0":{"node_abi":93,"v8":"9.0"},"16.1.0":{"node_abi":93,"v8":"9.0"},"16.2.0":{"node_abi":93,"v8":"9.0"},"16.3.0":{"node_abi":93,"v8":"9.0"},"16.4.0":{"node_abi":93,"v8":"9.1"},"16.4.1":{"node_abi":93,"v8":"9.1"},"16.4.2":{"node_abi":93,"v8":"9.1"},"16.5.0":{"node_abi":93,"v8":"9.1"},"16.6.0":{"node_abi":93,"v8":"9.2"},"16.6.1":{"node_abi":93,"v8":"9.2"},"16.6.2":{"node_abi":93,"v8":"9.2"},"16.7.0":{"node_abi":93,"v8":"9.2"},"16.8.0":{"node_abi":93,"v8":"9.2"},"16.9.0":{"node_abi":93,"v8":"9.3"},"16.9.1":{"node_abi":93,"v8":"9.3"},"16.10.0":{"node_abi":93,"v8":"9.3"},"16.11.0":{"node_abi":93,"v8":"9.4"},"16.11.1":{"node_abi":93,"v8":"9.4"},"16.12.0":{"node_abi":93,"v8":"9.4"},"16.13.0":{"node_abi":93,"v8":"9.4"},"17.0.0":{"node_abi":102,"v8":"9.5"},"17.0.1":{"node_abi":102,"v8":"9.5"},"17.1.0":{"node_abi":102,"v8":"9.5"}}');

/***/ }),
/* 108 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./build": 109,
	"./build.js": 109,
	"./clean": 113,
	"./clean.js": 113,
	"./configure": 112,
	"./configure.js": 112,
	"./info": 114,
	"./info.js": 114,
	"./install": 115,
	"./install.js": 115,
	"./main": 160,
	"./main.js": 160,
	"./node-pre-gyp": 54,
	"./node-pre-gyp.js": 54,
	"./package": 161,
	"./package.js": 161,
	"./pre-binding": 100,
	"./pre-binding.js": 100,
	"./publish": 162,
	"./publish.js": 162,
	"./rebuild": 163,
	"./rebuild.js": 163,
	"./reinstall": 164,
	"./reinstall.js": 164,
	"./reveal": 165,
	"./reveal.js": 165,
	"./testbinary": 166,
	"./testbinary.js": 166,
	"./testpackage": 167,
	"./testpackage.js": 167,
	"./unpublish": 168,
	"./unpublish.js": 168,
	"./util/abi_crosswalk.json": 107,
	"./util/compile": 110,
	"./util/compile.js": 110,
	"./util/handle_gyp_opts": 111,
	"./util/handle_gyp_opts.js": 111,
	"./util/napi": 98,
	"./util/napi.js": 98,
	"./util/nw-pre-gyp/index.html": 169,
	"./util/nw-pre-gyp/package.json": 170,
	"./util/s3_setup": 55,
	"./util/s3_setup.js": 55,
	"./util/versioning": 101,
	"./util/versioning.js": 101
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 108;

/***/ }),
/* 109 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = build;

exports.usage = 'Attempts to compile the module by dispatching to node-gyp or nw-gyp';

const napi = __webpack_require__(98);
const compile = __webpack_require__(110);
const handle_gyp_opts = __webpack_require__(111);
const configure = __webpack_require__(112);

function do_build(gyp, argv, callback) {
  handle_gyp_opts(gyp, argv, (err, result) => {
    let final_args = ['build'].concat(result.gyp).concat(result.pre);
    if (result.unparsed.length > 0) {
      final_args = final_args.
        concat(['--']).
        concat(result.unparsed);
    }
    if (!err && result.opts.napi_build_version) {
      napi.swap_build_dir_in(result.opts.napi_build_version);
    }
    compile.run_gyp(final_args, result.opts, (err2) => {
      if (result.opts.napi_build_version) {
        napi.swap_build_dir_out(result.opts.napi_build_version);
      }
      return callback(err2);
    });
  });
}

function build(gyp, argv, callback) {

  // Form up commands to pass to node-gyp:
  // We map `node-pre-gyp build` to `node-gyp configure build` so that we do not
  // trigger a clean and therefore do not pay the penalty of a full recompile
  if (argv.length && (argv.indexOf('rebuild') > -1)) {
    argv.shift(); // remove `rebuild`
    // here we map `node-pre-gyp rebuild` to `node-gyp rebuild` which internally means
    // "clean + configure + build" and triggers a full recompile
    compile.run_gyp(['clean'], {}, (err3) => {
      if (err3) return callback(err3);
      configure(gyp, argv, (err4) => {
        if (err4) return callback(err4);
        return do_build(gyp, argv, callback);
      });
    });
  } else {
    return do_build(gyp, argv, callback);
  }
}


/***/ }),
/* 110 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports;

const fs = __webpack_require__(57);
const path = __webpack_require__(58);
const win = process.platform === 'win32';
const existsSync = fs.existsSync || path.existsSync;
const cp = __webpack_require__(104);

// try to build up the complete path to node-gyp
/* priority:
  - node-gyp on ENV:npm_config_node_gyp (https://github.com/npm/npm/pull/4887)
  - node-gyp on NODE_PATH
  - node-gyp inside npm on NODE_PATH (ignore on iojs)
  - node-gyp inside npm beside node exe
*/
function which_node_gyp() {
  let node_gyp_bin;
  if (process.env.npm_config_node_gyp) {
    try {
      node_gyp_bin = process.env.npm_config_node_gyp;
      if (existsSync(node_gyp_bin)) {
        return node_gyp_bin;
      }
    } catch (err) {
      // do nothing
    }
  }
  try {
    const node_gyp_main = /*require.resolve*/(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'node-gyp'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // eslint-disable-line node/no-missing-require
    node_gyp_bin = path.join(path.dirname(
      path.dirname(node_gyp_main)),
    'bin/node-gyp.js');
    if (existsSync(node_gyp_bin)) {
      return node_gyp_bin;
    }
  } catch (err) {
    // do nothing
  }
  if (process.execPath.indexOf('iojs') === -1) {
    try {
      const npm_main = /*require.resolve*/(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'npm'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // eslint-disable-line node/no-missing-require
      node_gyp_bin = path.join(path.dirname(
        path.dirname(npm_main)),
      'node_modules/node-gyp/bin/node-gyp.js');
      if (existsSync(node_gyp_bin)) {
        return node_gyp_bin;
      }
    } catch (err) {
      // do nothing
    }
  }
  const npm_base = path.join(path.dirname(
    path.dirname(process.execPath)),
  'lib/node_modules/npm/');
  node_gyp_bin = path.join(npm_base, 'node_modules/node-gyp/bin/node-gyp.js');
  if (existsSync(node_gyp_bin)) {
    return node_gyp_bin;
  }
}

module.exports.run_gyp = function(args, opts, callback) {
  let shell_cmd = '';
  const cmd_args = [];
  if (opts.runtime && opts.runtime === 'node-webkit') {
    shell_cmd = 'nw-gyp';
    if (win) shell_cmd += '.cmd';
  } else {
    const node_gyp_path = which_node_gyp();
    if (node_gyp_path) {
      shell_cmd = process.execPath;
      cmd_args.push(node_gyp_path);
    } else {
      shell_cmd = 'node-gyp';
      if (win) shell_cmd += '.cmd';
    }
  }
  const final_args = cmd_args.concat(args);
  const cmd = cp.spawn(shell_cmd, final_args, { cwd: undefined, env: process.env, stdio: [0, 1, 2] });
  cmd.on('error', (err) => {
    if (err) {
      return callback(new Error("Failed to execute '" + shell_cmd + ' ' + final_args.join(' ') + "' (" + err + ')'));
    }
    callback(null, opts);
  });
  cmd.on('close', (code) => {
    if (code && code !== 0) {
      return callback(new Error("Failed to execute '" + shell_cmd + ' ' + final_args.join(' ') + "' (" + code + ')'));
    }
    callback(null, opts);
  });
};


/***/ }),
/* 111 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = handle_gyp_opts;

const versioning = __webpack_require__(101);
const napi = __webpack_require__(98);

/*

Here we gather node-pre-gyp generated options (from versioning) and pass them along to node-gyp.

We massage the args and options slightly to account for differences in what commands mean between
node-pre-gyp and node-gyp (e.g. see the difference between "build" and "rebuild" below)

Keep in mind: the values inside `argv` and `gyp.opts` below are different depending on whether
node-pre-gyp is called directory, or if it is called in a `run-script` phase of npm.

We also try to preserve any command line options that might have been passed to npm or node-pre-gyp.
But this is fairly difficult without passing way to much through. For example `gyp.opts` contains all
the process.env and npm pushes a lot of variables into process.env which node-pre-gyp inherits. So we have
to be very selective about what we pass through.

For example:

`npm install --build-from-source` will give:

argv == [ 'rebuild' ]
gyp.opts.argv == { remain: [ 'install' ],
  cooked: [ 'install', '--fallback-to-build' ],
  original: [ 'install', '--fallback-to-build' ] }

`./bin/node-pre-gyp build` will give:

argv == []
gyp.opts.argv == { remain: [ 'build' ],
  cooked: [ 'build' ],
  original: [ '-C', 'test/app1', 'build' ] }

*/

// select set of node-pre-gyp versioning info
// to share with node-gyp
const share_with_node_gyp = [
  'module',
  'module_name',
  'module_path',
  'napi_version',
  'node_abi_napi',
  'napi_build_version',
  'node_napi_label'
];

function handle_gyp_opts(gyp, argv, callback) {

  // Collect node-pre-gyp specific variables to pass to node-gyp
  const node_pre_gyp_options = [];
  // generate custom node-pre-gyp versioning info
  const napi_build_version = napi.get_napi_build_version_from_command_args(argv);
  const opts = versioning.evaluate(gyp.package_json, gyp.opts, napi_build_version);
  share_with_node_gyp.forEach((key) => {
    const val = opts[key];
    if (val) {
      node_pre_gyp_options.push('--' + key + '=' + val);
    } else if (key === 'napi_build_version') {
      node_pre_gyp_options.push('--' + key + '=0');
    } else {
      if (key !== 'napi_version' && key !== 'node_abi_napi')
        return callback(new Error('Option ' + key + ' required but not found by node-pre-gyp'));
    }
  });

  // Collect options that follow the special -- which disables nopt parsing
  const unparsed_options = [];
  let double_hyphen_found = false;
  gyp.opts.argv.original.forEach((opt) => {
    if (double_hyphen_found) {
      unparsed_options.push(opt);
    }
    if (opt === '--') {
      double_hyphen_found = true;
    }
  });

  // We try respect and pass through remaining command
  // line options (like --foo=bar) to node-gyp
  const cooked = gyp.opts.argv.cooked;
  const node_gyp_options = [];
  cooked.forEach((value) => {
    if (value.length > 2 && value.slice(0, 2) === '--') {
      const key = value.slice(2);
      const val = cooked[cooked.indexOf(value) + 1];
      if (val && val.indexOf('--') === -1) { // handle '--foo=bar' or ['--foo','bar']
        node_gyp_options.push('--' + key + '=' + val);
      } else { // pass through --foo
        node_gyp_options.push(value);
      }
    }
  });

  const result = { 'opts': opts, 'gyp': node_gyp_options, 'pre': node_pre_gyp_options, 'unparsed': unparsed_options };
  return callback(null, result);
}


/***/ }),
/* 112 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = configure;

exports.usage = 'Attempts to configure node-gyp or nw-gyp build';

const napi = __webpack_require__(98);
const compile = __webpack_require__(110);
const handle_gyp_opts = __webpack_require__(111);

function configure(gyp, argv, callback) {
  handle_gyp_opts(gyp, argv, (err, result) => {
    let final_args = result.gyp.concat(result.pre);
    // pull select node-gyp configure options out of the npm environ
    const known_gyp_args = ['dist-url', 'python', 'nodedir', 'msvs_version'];
    known_gyp_args.forEach((key) => {
      const val = gyp.opts[key] || gyp.opts[key.replace('-', '_')];
      if (val) {
        final_args.push('--' + key + '=' + val);
      }
    });
    // --ensure=false tell node-gyp to re-install node development headers
    // but it is only respected by node-gyp install, so we have to call install
    // as a separate step if the user passes it
    if (gyp.opts.ensure === false) {
      const install_args = final_args.concat(['install', '--ensure=false']);
      compile.run_gyp(install_args, result.opts, (err2) => {
        if (err2) return callback(err2);
        if (result.unparsed.length > 0) {
          final_args = final_args.
            concat(['--']).
            concat(result.unparsed);
        }
        compile.run_gyp(['configure'].concat(final_args), result.opts, (err3) => {
          return callback(err3);
        });
      });
    } else {
      if (result.unparsed.length > 0) {
        final_args = final_args.
          concat(['--']).
          concat(result.unparsed);
      }
      compile.run_gyp(['configure'].concat(final_args), result.opts, (err4) => {
        if (!err4 && result.opts.napi_build_version) {
          napi.swap_build_dir_out(result.opts.napi_build_version);
        }
        return callback(err4);
      });
    }
  });
}


/***/ }),
/* 113 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = clean;

exports.usage = 'Removes the entire folder containing the compiled .node module';

const rm = __webpack_require__(99);
const exists = (__webpack_require__(57).exists) || (__webpack_require__(58).exists);
const versioning = __webpack_require__(101);
const napi = __webpack_require__(98);
const path = __webpack_require__(58);

function clean(gyp, argv, callback) {
  const package_json = gyp.package_json;
  const napi_build_version = napi.get_napi_build_version_from_command_args(argv);
  const opts = versioning.evaluate(package_json, gyp.opts, napi_build_version);
  const to_delete = opts.module_path;
  if (!to_delete) {
    return callback(new Error('module_path is empty, refusing to delete'));
  } else if (path.normalize(to_delete) === path.normalize(process.cwd())) {
    return callback(new Error('module_path is not set, refusing to delete'));
  } else {
    exists(to_delete, (found) => {
      if (found) {
        if (!gyp.opts.silent_clean) console.log('[' + package_json.name + '] Removing "%s"', to_delete);
        return rm(to_delete, callback);
      }
      return callback();
    });
  }
}


/***/ }),
/* 114 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = info;

exports.usage = 'Lists all published binaries (requires aws-sdk)';

const log = __webpack_require__(63);
const versioning = __webpack_require__(101);
const s3_setup = __webpack_require__(55);

function info(gyp, argv, callback) {
  const package_json = gyp.package_json;
  const opts = versioning.evaluate(package_json, gyp.opts);
  const config = {};
  s3_setup.detect(opts, config);
  const s3 = s3_setup.get_s3(config);
  const s3_opts = {
    Bucket: config.bucket,
    Prefix: config.prefix
  };
  s3.listObjects(s3_opts, (err, meta) => {
    if (err && err.code === 'NotFound') {
      return callback(new Error('[' + package_json.name + '] Not found: https://' + s3_opts.Bucket + '.s3.amazonaws.com/' + config.prefix));
    } else if (err) {
      return callback(err);
    } else {
      log.verbose(JSON.stringify(meta, null, 1));
      if (meta && meta.Contents) {
        meta.Contents.forEach((obj) => {
          console.log(obj.Key);
        });
      } else {
        console.error('[' + package_json.name + '] No objects found at https://' + s3_opts.Bucket + '.s3.amazonaws.com/' + config.prefix);
      }
      return callback();
    }
  });
}


/***/ }),
/* 115 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = install;

exports.usage = 'Attempts to install pre-built binary for module';

const fs = __webpack_require__(57);
const path = __webpack_require__(58);
const log = __webpack_require__(63);
const existsAsync = fs.exists || path.exists;
const versioning = __webpack_require__(101);
const napi = __webpack_require__(98);
const makeDir = __webpack_require__(116);
// for fetching binaries
const fetch = __webpack_require__(117);
const tar = __webpack_require__(118);

let npgVersion = 'unknown';
try {
  // Read own package.json to get the current node-pre-pyp version.
  const ownPackageJSON = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8');
  npgVersion = JSON.parse(ownPackageJSON).version;
} catch (e) {
  // do nothing
}

function place_binary(uri, targetDir, opts, callback) {
  log.http('GET', uri);

  // Try getting version info from the currently running npm.
  const envVersionInfo = process.env.npm_config_user_agent ||
        'node ' + process.version;

  const sanitized = uri.replace('+', '%2B');
  const requestOpts = {
    uri: sanitized,
    headers: {
      'User-Agent': 'node-pre-gyp (v' + npgVersion + ', ' + envVersionInfo + ')'
    },
    follow_max: 10
  };

  if (opts.cafile) {
    try {
      requestOpts.ca = fs.readFileSync(opts.cafile);
    } catch (e) {
      return callback(e);
    }
  } else if (opts.ca) {
    requestOpts.ca = opts.ca;
  }

  const proxyUrl = opts.proxy ||
                    process.env.http_proxy ||
                    process.env.HTTP_PROXY ||
                    process.env.npm_config_proxy;
  let agent;
  if (proxyUrl) {
    const ProxyAgent = __webpack_require__(159);
    agent = new ProxyAgent(proxyUrl);
    log.http('download', 'proxy agent configured using: "%s"', proxyUrl);
  }

  fetch(sanitized, { agent })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`response status ${res.status} ${res.statusText} on ${sanitized}`);
      }
      const dataStream = res.body;

      return new Promise((resolve, reject) => {
        let extractions = 0;
        const countExtractions = (entry) => {
          extractions += 1;
          log.info('install', 'unpacking %s', entry.path);
        };

        dataStream.pipe(extract(targetDir, countExtractions))
          .on('error', (e) => {
            reject(e);
          });
        dataStream.on('end', () => {
          resolve(`extracted file count: ${extractions}`);
        });
        dataStream.on('error', (e) => {
          reject(e);
        });
      });
    })
    .then((text) => {
      log.info(text);
      callback();
    })
    .catch((e) => {
      log.error(`install ${e.message}`);
      callback(e);
    });
}

function extract(to, onentry) {
  return tar.extract({
    cwd: to,
    strip: 1,
    onentry
  });
}

function extract_from_local(from, targetDir, callback) {
  if (!fs.existsSync(from)) {
    return callback(new Error('Cannot find file ' + from));
  }
  log.info('Found local file to extract from ' + from);

  // extract helpers
  let extractCount = 0;
  function countExtractions(entry) {
    extractCount += 1;
    log.info('install', 'unpacking ' + entry.path);
  }
  function afterExtract(err) {
    if (err) return callback(err);
    if (extractCount === 0) {
      return callback(new Error('There was a fatal problem while extracting the tarball'));
    }
    log.info('tarball', 'done parsing tarball');
    callback();
  }

  fs.createReadStream(from).pipe(extract(targetDir, countExtractions))
    .on('close', afterExtract)
    .on('error', afterExtract);
}

function do_build(gyp, argv, callback) {
  const args = ['rebuild'].concat(argv);
  gyp.todo.push({ name: 'build', args: args });
  process.nextTick(callback);
}

function print_fallback_error(err, opts, package_json) {
  const fallback_message = ' (falling back to source compile with node-gyp)';
  let full_message = '';
  if (err.statusCode !== undefined) {
    // If we got a network response it but failed to download
    // it means remote binaries are not available, so let's try to help
    // the user/developer with the info to debug why
    full_message = 'Pre-built binaries not found for ' + package_json.name + '@' + package_json.version;
    full_message += ' and ' + opts.runtime + '@' + (opts.target || process.versions.node) + ' (' + opts.node_abi + ' ABI, ' + opts.libc + ')';
    full_message += fallback_message;
    log.warn('Tried to download(' + err.statusCode + '): ' + opts.hosted_tarball);
    log.warn(full_message);
    log.http(err.message);
  } else {
    // If we do not have a statusCode that means an unexpected error
    // happened and prevented an http response, so we output the exact error
    full_message = 'Pre-built binaries not installable for ' + package_json.name + '@' + package_json.version;
    full_message += ' and ' + opts.runtime + '@' + (opts.target || process.versions.node) + ' (' + opts.node_abi + ' ABI, ' + opts.libc + ')';
    full_message += fallback_message;
    log.warn(full_message);
    log.warn('Hit error ' + err.message);
  }
}

//
// install
//
function install(gyp, argv, callback) {
  const package_json = gyp.package_json;
  const napi_build_version = napi.get_napi_build_version_from_command_args(argv);
  const source_build = gyp.opts['build-from-source'] || gyp.opts.build_from_source;
  const update_binary = gyp.opts['update-binary'] || gyp.opts.update_binary;
  const should_do_source_build = source_build === package_json.name || (source_build === true || source_build === 'true');
  if (should_do_source_build) {
    log.info('build', 'requesting source compile');
    return do_build(gyp, argv, callback);
  } else {
    const fallback_to_build = gyp.opts['fallback-to-build'] || gyp.opts.fallback_to_build;
    let should_do_fallback_build = fallback_to_build === package_json.name || (fallback_to_build === true || fallback_to_build === 'true');
    // but allow override from npm
    if (process.env.npm_config_argv) {
      const cooked = JSON.parse(process.env.npm_config_argv).cooked;
      const match = cooked.indexOf('--fallback-to-build');
      if (match > -1 && cooked.length > match && cooked[match + 1] === 'false') {
        should_do_fallback_build = false;
        log.info('install', 'Build fallback disabled via npm flag: --fallback-to-build=false');
      }
    }
    let opts;
    try {
      opts = versioning.evaluate(package_json, gyp.opts, napi_build_version);
    } catch (err) {
      return callback(err);
    }

    opts.ca = gyp.opts.ca;
    opts.cafile = gyp.opts.cafile;

    const from = opts.hosted_tarball;
    const to = opts.module_path;
    const binary_module = path.join(to, opts.module_name + '.node');
    existsAsync(binary_module, (found) => {
      if (!update_binary) {
        if (found) {
          console.log('[' + package_json.name + '] Success: "' + binary_module + '" already installed');
          console.log('Pass --update-binary to reinstall or --build-from-source to recompile');
          return callback();
        }
        log.info('check', 'checked for "' + binary_module + '" (not found)');
      }

      makeDir(to).then(() => {
        const fileName = from.startsWith('file://') && from.slice('file://'.length);
        if (fileName) {
          extract_from_local(fileName, to, after_place);
        } else {
          place_binary(from, to, opts, after_place);
        }
      }).catch((err) => {
        after_place(err);
      });

      function after_place(err) {
        if (err && should_do_fallback_build) {
          print_fallback_error(err, opts, package_json);
          return do_build(gyp, argv, callback);
        } else if (err) {
          return callback(err);
        } else {
          console.log('[' + package_json.name + '] Success: "' + binary_module + '" is installed via remote');
          return callback();
        }
      }
    });
  }
}


/***/ }),
/* 116 */
/***/ ((module) => {

"use strict";
module.exports = require("make-dir");

/***/ }),
/* 117 */
/***/ ((module) => {

"use strict";
module.exports = require("node-fetch");

/***/ }),
/* 118 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


// high-level commands
exports.c = exports.create = __webpack_require__(119)
exports.r = exports.replace = __webpack_require__(148)
exports.t = exports.list = __webpack_require__(145)
exports.u = exports.update = __webpack_require__(149)
exports.x = exports.extract = __webpack_require__(150)

// classes
exports.Pack = __webpack_require__(121)
exports.Unpack = __webpack_require__(151)
exports.Parse = __webpack_require__(146)
exports.ReadEntry = __webpack_require__(130)
exports.WriteEntry = __webpack_require__(132)
exports.Header = __webpack_require__(134)
exports.Pax = __webpack_require__(133)
exports.types = __webpack_require__(135)


/***/ }),
/* 119 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// tar -c
const hlo = __webpack_require__(120)

const Pack = __webpack_require__(121)
const fsm = __webpack_require__(143)
const t = __webpack_require__(145)
const path = __webpack_require__(58)

module.exports = (opt_, files, cb) => {
  if (typeof files === 'function') {
    cb = files
  }

  if (Array.isArray(opt_)) {
    files = opt_, opt_ = {}
  }

  if (!files || !Array.isArray(files) || !files.length) {
    throw new TypeError('no files or directories specified')
  }

  files = Array.from(files)

  const opt = hlo(opt_)

  if (opt.sync && typeof cb === 'function') {
    throw new TypeError('callback not supported for sync tar functions')
  }

  if (!opt.file && typeof cb === 'function') {
    throw new TypeError('callback only supported with file option')
  }

  return opt.file && opt.sync ? createFileSync(opt, files)
    : opt.file ? createFile(opt, files, cb)
    : opt.sync ? createSync(opt, files)
    : create(opt, files)
}

const createFileSync = (opt, files) => {
  const p = new Pack.Sync(opt)
  const stream = new fsm.WriteStreamSync(opt.file, {
    mode: opt.mode || 0o666,
  })
  p.pipe(stream)
  addFilesSync(p, files)
}

const createFile = (opt, files, cb) => {
  const p = new Pack(opt)
  const stream = new fsm.WriteStream(opt.file, {
    mode: opt.mode || 0o666,
  })
  p.pipe(stream)

  const promise = new Promise((res, rej) => {
    stream.on('error', rej)
    stream.on('close', res)
    p.on('error', rej)
  })

  addFilesAsync(p, files)

  return cb ? promise.then(cb, cb) : promise
}

const addFilesSync = (p, files) => {
  files.forEach(file => {
    if (file.charAt(0) === '@') {
      t({
        file: path.resolve(p.cwd, file.slice(1)),
        sync: true,
        noResume: true,
        onentry: entry => p.add(entry),
      })
    } else {
      p.add(file)
    }
  })
  p.end()
}

const addFilesAsync = (p, files) => {
  while (files.length) {
    const file = files.shift()
    if (file.charAt(0) === '@') {
      return t({
        file: path.resolve(p.cwd, file.slice(1)),
        noResume: true,
        onentry: entry => p.add(entry),
      }).then(_ => addFilesAsync(p, files))
    } else {
      p.add(file)
    }
  }
  p.end()
}

const createSync = (opt, files) => {
  const p = new Pack.Sync(opt)
  addFilesSync(p, files)
  return p
}

const create = (opt, files) => {
  const p = new Pack(opt)
  addFilesAsync(p, files)
  return p
}


/***/ }),
/* 120 */
/***/ ((module) => {

"use strict";


// turn tar(1) style args like `C` into the more verbose things like `cwd`

const argmap = new Map([
  ['C', 'cwd'],
  ['f', 'file'],
  ['z', 'gzip'],
  ['P', 'preservePaths'],
  ['U', 'unlink'],
  ['strip-components', 'strip'],
  ['stripComponents', 'strip'],
  ['keep-newer', 'newer'],
  ['keepNewer', 'newer'],
  ['keep-newer-files', 'newer'],
  ['keepNewerFiles', 'newer'],
  ['k', 'keep'],
  ['keep-existing', 'keep'],
  ['keepExisting', 'keep'],
  ['m', 'noMtime'],
  ['no-mtime', 'noMtime'],
  ['p', 'preserveOwner'],
  ['L', 'follow'],
  ['h', 'follow'],
])

module.exports = opt => opt ? Object.keys(opt).map(k => [
  argmap.has(k) ? argmap.get(k) : k, opt[k],
]).reduce((set, kv) => (set[kv[0]] = kv[1], set), Object.create(null)) : {}


/***/ }),
/* 121 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// A readable tar stream creator
// Technically, this is a transform stream that you write paths into,
// and tar format comes out of.
// The `add()` method is like `write()` but returns this,
// and end() return `this` as well, so you can
// do `new Pack(opt).add('files').add('dir').end().pipe(output)
// You could also do something like:
// streamOfPaths().pipe(new Pack()).pipe(new fs.WriteStream('out.tar'))

class PackJob {
  constructor (path, absolute) {
    this.path = path || './'
    this.absolute = absolute
    this.entry = null
    this.stat = null
    this.readdir = null
    this.pending = false
    this.ignore = false
    this.piped = false
  }
}

const MiniPass = __webpack_require__(122)
const zlib = __webpack_require__(124)
const ReadEntry = __webpack_require__(130)
const WriteEntry = __webpack_require__(132)
const WriteEntrySync = WriteEntry.Sync
const WriteEntryTar = WriteEntry.Tar
const Yallist = __webpack_require__(142)
const EOF = Buffer.alloc(1024)
const ONSTAT = Symbol('onStat')
const ENDED = Symbol('ended')
const QUEUE = Symbol('queue')
const CURRENT = Symbol('current')
const PROCESS = Symbol('process')
const PROCESSING = Symbol('processing')
const PROCESSJOB = Symbol('processJob')
const JOBS = Symbol('jobs')
const JOBDONE = Symbol('jobDone')
const ADDFSENTRY = Symbol('addFSEntry')
const ADDTARENTRY = Symbol('addTarEntry')
const STAT = Symbol('stat')
const READDIR = Symbol('readdir')
const ONREADDIR = Symbol('onreaddir')
const PIPE = Symbol('pipe')
const ENTRY = Symbol('entry')
const ENTRYOPT = Symbol('entryOpt')
const WRITEENTRYCLASS = Symbol('writeEntryClass')
const WRITE = Symbol('write')
const ONDRAIN = Symbol('ondrain')

const fs = __webpack_require__(57)
const path = __webpack_require__(58)
const warner = __webpack_require__(138)
const normPath = __webpack_require__(131)

const Pack = warner(class Pack extends MiniPass {
  constructor (opt) {
    super(opt)
    opt = opt || Object.create(null)
    this.opt = opt
    this.file = opt.file || ''
    this.cwd = opt.cwd || process.cwd()
    this.maxReadSize = opt.maxReadSize
    this.preservePaths = !!opt.preservePaths
    this.strict = !!opt.strict
    this.noPax = !!opt.noPax
    this.prefix = normPath(opt.prefix || '')
    this.linkCache = opt.linkCache || new Map()
    this.statCache = opt.statCache || new Map()
    this.readdirCache = opt.readdirCache || new Map()

    this[WRITEENTRYCLASS] = WriteEntry
    if (typeof opt.onwarn === 'function') {
      this.on('warn', opt.onwarn)
    }

    this.portable = !!opt.portable
    this.zip = null
    if (opt.gzip) {
      if (typeof opt.gzip !== 'object') {
        opt.gzip = {}
      }
      if (this.portable) {
        opt.gzip.portable = true
      }
      this.zip = new zlib.Gzip(opt.gzip)
      this.zip.on('data', chunk => super.write(chunk))
      this.zip.on('end', _ => super.end())
      this.zip.on('drain', _ => this[ONDRAIN]())
      this.on('resume', _ => this.zip.resume())
    } else {
      this.on('drain', this[ONDRAIN])
    }

    this.noDirRecurse = !!opt.noDirRecurse
    this.follow = !!opt.follow
    this.noMtime = !!opt.noMtime
    this.mtime = opt.mtime || null

    this.filter = typeof opt.filter === 'function' ? opt.filter : _ => true

    this[QUEUE] = new Yallist()
    this[JOBS] = 0
    this.jobs = +opt.jobs || 4
    this[PROCESSING] = false
    this[ENDED] = false
  }

  [WRITE] (chunk) {
    return super.write(chunk)
  }

  add (path) {
    this.write(path)
    return this
  }

  end (path) {
    if (path) {
      this.write(path)
    }
    this[ENDED] = true
    this[PROCESS]()
    return this
  }

  write (path) {
    if (this[ENDED]) {
      throw new Error('write after end')
    }

    if (path instanceof ReadEntry) {
      this[ADDTARENTRY](path)
    } else {
      this[ADDFSENTRY](path)
    }
    return this.flowing
  }

  [ADDTARENTRY] (p) {
    const absolute = normPath(path.resolve(this.cwd, p.path))
    // in this case, we don't have to wait for the stat
    if (!this.filter(p.path, p)) {
      p.resume()
    } else {
      const job = new PackJob(p.path, absolute, false)
      job.entry = new WriteEntryTar(p, this[ENTRYOPT](job))
      job.entry.on('end', _ => this[JOBDONE](job))
      this[JOBS] += 1
      this[QUEUE].push(job)
    }

    this[PROCESS]()
  }

  [ADDFSENTRY] (p) {
    const absolute = normPath(path.resolve(this.cwd, p))
    this[QUEUE].push(new PackJob(p, absolute))
    this[PROCESS]()
  }

  [STAT] (job) {
    job.pending = true
    this[JOBS] += 1
    const stat = this.follow ? 'stat' : 'lstat'
    fs[stat](job.absolute, (er, stat) => {
      job.pending = false
      this[JOBS] -= 1
      if (er) {
        this.emit('error', er)
      } else {
        this[ONSTAT](job, stat)
      }
    })
  }

  [ONSTAT] (job, stat) {
    this.statCache.set(job.absolute, stat)
    job.stat = stat

    // now we have the stat, we can filter it.
    if (!this.filter(job.path, stat)) {
      job.ignore = true
    }

    this[PROCESS]()
  }

  [READDIR] (job) {
    job.pending = true
    this[JOBS] += 1
    fs.readdir(job.absolute, (er, entries) => {
      job.pending = false
      this[JOBS] -= 1
      if (er) {
        return this.emit('error', er)
      }
      this[ONREADDIR](job, entries)
    })
  }

  [ONREADDIR] (job, entries) {
    this.readdirCache.set(job.absolute, entries)
    job.readdir = entries
    this[PROCESS]()
  }

  [PROCESS] () {
    if (this[PROCESSING]) {
      return
    }

    this[PROCESSING] = true
    for (let w = this[QUEUE].head;
      w !== null && this[JOBS] < this.jobs;
      w = w.next) {
      this[PROCESSJOB](w.value)
      if (w.value.ignore) {
        const p = w.next
        this[QUEUE].removeNode(w)
        w.next = p
      }
    }

    this[PROCESSING] = false

    if (this[ENDED] && !this[QUEUE].length && this[JOBS] === 0) {
      if (this.zip) {
        this.zip.end(EOF)
      } else {
        super.write(EOF)
        super.end()
      }
    }
  }

  get [CURRENT] () {
    return this[QUEUE] && this[QUEUE].head && this[QUEUE].head.value
  }

  [JOBDONE] (job) {
    this[QUEUE].shift()
    this[JOBS] -= 1
    this[PROCESS]()
  }

  [PROCESSJOB] (job) {
    if (job.pending) {
      return
    }

    if (job.entry) {
      if (job === this[CURRENT] && !job.piped) {
        this[PIPE](job)
      }
      return
    }

    if (!job.stat) {
      if (this.statCache.has(job.absolute)) {
        this[ONSTAT](job, this.statCache.get(job.absolute))
      } else {
        this[STAT](job)
      }
    }
    if (!job.stat) {
      return
    }

    // filtered out!
    if (job.ignore) {
      return
    }

    if (!this.noDirRecurse && job.stat.isDirectory() && !job.readdir) {
      if (this.readdirCache.has(job.absolute)) {
        this[ONREADDIR](job, this.readdirCache.get(job.absolute))
      } else {
        this[READDIR](job)
      }
      if (!job.readdir) {
        return
      }
    }

    // we know it doesn't have an entry, because that got checked above
    job.entry = this[ENTRY](job)
    if (!job.entry) {
      job.ignore = true
      return
    }

    if (job === this[CURRENT] && !job.piped) {
      this[PIPE](job)
    }
  }

  [ENTRYOPT] (job) {
    return {
      onwarn: (code, msg, data) => this.warn(code, msg, data),
      noPax: this.noPax,
      cwd: this.cwd,
      absolute: job.absolute,
      preservePaths: this.preservePaths,
      maxReadSize: this.maxReadSize,
      strict: this.strict,
      portable: this.portable,
      linkCache: this.linkCache,
      statCache: this.statCache,
      noMtime: this.noMtime,
      mtime: this.mtime,
      prefix: this.prefix,
    }
  }

  [ENTRY] (job) {
    this[JOBS] += 1
    try {
      return new this[WRITEENTRYCLASS](job.path, this[ENTRYOPT](job))
        .on('end', () => this[JOBDONE](job))
        .on('error', er => this.emit('error', er))
    } catch (er) {
      this.emit('error', er)
    }
  }

  [ONDRAIN] () {
    if (this[CURRENT] && this[CURRENT].entry) {
      this[CURRENT].entry.resume()
    }
  }

  // like .pipe() but using super, because our write() is special
  [PIPE] (job) {
    job.piped = true

    if (job.readdir) {
      job.readdir.forEach(entry => {
        const p = job.path
        const base = p === './' ? '' : p.replace(/\/*$/, '/')
        this[ADDFSENTRY](base + entry)
      })
    }

    const source = job.entry
    const zip = this.zip

    if (zip) {
      source.on('data', chunk => {
        if (!zip.write(chunk)) {
          source.pause()
        }
      })
    } else {
      source.on('data', chunk => {
        if (!super.write(chunk)) {
          source.pause()
        }
      })
    }
  }

  pause () {
    if (this.zip) {
      this.zip.pause()
    }
    return super.pause()
  }
})

class PackSync extends Pack {
  constructor (opt) {
    super(opt)
    this[WRITEENTRYCLASS] = WriteEntrySync
  }

  // pause/resume are no-ops in sync streams.
  pause () {}
  resume () {}

  [STAT] (job) {
    const stat = this.follow ? 'statSync' : 'lstatSync'
    this[ONSTAT](job, fs[stat](job.absolute))
  }

  [READDIR] (job, stat) {
    this[ONREADDIR](job, fs.readdirSync(job.absolute))
  }

  // gotta get it all in this tick
  [PIPE] (job) {
    const source = job.entry
    const zip = this.zip

    if (job.readdir) {
      job.readdir.forEach(entry => {
        const p = job.path
        const base = p === './' ? '' : p.replace(/\/*$/, '/')
        this[ADDFSENTRY](base + entry)
      })
    }

    if (zip) {
      source.on('data', chunk => {
        zip.write(chunk)
      })
    } else {
      source.on('data', chunk => {
        super[WRITE](chunk)
      })
    }
  }
}

Pack.Sync = PackSync

module.exports = Pack


/***/ }),
/* 122 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const proc = typeof process === 'object' && process ? process : {
  stdout: null,
  stderr: null,
}
const EE = __webpack_require__(68)
const Stream = __webpack_require__(61)
const SD = (__webpack_require__(123).StringDecoder)

const EOF = Symbol('EOF')
const MAYBE_EMIT_END = Symbol('maybeEmitEnd')
const EMITTED_END = Symbol('emittedEnd')
const EMITTING_END = Symbol('emittingEnd')
const EMITTED_ERROR = Symbol('emittedError')
const CLOSED = Symbol('closed')
const READ = Symbol('read')
const FLUSH = Symbol('flush')
const FLUSHCHUNK = Symbol('flushChunk')
const ENCODING = Symbol('encoding')
const DECODER = Symbol('decoder')
const FLOWING = Symbol('flowing')
const PAUSED = Symbol('paused')
const RESUME = Symbol('resume')
const BUFFER = Symbol('buffer')
const PIPES = Symbol('pipes')
const BUFFERLENGTH = Symbol('bufferLength')
const BUFFERPUSH = Symbol('bufferPush')
const BUFFERSHIFT = Symbol('bufferShift')
const OBJECTMODE = Symbol('objectMode')
const DESTROYED = Symbol('destroyed')
const EMITDATA = Symbol('emitData')
const EMITEND = Symbol('emitEnd')
const EMITEND2 = Symbol('emitEnd2')
const ASYNC = Symbol('async')

const defer = fn => Promise.resolve().then(fn)

// TODO remove when Node v8 support drops
const doIter = global._MP_NO_ITERATOR_SYMBOLS_  !== '1'
const ASYNCITERATOR = doIter && Symbol.asyncIterator
  || Symbol('asyncIterator not implemented')
const ITERATOR = doIter && Symbol.iterator
  || Symbol('iterator not implemented')

// events that mean 'the stream is over'
// these are treated specially, and re-emitted
// if they are listened for after emitting.
const isEndish = ev =>
  ev === 'end' ||
  ev === 'finish' ||
  ev === 'prefinish'

const isArrayBuffer = b => b instanceof ArrayBuffer ||
  typeof b === 'object' &&
  b.constructor &&
  b.constructor.name === 'ArrayBuffer' &&
  b.byteLength >= 0

const isArrayBufferView = b => !Buffer.isBuffer(b) && ArrayBuffer.isView(b)

class Pipe {
  constructor (src, dest, opts) {
    this.src = src
    this.dest = dest
    this.opts = opts
    this.ondrain = () => src[RESUME]()
    dest.on('drain', this.ondrain)
  }
  unpipe () {
    this.dest.removeListener('drain', this.ondrain)
  }
  // istanbul ignore next - only here for the prototype
  proxyErrors () {}
  end () {
    this.unpipe()
    if (this.opts.end)
      this.dest.end()
  }
}

class PipeProxyErrors extends Pipe {
  unpipe () {
    this.src.removeListener('error', this.proxyErrors)
    super.unpipe()
  }
  constructor (src, dest, opts) {
    super(src, dest, opts)
    this.proxyErrors = er => dest.emit('error', er)
    src.on('error', this.proxyErrors)
  }
}

module.exports = class Minipass extends Stream {
  constructor (options) {
    super()
    this[FLOWING] = false
    // whether we're explicitly paused
    this[PAUSED] = false
    this[PIPES] = []
    this[BUFFER] = []
    this[OBJECTMODE] = options && options.objectMode || false
    if (this[OBJECTMODE])
      this[ENCODING] = null
    else
      this[ENCODING] = options && options.encoding || null
    if (this[ENCODING] === 'buffer')
      this[ENCODING] = null
    this[ASYNC] = options && !!options.async || false
    this[DECODER] = this[ENCODING] ? new SD(this[ENCODING]) : null
    this[EOF] = false
    this[EMITTED_END] = false
    this[EMITTING_END] = false
    this[CLOSED] = false
    this[EMITTED_ERROR] = null
    this.writable = true
    this.readable = true
    this[BUFFERLENGTH] = 0
    this[DESTROYED] = false
    if (options && options.debugExposeBuffer === true) {
      Object.defineProperty(this, 'buffer', { get: () => this[BUFFER] })
    }
    if (options && options.debugExposePipes === true) {
      Object.defineProperty(this, 'pipes', { get: () => this[PIPES] })
    }
  }

  get bufferLength () { return this[BUFFERLENGTH] }

  get encoding () { return this[ENCODING] }
  set encoding (enc) {
    if (this[OBJECTMODE])
      throw new Error('cannot set encoding in objectMode')

    if (this[ENCODING] && enc !== this[ENCODING] &&
        (this[DECODER] && this[DECODER].lastNeed || this[BUFFERLENGTH]))
      throw new Error('cannot change encoding')

    if (this[ENCODING] !== enc) {
      this[DECODER] = enc ? new SD(enc) : null
      if (this[BUFFER].length)
        this[BUFFER] = this[BUFFER].map(chunk => this[DECODER].write(chunk))
    }

    this[ENCODING] = enc
  }

  setEncoding (enc) {
    this.encoding = enc
  }

  get objectMode () { return this[OBJECTMODE] }
  set objectMode (om) { this[OBJECTMODE] = this[OBJECTMODE] || !!om }

  get ['async'] () { return this[ASYNC] }
  set ['async'] (a) { this[ASYNC] = this[ASYNC] || !!a }

  write (chunk, encoding, cb) {
    if (this[EOF])
      throw new Error('write after end')

    if (this[DESTROYED]) {
      this.emit('error', Object.assign(
        new Error('Cannot call write after a stream was destroyed'),
        { code: 'ERR_STREAM_DESTROYED' }
      ))
      return true
    }

    if (typeof encoding === 'function')
      cb = encoding, encoding = 'utf8'

    if (!encoding)
      encoding = 'utf8'

    const fn = this[ASYNC] ? defer : f => f()

    // convert array buffers and typed array views into buffers
    // at some point in the future, we may want to do the opposite!
    // leave strings and buffers as-is
    // anything else switches us into object mode
    if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
      if (isArrayBufferView(chunk))
        chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)
      else if (isArrayBuffer(chunk))
        chunk = Buffer.from(chunk)
      else if (typeof chunk !== 'string')
        // use the setter so we throw if we have encoding set
        this.objectMode = true
    }

    // handle object mode up front, since it's simpler
    // this yields better performance, fewer checks later.
    if (this[OBJECTMODE]) {
      /* istanbul ignore if - maybe impossible? */
      if (this.flowing && this[BUFFERLENGTH] !== 0)
        this[FLUSH](true)

      if (this.flowing)
        this.emit('data', chunk)
      else
        this[BUFFERPUSH](chunk)

      if (this[BUFFERLENGTH] !== 0)
        this.emit('readable')

      if (cb)
        fn(cb)

      return this.flowing
    }

    // at this point the chunk is a buffer or string
    // don't buffer it up or send it to the decoder
    if (!chunk.length) {
      if (this[BUFFERLENGTH] !== 0)
        this.emit('readable')
      if (cb)
        fn(cb)
      return this.flowing
    }

    // fast-path writing strings of same encoding to a stream with
    // an empty buffer, skipping the buffer/decoder dance
    if (typeof chunk === 'string' &&
        // unless it is a string already ready for us to use
        !(encoding === this[ENCODING] && !this[DECODER].lastNeed)) {
      chunk = Buffer.from(chunk, encoding)
    }

    if (Buffer.isBuffer(chunk) && this[ENCODING])
      chunk = this[DECODER].write(chunk)

    // Note: flushing CAN potentially switch us into not-flowing mode
    if (this.flowing && this[BUFFERLENGTH] !== 0)
      this[FLUSH](true)

    if (this.flowing)
      this.emit('data', chunk)
    else
      this[BUFFERPUSH](chunk)

    if (this[BUFFERLENGTH] !== 0)
      this.emit('readable')

    if (cb)
      fn(cb)

    return this.flowing
  }

  read (n) {
    if (this[DESTROYED])
      return null

    if (this[BUFFERLENGTH] === 0 || n === 0 || n > this[BUFFERLENGTH]) {
      this[MAYBE_EMIT_END]()
      return null
    }

    if (this[OBJECTMODE])
      n = null

    if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
      if (this.encoding)
        this[BUFFER] = [this[BUFFER].join('')]
      else
        this[BUFFER] = [Buffer.concat(this[BUFFER], this[BUFFERLENGTH])]
    }

    const ret = this[READ](n || null, this[BUFFER][0])
    this[MAYBE_EMIT_END]()
    return ret
  }

  [READ] (n, chunk) {
    if (n === chunk.length || n === null)
      this[BUFFERSHIFT]()
    else {
      this[BUFFER][0] = chunk.slice(n)
      chunk = chunk.slice(0, n)
      this[BUFFERLENGTH] -= n
    }

    this.emit('data', chunk)

    if (!this[BUFFER].length && !this[EOF])
      this.emit('drain')

    return chunk
  }

  end (chunk, encoding, cb) {
    if (typeof chunk === 'function')
      cb = chunk, chunk = null
    if (typeof encoding === 'function')
      cb = encoding, encoding = 'utf8'
    if (chunk)
      this.write(chunk, encoding)
    if (cb)
      this.once('end', cb)
    this[EOF] = true
    this.writable = false

    // if we haven't written anything, then go ahead and emit,
    // even if we're not reading.
    // we'll re-emit if a new 'end' listener is added anyway.
    // This makes MP more suitable to write-only use cases.
    if (this.flowing || !this[PAUSED])
      this[MAYBE_EMIT_END]()
    return this
  }

  // don't let the internal resume be overwritten
  [RESUME] () {
    if (this[DESTROYED])
      return

    this[PAUSED] = false
    this[FLOWING] = true
    this.emit('resume')
    if (this[BUFFER].length)
      this[FLUSH]()
    else if (this[EOF])
      this[MAYBE_EMIT_END]()
    else
      this.emit('drain')
  }

  resume () {
    return this[RESUME]()
  }

  pause () {
    this[FLOWING] = false
    this[PAUSED] = true
  }

  get destroyed () {
    return this[DESTROYED]
  }

  get flowing () {
    return this[FLOWING]
  }

  get paused () {
    return this[PAUSED]
  }

  [BUFFERPUSH] (chunk) {
    if (this[OBJECTMODE])
      this[BUFFERLENGTH] += 1
    else
      this[BUFFERLENGTH] += chunk.length
    this[BUFFER].push(chunk)
  }

  [BUFFERSHIFT] () {
    if (this[BUFFER].length) {
      if (this[OBJECTMODE])
        this[BUFFERLENGTH] -= 1
      else
        this[BUFFERLENGTH] -= this[BUFFER][0].length
    }
    return this[BUFFER].shift()
  }

  [FLUSH] (noDrain) {
    do {} while (this[FLUSHCHUNK](this[BUFFERSHIFT]()))

    if (!noDrain && !this[BUFFER].length && !this[EOF])
      this.emit('drain')
  }

  [FLUSHCHUNK] (chunk) {
    return chunk ? (this.emit('data', chunk), this.flowing) : false
  }

  pipe (dest, opts) {
    if (this[DESTROYED])
      return

    const ended = this[EMITTED_END]
    opts = opts || {}
    if (dest === proc.stdout || dest === proc.stderr)
      opts.end = false
    else
      opts.end = opts.end !== false
    opts.proxyErrors = !!opts.proxyErrors

    // piping an ended stream ends immediately
    if (ended) {
      if (opts.end)
        dest.end()
    } else {
      this[PIPES].push(!opts.proxyErrors ? new Pipe(this, dest, opts)
        : new PipeProxyErrors(this, dest, opts))
      if (this[ASYNC])
        defer(() => this[RESUME]())
      else
        this[RESUME]()
    }

    return dest
  }

  unpipe (dest) {
    const p = this[PIPES].find(p => p.dest === dest)
    if (p) {
      this[PIPES].splice(this[PIPES].indexOf(p), 1)
      p.unpipe()
    }
  }

  addListener (ev, fn) {
    return this.on(ev, fn)
  }

  on (ev, fn) {
    const ret = super.on(ev, fn)
    if (ev === 'data' && !this[PIPES].length && !this.flowing)
      this[RESUME]()
    else if (ev === 'readable' && this[BUFFERLENGTH] !== 0)
      super.emit('readable')
    else if (isEndish(ev) && this[EMITTED_END]) {
      super.emit(ev)
      this.removeAllListeners(ev)
    } else if (ev === 'error' && this[EMITTED_ERROR]) {
      if (this[ASYNC])
        defer(() => fn.call(this, this[EMITTED_ERROR]))
      else
        fn.call(this, this[EMITTED_ERROR])
    }
    return ret
  }

  get emittedEnd () {
    return this[EMITTED_END]
  }

  [MAYBE_EMIT_END] () {
    if (!this[EMITTING_END] &&
        !this[EMITTED_END] &&
        !this[DESTROYED] &&
        this[BUFFER].length === 0 &&
        this[EOF]) {
      this[EMITTING_END] = true
      this.emit('end')
      this.emit('prefinish')
      this.emit('finish')
      if (this[CLOSED])
        this.emit('close')
      this[EMITTING_END] = false
    }
  }

  emit (ev, data, ...extra) {
    // error and close are only events allowed after calling destroy()
    if (ev !== 'error' && ev !== 'close' && ev !== DESTROYED && this[DESTROYED])
      return
    else if (ev === 'data') {
      return !data ? false
        : this[ASYNC] ? defer(() => this[EMITDATA](data))
        : this[EMITDATA](data)
    } else if (ev === 'end') {
      return this[EMITEND]()
    } else if (ev === 'close') {
      this[CLOSED] = true
      // don't emit close before 'end' and 'finish'
      if (!this[EMITTED_END] && !this[DESTROYED])
        return
      const ret = super.emit('close')
      this.removeAllListeners('close')
      return ret
    } else if (ev === 'error') {
      this[EMITTED_ERROR] = data
      const ret = super.emit('error', data)
      this[MAYBE_EMIT_END]()
      return ret
    } else if (ev === 'resume') {
      const ret = super.emit('resume')
      this[MAYBE_EMIT_END]()
      return ret
    } else if (ev === 'finish' || ev === 'prefinish') {
      const ret = super.emit(ev)
      this.removeAllListeners(ev)
      return ret
    }

    // Some other unknown event
    const ret = super.emit(ev, data, ...extra)
    this[MAYBE_EMIT_END]()
    return ret
  }

  [EMITDATA] (data) {
    for (const p of this[PIPES]) {
      if (p.dest.write(data) === false)
        this.pause()
    }
    const ret = super.emit('data', data)
    this[MAYBE_EMIT_END]()
    return ret
  }

  [EMITEND] () {
    if (this[EMITTED_END])
      return

    this[EMITTED_END] = true
    this.readable = false
    if (this[ASYNC])
      defer(() => this[EMITEND2]())
    else
      this[EMITEND2]()
  }

  [EMITEND2] () {
    if (this[DECODER]) {
      const data = this[DECODER].end()
      if (data) {
        for (const p of this[PIPES]) {
          p.dest.write(data)
        }
        super.emit('data', data)
      }
    }

    for (const p of this[PIPES]) {
      p.end()
    }
    const ret = super.emit('end')
    this.removeAllListeners('end')
    return ret
  }

  // const all = await stream.collect()
  collect () {
    const buf = []
    if (!this[OBJECTMODE])
      buf.dataLength = 0
    // set the promise first, in case an error is raised
    // by triggering the flow here.
    const p = this.promise()
    this.on('data', c => {
      buf.push(c)
      if (!this[OBJECTMODE])
        buf.dataLength += c.length
    })
    return p.then(() => buf)
  }

  // const data = await stream.concat()
  concat () {
    return this[OBJECTMODE]
      ? Promise.reject(new Error('cannot concat in objectMode'))
      : this.collect().then(buf =>
          this[OBJECTMODE]
            ? Promise.reject(new Error('cannot concat in objectMode'))
            : this[ENCODING] ? buf.join('') : Buffer.concat(buf, buf.dataLength))
  }

  // stream.promise().then(() => done, er => emitted error)
  promise () {
    return new Promise((resolve, reject) => {
      this.on(DESTROYED, () => reject(new Error('stream destroyed')))
      this.on('error', er => reject(er))
      this.on('end', () => resolve())
    })
  }

  // for await (let chunk of stream)
  [ASYNCITERATOR] () {
    const next = () => {
      const res = this.read()
      if (res !== null)
        return Promise.resolve({ done: false, value: res })

      if (this[EOF])
        return Promise.resolve({ done: true })

      let resolve = null
      let reject = null
      const onerr = er => {
        this.removeListener('data', ondata)
        this.removeListener('end', onend)
        reject(er)
      }
      const ondata = value => {
        this.removeListener('error', onerr)
        this.removeListener('end', onend)
        this.pause()
        resolve({ value: value, done: !!this[EOF] })
      }
      const onend = () => {
        this.removeListener('error', onerr)
        this.removeListener('data', ondata)
        resolve({ done: true })
      }
      const ondestroy = () => onerr(new Error('stream destroyed'))
      return new Promise((res, rej) => {
        reject = rej
        resolve = res
        this.once(DESTROYED, ondestroy)
        this.once('error', onerr)
        this.once('end', onend)
        this.once('data', ondata)
      })
    }

    return { next }
  }

  // for (let chunk of stream)
  [ITERATOR] () {
    const next = () => {
      const value = this.read()
      const done = value === null
      return { value, done }
    }
    return { next }
  }

  destroy (er) {
    if (this[DESTROYED]) {
      if (er)
        this.emit('error', er)
      else
        this.emit(DESTROYED)
      return this
    }

    this[DESTROYED] = true

    // throw away all buffered data, it's never coming out
    this[BUFFER].length = 0
    this[BUFFERLENGTH] = 0

    if (typeof this.close === 'function' && !this[CLOSED])
      this.close()

    if (er)
      this.emit('error', er)
    else // if no error to emit, still reject pending promises
      this.emit(DESTROYED)

    return this
  }

  static isStream (s) {
    return !!s && (s instanceof Minipass || s instanceof Stream ||
      s instanceof EE && (
        typeof s.pipe === 'function' || // readable
        (typeof s.write === 'function' && typeof s.end === 'function') // writable
      ))
  }
}


/***/ }),
/* 123 */
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),
/* 124 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const assert = __webpack_require__(125)
const Buffer = (__webpack_require__(126).Buffer)
const realZlib = __webpack_require__(127)

const constants = exports.constants = __webpack_require__(128)
const Minipass = __webpack_require__(129)

const OriginalBufferConcat = Buffer.concat

const _superWrite = Symbol('_superWrite')
class ZlibError extends Error {
  constructor (err) {
    super('zlib: ' + err.message)
    this.code = err.code
    this.errno = err.errno
    /* istanbul ignore if */
    if (!this.code)
      this.code = 'ZLIB_ERROR'

    this.message = 'zlib: ' + err.message
    Error.captureStackTrace(this, this.constructor)
  }

  get name () {
    return 'ZlibError'
  }
}

// the Zlib class they all inherit from
// This thing manages the queue of requests, and returns
// true or false if there is anything in the queue when
// you call the .write() method.
const _opts = Symbol('opts')
const _flushFlag = Symbol('flushFlag')
const _finishFlushFlag = Symbol('finishFlushFlag')
const _fullFlushFlag = Symbol('fullFlushFlag')
const _handle = Symbol('handle')
const _onError = Symbol('onError')
const _sawError = Symbol('sawError')
const _level = Symbol('level')
const _strategy = Symbol('strategy')
const _ended = Symbol('ended')
const _defaultFullFlush = Symbol('_defaultFullFlush')

class ZlibBase extends Minipass {
  constructor (opts, mode) {
    if (!opts || typeof opts !== 'object')
      throw new TypeError('invalid options for ZlibBase constructor')

    super(opts)
    this[_sawError] = false
    this[_ended] = false
    this[_opts] = opts

    this[_flushFlag] = opts.flush
    this[_finishFlushFlag] = opts.finishFlush
    // this will throw if any options are invalid for the class selected
    try {
      this[_handle] = new realZlib[mode](opts)
    } catch (er) {
      // make sure that all errors get decorated properly
      throw new ZlibError(er)
    }

    this[_onError] = (err) => {
      // no sense raising multiple errors, since we abort on the first one.
      if (this[_sawError])
        return

      this[_sawError] = true

      // there is no way to cleanly recover.
      // continuing only obscures problems.
      this.close()
      this.emit('error', err)
    }

    this[_handle].on('error', er => this[_onError](new ZlibError(er)))
    this.once('end', () => this.close)
  }

  close () {
    if (this[_handle]) {
      this[_handle].close()
      this[_handle] = null
      this.emit('close')
    }
  }

  reset () {
    if (!this[_sawError]) {
      assert(this[_handle], 'zlib binding closed')
      return this[_handle].reset()
    }
  }

  flush (flushFlag) {
    if (this.ended)
      return

    if (typeof flushFlag !== 'number')
      flushFlag = this[_fullFlushFlag]
    this.write(Object.assign(Buffer.alloc(0), { [_flushFlag]: flushFlag }))
  }

  end (chunk, encoding, cb) {
    if (chunk)
      this.write(chunk, encoding)
    this.flush(this[_finishFlushFlag])
    this[_ended] = true
    return super.end(null, null, cb)
  }

  get ended () {
    return this[_ended]
  }

  write (chunk, encoding, cb) {
    // process the chunk using the sync process
    // then super.write() all the outputted chunks
    if (typeof encoding === 'function')
      cb = encoding, encoding = 'utf8'

    if (typeof chunk === 'string')
      chunk = Buffer.from(chunk, encoding)

    if (this[_sawError])
      return
    assert(this[_handle], 'zlib binding closed')

    // _processChunk tries to .close() the native handle after it's done, so we
    // intercept that by temporarily making it a no-op.
    const nativeHandle = this[_handle]._handle
    const originalNativeClose = nativeHandle.close
    nativeHandle.close = () => {}
    const originalClose = this[_handle].close
    this[_handle].close = () => {}
    // It also calls `Buffer.concat()` at the end, which may be convenient
    // for some, but which we are not interested in as it slows us down.
    Buffer.concat = (args) => args
    let result
    try {
      const flushFlag = typeof chunk[_flushFlag] === 'number'
        ? chunk[_flushFlag] : this[_flushFlag]
      result = this[_handle]._processChunk(chunk, flushFlag)
      // if we don't throw, reset it back how it was
      Buffer.concat = OriginalBufferConcat
    } catch (err) {
      // or if we do, put Buffer.concat() back before we emit error
      // Error events call into user code, which may call Buffer.concat()
      Buffer.concat = OriginalBufferConcat
      this[_onError](new ZlibError(err))
    } finally {
      if (this[_handle]) {
        // Core zlib resets `_handle` to null after attempting to close the
        // native handle. Our no-op handler prevented actual closure, but we
        // need to restore the `._handle` property.
        this[_handle]._handle = nativeHandle
        nativeHandle.close = originalNativeClose
        this[_handle].close = originalClose
        // `_processChunk()` adds an 'error' listener. If we don't remove it
        // after each call, these handlers start piling up.
        this[_handle].removeAllListeners('error')
        // make sure OUR error listener is still attached tho
      }
    }

    if (this[_handle])
      this[_handle].on('error', er => this[_onError](new ZlibError(er)))

    let writeReturn
    if (result) {
      if (Array.isArray(result) && result.length > 0) {
        // The first buffer is always `handle._outBuffer`, which would be
        // re-used for later invocations; so, we always have to copy that one.
        writeReturn = this[_superWrite](Buffer.from(result[0]))
        for (let i = 1; i < result.length; i++) {
          writeReturn = this[_superWrite](result[i])
        }
      } else {
        writeReturn = this[_superWrite](Buffer.from(result))
      }
    }

    if (cb)
      cb()
    return writeReturn
  }

  [_superWrite] (data) {
    return super.write(data)
  }
}

class Zlib extends ZlibBase {
  constructor (opts, mode) {
    opts = opts || {}

    opts.flush = opts.flush || constants.Z_NO_FLUSH
    opts.finishFlush = opts.finishFlush || constants.Z_FINISH
    super(opts, mode)

    this[_fullFlushFlag] = constants.Z_FULL_FLUSH
    this[_level] = opts.level
    this[_strategy] = opts.strategy
  }

  params (level, strategy) {
    if (this[_sawError])
      return

    if (!this[_handle])
      throw new Error('cannot switch params when binding is closed')

    // no way to test this without also not supporting params at all
    /* istanbul ignore if */
    if (!this[_handle].params)
      throw new Error('not supported in this implementation')

    if (this[_level] !== level || this[_strategy] !== strategy) {
      this.flush(constants.Z_SYNC_FLUSH)
      assert(this[_handle], 'zlib binding closed')
      // .params() calls .flush(), but the latter is always async in the
      // core zlib. We override .flush() temporarily to intercept that and
      // flush synchronously.
      const origFlush = this[_handle].flush
      this[_handle].flush = (flushFlag, cb) => {
        this.flush(flushFlag)
        cb()
      }
      try {
        this[_handle].params(level, strategy)
      } finally {
        this[_handle].flush = origFlush
      }
      /* istanbul ignore else */
      if (this[_handle]) {
        this[_level] = level
        this[_strategy] = strategy
      }
    }
  }
}

// minimal 2-byte header
class Deflate extends Zlib {
  constructor (opts) {
    super(opts, 'Deflate')
  }
}

class Inflate extends Zlib {
  constructor (opts) {
    super(opts, 'Inflate')
  }
}

// gzip - bigger header, same deflate compression
const _portable = Symbol('_portable')
class Gzip extends Zlib {
  constructor (opts) {
    super(opts, 'Gzip')
    this[_portable] = opts && !!opts.portable
  }

  [_superWrite] (data) {
    if (!this[_portable])
      return super[_superWrite](data)

    // we'll always get the header emitted in one first chunk
    // overwrite the OS indicator byte with 0xFF
    this[_portable] = false
    data[9] = 255
    return super[_superWrite](data)
  }
}

class Gunzip extends Zlib {
  constructor (opts) {
    super(opts, 'Gunzip')
  }
}

// raw - no header
class DeflateRaw extends Zlib {
  constructor (opts) {
    super(opts, 'DeflateRaw')
  }
}

class InflateRaw extends Zlib {
  constructor (opts) {
    super(opts, 'InflateRaw')
  }
}

// auto-detect header.
class Unzip extends Zlib {
  constructor (opts) {
    super(opts, 'Unzip')
  }
}

class Brotli extends ZlibBase {
  constructor (opts, mode) {
    opts = opts || {}

    opts.flush = opts.flush || constants.BROTLI_OPERATION_PROCESS
    opts.finishFlush = opts.finishFlush || constants.BROTLI_OPERATION_FINISH

    super(opts, mode)

    this[_fullFlushFlag] = constants.BROTLI_OPERATION_FLUSH
  }
}

class BrotliCompress extends Brotli {
  constructor (opts) {
    super(opts, 'BrotliCompress')
  }
}

class BrotliDecompress extends Brotli {
  constructor (opts) {
    super(opts, 'BrotliDecompress')
  }
}

exports.Deflate = Deflate
exports.Inflate = Inflate
exports.Gzip = Gzip
exports.Gunzip = Gunzip
exports.DeflateRaw = DeflateRaw
exports.InflateRaw = InflateRaw
exports.Unzip = Unzip
/* istanbul ignore else */
if (typeof realZlib.BrotliCompress === 'function') {
  exports.BrotliCompress = BrotliCompress
  exports.BrotliDecompress = BrotliDecompress
} else {
  exports.BrotliCompress = exports.BrotliDecompress = class {
    constructor () {
      throw new Error('Brotli is not supported in this version of Node.js')
    }
  }
}


/***/ }),
/* 125 */
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),
/* 126 */
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),
/* 127 */
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),
/* 128 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Update with any zlib constants that are added or changed in the future.
// Node v6 didn't export this, so we just hard code the version and rely
// on all the other hard-coded values from zlib v4736.  When node v6
// support drops, we can just export the realZlibConstants object.
const realZlibConstants = (__webpack_require__(127).constants) ||
  /* istanbul ignore next */ { ZLIB_VERNUM: 4736 }

module.exports = Object.freeze(Object.assign(Object.create(null), {
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  Z_VERSION_ERROR: -6,
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,
  DEFLATE: 1,
  INFLATE: 2,
  GZIP: 3,
  GUNZIP: 4,
  DEFLATERAW: 5,
  INFLATERAW: 6,
  UNZIP: 7,
  BROTLI_DECODE: 8,
  BROTLI_ENCODE: 9,
  Z_MIN_WINDOWBITS: 8,
  Z_MAX_WINDOWBITS: 15,
  Z_DEFAULT_WINDOWBITS: 15,
  Z_MIN_CHUNK: 64,
  Z_MAX_CHUNK: Infinity,
  Z_DEFAULT_CHUNK: 16384,
  Z_MIN_MEMLEVEL: 1,
  Z_MAX_MEMLEVEL: 9,
  Z_DEFAULT_MEMLEVEL: 8,
  Z_MIN_LEVEL: -1,
  Z_MAX_LEVEL: 9,
  Z_DEFAULT_LEVEL: -1,
  BROTLI_OPERATION_PROCESS: 0,
  BROTLI_OPERATION_FLUSH: 1,
  BROTLI_OPERATION_FINISH: 2,
  BROTLI_OPERATION_EMIT_METADATA: 3,
  BROTLI_MODE_GENERIC: 0,
  BROTLI_MODE_TEXT: 1,
  BROTLI_MODE_FONT: 2,
  BROTLI_DEFAULT_MODE: 0,
  BROTLI_MIN_QUALITY: 0,
  BROTLI_MAX_QUALITY: 11,
  BROTLI_DEFAULT_QUALITY: 11,
  BROTLI_MIN_WINDOW_BITS: 10,
  BROTLI_MAX_WINDOW_BITS: 24,
  BROTLI_LARGE_MAX_WINDOW_BITS: 30,
  BROTLI_DEFAULT_WINDOW: 22,
  BROTLI_MIN_INPUT_BLOCK_BITS: 16,
  BROTLI_MAX_INPUT_BLOCK_BITS: 24,
  BROTLI_PARAM_MODE: 0,
  BROTLI_PARAM_QUALITY: 1,
  BROTLI_PARAM_LGWIN: 2,
  BROTLI_PARAM_LGBLOCK: 3,
  BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
  BROTLI_PARAM_SIZE_HINT: 5,
  BROTLI_PARAM_LARGE_WINDOW: 6,
  BROTLI_PARAM_NPOSTFIX: 7,
  BROTLI_PARAM_NDIRECT: 8,
  BROTLI_DECODER_RESULT_ERROR: 0,
  BROTLI_DECODER_RESULT_SUCCESS: 1,
  BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
  BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
  BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
  BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
  BROTLI_DECODER_NO_ERROR: 0,
  BROTLI_DECODER_SUCCESS: 1,
  BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
  BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
  BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
  BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
  BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
  BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
  BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
  BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
  BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
  BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
  BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
  BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
  BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
  BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
  BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
  BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
  BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
  BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
  BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
  BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
  BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
  BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
  BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
  BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
  BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
  BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
  BROTLI_DECODER_ERROR_UNREACHABLE: -31,
}, realZlibConstants))


/***/ }),
/* 129 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const proc = typeof process === 'object' && process ? process : {
  stdout: null,
  stderr: null,
}
const EE = __webpack_require__(68)
const Stream = __webpack_require__(61)
const SD = (__webpack_require__(123).StringDecoder)

const EOF = Symbol('EOF')
const MAYBE_EMIT_END = Symbol('maybeEmitEnd')
const EMITTED_END = Symbol('emittedEnd')
const EMITTING_END = Symbol('emittingEnd')
const EMITTED_ERROR = Symbol('emittedError')
const CLOSED = Symbol('closed')
const READ = Symbol('read')
const FLUSH = Symbol('flush')
const FLUSHCHUNK = Symbol('flushChunk')
const ENCODING = Symbol('encoding')
const DECODER = Symbol('decoder')
const FLOWING = Symbol('flowing')
const PAUSED = Symbol('paused')
const RESUME = Symbol('resume')
const BUFFERLENGTH = Symbol('bufferLength')
const BUFFERPUSH = Symbol('bufferPush')
const BUFFERSHIFT = Symbol('bufferShift')
const OBJECTMODE = Symbol('objectMode')
const DESTROYED = Symbol('destroyed')
const EMITDATA = Symbol('emitData')
const EMITEND = Symbol('emitEnd')
const EMITEND2 = Symbol('emitEnd2')
const ASYNC = Symbol('async')

const defer = fn => Promise.resolve().then(fn)

// TODO remove when Node v8 support drops
const doIter = global._MP_NO_ITERATOR_SYMBOLS_  !== '1'
const ASYNCITERATOR = doIter && Symbol.asyncIterator
  || Symbol('asyncIterator not implemented')
const ITERATOR = doIter && Symbol.iterator
  || Symbol('iterator not implemented')

// events that mean 'the stream is over'
// these are treated specially, and re-emitted
// if they are listened for after emitting.
const isEndish = ev =>
  ev === 'end' ||
  ev === 'finish' ||
  ev === 'prefinish'

const isArrayBuffer = b => b instanceof ArrayBuffer ||
  typeof b === 'object' &&
  b.constructor &&
  b.constructor.name === 'ArrayBuffer' &&
  b.byteLength >= 0

const isArrayBufferView = b => !Buffer.isBuffer(b) && ArrayBuffer.isView(b)

class Pipe {
  constructor (src, dest, opts) {
    this.src = src
    this.dest = dest
    this.opts = opts
    this.ondrain = () => src[RESUME]()
    dest.on('drain', this.ondrain)
  }
  unpipe () {
    this.dest.removeListener('drain', this.ondrain)
  }
  // istanbul ignore next - only here for the prototype
  proxyErrors () {}
  end () {
    this.unpipe()
    if (this.opts.end)
      this.dest.end()
  }
}

class PipeProxyErrors extends Pipe {
  unpipe () {
    this.src.removeListener('error', this.proxyErrors)
    super.unpipe()
  }
  constructor (src, dest, opts) {
    super(src, dest, opts)
    this.proxyErrors = er => dest.emit('error', er)
    src.on('error', this.proxyErrors)
  }
}

module.exports = class Minipass extends Stream {
  constructor (options) {
    super()
    this[FLOWING] = false
    // whether we're explicitly paused
    this[PAUSED] = false
    this.pipes = []
    this.buffer = []
    this[OBJECTMODE] = options && options.objectMode || false
    if (this[OBJECTMODE])
      this[ENCODING] = null
    else
      this[ENCODING] = options && options.encoding || null
    if (this[ENCODING] === 'buffer')
      this[ENCODING] = null
    this[ASYNC] = options && !!options.async || false
    this[DECODER] = this[ENCODING] ? new SD(this[ENCODING]) : null
    this[EOF] = false
    this[EMITTED_END] = false
    this[EMITTING_END] = false
    this[CLOSED] = false
    this[EMITTED_ERROR] = null
    this.writable = true
    this.readable = true
    this[BUFFERLENGTH] = 0
    this[DESTROYED] = false
  }

  get bufferLength () { return this[BUFFERLENGTH] }

  get encoding () { return this[ENCODING] }
  set encoding (enc) {
    if (this[OBJECTMODE])
      throw new Error('cannot set encoding in objectMode')

    if (this[ENCODING] && enc !== this[ENCODING] &&
        (this[DECODER] && this[DECODER].lastNeed || this[BUFFERLENGTH]))
      throw new Error('cannot change encoding')

    if (this[ENCODING] !== enc) {
      this[DECODER] = enc ? new SD(enc) : null
      if (this.buffer.length)
        this.buffer = this.buffer.map(chunk => this[DECODER].write(chunk))
    }

    this[ENCODING] = enc
  }

  setEncoding (enc) {
    this.encoding = enc
  }

  get objectMode () { return this[OBJECTMODE] }
  set objectMode (om) { this[OBJECTMODE] = this[OBJECTMODE] || !!om }

  get ['async'] () { return this[ASYNC] }
  set ['async'] (a) { this[ASYNC] = this[ASYNC] || !!a }

  write (chunk, encoding, cb) {
    if (this[EOF])
      throw new Error('write after end')

    if (this[DESTROYED]) {
      this.emit('error', Object.assign(
        new Error('Cannot call write after a stream was destroyed'),
        { code: 'ERR_STREAM_DESTROYED' }
      ))
      return true
    }

    if (typeof encoding === 'function')
      cb = encoding, encoding = 'utf8'

    if (!encoding)
      encoding = 'utf8'

    const fn = this[ASYNC] ? defer : f => f()

    // convert array buffers and typed array views into buffers
    // at some point in the future, we may want to do the opposite!
    // leave strings and buffers as-is
    // anything else switches us into object mode
    if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
      if (isArrayBufferView(chunk))
        chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)
      else if (isArrayBuffer(chunk))
        chunk = Buffer.from(chunk)
      else if (typeof chunk !== 'string')
        // use the setter so we throw if we have encoding set
        this.objectMode = true
    }

    // handle object mode up front, since it's simpler
    // this yields better performance, fewer checks later.
    if (this[OBJECTMODE]) {
      /* istanbul ignore if - maybe impossible? */
      if (this.flowing && this[BUFFERLENGTH] !== 0)
        this[FLUSH](true)

      if (this.flowing)
        this.emit('data', chunk)
      else
        this[BUFFERPUSH](chunk)

      if (this[BUFFERLENGTH] !== 0)
        this.emit('readable')

      if (cb)
        fn(cb)

      return this.flowing
    }

    // at this point the chunk is a buffer or string
    // don't buffer it up or send it to the decoder
    if (!chunk.length) {
      if (this[BUFFERLENGTH] !== 0)
        this.emit('readable')
      if (cb)
        fn(cb)
      return this.flowing
    }

    // fast-path writing strings of same encoding to a stream with
    // an empty buffer, skipping the buffer/decoder dance
    if (typeof chunk === 'string' &&
        // unless it is a string already ready for us to use
        !(encoding === this[ENCODING] && !this[DECODER].lastNeed)) {
      chunk = Buffer.from(chunk, encoding)
    }

    if (Buffer.isBuffer(chunk) && this[ENCODING])
      chunk = this[DECODER].write(chunk)

    // Note: flushing CAN potentially switch us into not-flowing mode
    if (this.flowing && this[BUFFERLENGTH] !== 0)
      this[FLUSH](true)

    if (this.flowing)
      this.emit('data', chunk)
    else
      this[BUFFERPUSH](chunk)

    if (this[BUFFERLENGTH] !== 0)
      this.emit('readable')

    if (cb)
      fn(cb)

    return this.flowing
  }

  read (n) {
    if (this[DESTROYED])
      return null

    if (this[BUFFERLENGTH] === 0 || n === 0 || n > this[BUFFERLENGTH]) {
      this[MAYBE_EMIT_END]()
      return null
    }

    if (this[OBJECTMODE])
      n = null

    if (this.buffer.length > 1 && !this[OBJECTMODE]) {
      if (this.encoding)
        this.buffer = [this.buffer.join('')]
      else
        this.buffer = [Buffer.concat(this.buffer, this[BUFFERLENGTH])]
    }

    const ret = this[READ](n || null, this.buffer[0])
    this[MAYBE_EMIT_END]()
    return ret
  }

  [READ] (n, chunk) {
    if (n === chunk.length || n === null)
      this[BUFFERSHIFT]()
    else {
      this.buffer[0] = chunk.slice(n)
      chunk = chunk.slice(0, n)
      this[BUFFERLENGTH] -= n
    }

    this.emit('data', chunk)

    if (!this.buffer.length && !this[EOF])
      this.emit('drain')

    return chunk
  }

  end (chunk, encoding, cb) {
    if (typeof chunk === 'function')
      cb = chunk, chunk = null
    if (typeof encoding === 'function')
      cb = encoding, encoding = 'utf8'
    if (chunk)
      this.write(chunk, encoding)
    if (cb)
      this.once('end', cb)
    this[EOF] = true
    this.writable = false

    // if we haven't written anything, then go ahead and emit,
    // even if we're not reading.
    // we'll re-emit if a new 'end' listener is added anyway.
    // This makes MP more suitable to write-only use cases.
    if (this.flowing || !this[PAUSED])
      this[MAYBE_EMIT_END]()
    return this
  }

  // don't let the internal resume be overwritten
  [RESUME] () {
    if (this[DESTROYED])
      return

    this[PAUSED] = false
    this[FLOWING] = true
    this.emit('resume')
    if (this.buffer.length)
      this[FLUSH]()
    else if (this[EOF])
      this[MAYBE_EMIT_END]()
    else
      this.emit('drain')
  }

  resume () {
    return this[RESUME]()
  }

  pause () {
    this[FLOWING] = false
    this[PAUSED] = true
  }

  get destroyed () {
    return this[DESTROYED]
  }

  get flowing () {
    return this[FLOWING]
  }

  get paused () {
    return this[PAUSED]
  }

  [BUFFERPUSH] (chunk) {
    if (this[OBJECTMODE])
      this[BUFFERLENGTH] += 1
    else
      this[BUFFERLENGTH] += chunk.length
    this.buffer.push(chunk)
  }

  [BUFFERSHIFT] () {
    if (this.buffer.length) {
      if (this[OBJECTMODE])
        this[BUFFERLENGTH] -= 1
      else
        this[BUFFERLENGTH] -= this.buffer[0].length
    }
    return this.buffer.shift()
  }

  [FLUSH] (noDrain) {
    do {} while (this[FLUSHCHUNK](this[BUFFERSHIFT]()))

    if (!noDrain && !this.buffer.length && !this[EOF])
      this.emit('drain')
  }

  [FLUSHCHUNK] (chunk) {
    return chunk ? (this.emit('data', chunk), this.flowing) : false
  }

  pipe (dest, opts) {
    if (this[DESTROYED])
      return

    const ended = this[EMITTED_END]
    opts = opts || {}
    if (dest === proc.stdout || dest === proc.stderr)
      opts.end = false
    else
      opts.end = opts.end !== false
    opts.proxyErrors = !!opts.proxyErrors

    // piping an ended stream ends immediately
    if (ended) {
      if (opts.end)
        dest.end()
    } else {
      this.pipes.push(!opts.proxyErrors ? new Pipe(this, dest, opts)
        : new PipeProxyErrors(this, dest, opts))
      if (this[ASYNC])
        defer(() => this[RESUME]())
      else
        this[RESUME]()
    }

    return dest
  }

  unpipe (dest) {
    const p = this.pipes.find(p => p.dest === dest)
    if (p) {
      this.pipes.splice(this.pipes.indexOf(p), 1)
      p.unpipe()
    }
  }

  addListener (ev, fn) {
    return this.on(ev, fn)
  }

  on (ev, fn) {
    const ret = super.on(ev, fn)
    if (ev === 'data' && !this.pipes.length && !this.flowing)
      this[RESUME]()
    else if (ev === 'readable' && this[BUFFERLENGTH] !== 0)
      super.emit('readable')
    else if (isEndish(ev) && this[EMITTED_END]) {
      super.emit(ev)
      this.removeAllListeners(ev)
    } else if (ev === 'error' && this[EMITTED_ERROR]) {
      if (this[ASYNC])
        defer(() => fn.call(this, this[EMITTED_ERROR]))
      else
        fn.call(this, this[EMITTED_ERROR])
    }
    return ret
  }

  get emittedEnd () {
    return this[EMITTED_END]
  }

  [MAYBE_EMIT_END] () {
    if (!this[EMITTING_END] &&
        !this[EMITTED_END] &&
        !this[DESTROYED] &&
        this.buffer.length === 0 &&
        this[EOF]) {
      this[EMITTING_END] = true
      this.emit('end')
      this.emit('prefinish')
      this.emit('finish')
      if (this[CLOSED])
        this.emit('close')
      this[EMITTING_END] = false
    }
  }

  emit (ev, data, ...extra) {
    // error and close are only events allowed after calling destroy()
    if (ev !== 'error' && ev !== 'close' && ev !== DESTROYED && this[DESTROYED])
      return
    else if (ev === 'data') {
      return !data ? false
        : this[ASYNC] ? defer(() => this[EMITDATA](data))
        : this[EMITDATA](data)
    } else if (ev === 'end') {
      return this[EMITEND]()
    } else if (ev === 'close') {
      this[CLOSED] = true
      // don't emit close before 'end' and 'finish'
      if (!this[EMITTED_END] && !this[DESTROYED])
        return
      const ret = super.emit('close')
      this.removeAllListeners('close')
      return ret
    } else if (ev === 'error') {
      this[EMITTED_ERROR] = data
      const ret = super.emit('error', data)
      this[MAYBE_EMIT_END]()
      return ret
    } else if (ev === 'resume') {
      const ret = super.emit('resume')
      this[MAYBE_EMIT_END]()
      return ret
    } else if (ev === 'finish' || ev === 'prefinish') {
      const ret = super.emit(ev)
      this.removeAllListeners(ev)
      return ret
    }

    // Some other unknown event
    const ret = super.emit(ev, data, ...extra)
    this[MAYBE_EMIT_END]()
    return ret
  }

  [EMITDATA] (data) {
    for (const p of this.pipes) {
      if (p.dest.write(data) === false)
        this.pause()
    }
    const ret = super.emit('data', data)
    this[MAYBE_EMIT_END]()
    return ret
  }

  [EMITEND] () {
    if (this[EMITTED_END])
      return

    this[EMITTED_END] = true
    this.readable = false
    if (this[ASYNC])
      defer(() => this[EMITEND2]())
    else
      this[EMITEND2]()
  }

  [EMITEND2] () {
    if (this[DECODER]) {
      const data = this[DECODER].end()
      if (data) {
        for (const p of this.pipes) {
          p.dest.write(data)
        }
        super.emit('data', data)
      }
    }

    for (const p of this.pipes) {
      p.end()
    }
    const ret = super.emit('end')
    this.removeAllListeners('end')
    return ret
  }

  // const all = await stream.collect()
  collect () {
    const buf = []
    if (!this[OBJECTMODE])
      buf.dataLength = 0
    // set the promise first, in case an error is raised
    // by triggering the flow here.
    const p = this.promise()
    this.on('data', c => {
      buf.push(c)
      if (!this[OBJECTMODE])
        buf.dataLength += c.length
    })
    return p.then(() => buf)
  }

  // const data = await stream.concat()
  concat () {
    return this[OBJECTMODE]
      ? Promise.reject(new Error('cannot concat in objectMode'))
      : this.collect().then(buf =>
          this[OBJECTMODE]
            ? Promise.reject(new Error('cannot concat in objectMode'))
            : this[ENCODING] ? buf.join('') : Buffer.concat(buf, buf.dataLength))
  }

  // stream.promise().then(() => done, er => emitted error)
  promise () {
    return new Promise((resolve, reject) => {
      this.on(DESTROYED, () => reject(new Error('stream destroyed')))
      this.on('error', er => reject(er))
      this.on('end', () => resolve())
    })
  }

  // for await (let chunk of stream)
  [ASYNCITERATOR] () {
    const next = () => {
      const res = this.read()
      if (res !== null)
        return Promise.resolve({ done: false, value: res })

      if (this[EOF])
        return Promise.resolve({ done: true })

      let resolve = null
      let reject = null
      const onerr = er => {
        this.removeListener('data', ondata)
        this.removeListener('end', onend)
        reject(er)
      }
      const ondata = value => {
        this.removeListener('error', onerr)
        this.removeListener('end', onend)
        this.pause()
        resolve({ value: value, done: !!this[EOF] })
      }
      const onend = () => {
        this.removeListener('error', onerr)
        this.removeListener('data', ondata)
        resolve({ done: true })
      }
      const ondestroy = () => onerr(new Error('stream destroyed'))
      return new Promise((res, rej) => {
        reject = rej
        resolve = res
        this.once(DESTROYED, ondestroy)
        this.once('error', onerr)
        this.once('end', onend)
        this.once('data', ondata)
      })
    }

    return { next }
  }

  // for (let chunk of stream)
  [ITERATOR] () {
    const next = () => {
      const value = this.read()
      const done = value === null
      return { value, done }
    }
    return { next }
  }

  destroy (er) {
    if (this[DESTROYED]) {
      if (er)
        this.emit('error', er)
      else
        this.emit(DESTROYED)
      return this
    }

    this[DESTROYED] = true

    // throw away all buffered data, it's never coming out
    this.buffer.length = 0
    this[BUFFERLENGTH] = 0

    if (typeof this.close === 'function' && !this[CLOSED])
      this.close()

    if (er)
      this.emit('error', er)
    else // if no error to emit, still reject pending promises
      this.emit(DESTROYED)

    return this
  }

  static isStream (s) {
    return !!s && (s instanceof Minipass || s instanceof Stream ||
      s instanceof EE && (
        typeof s.pipe === 'function' || // readable
        (typeof s.write === 'function' && typeof s.end === 'function') // writable
      ))
  }
}


/***/ }),
/* 130 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const MiniPass = __webpack_require__(122)
const normPath = __webpack_require__(131)

const SLURP = Symbol('slurp')
module.exports = class ReadEntry extends MiniPass {
  constructor (header, ex, gex) {
    super()
    // read entries always start life paused.  this is to avoid the
    // situation where Minipass's auto-ending empty streams results
    // in an entry ending before we're ready for it.
    this.pause()
    this.extended = ex
    this.globalExtended = gex
    this.header = header
    this.startBlockSize = 512 * Math.ceil(header.size / 512)
    this.blockRemain = this.startBlockSize
    this.remain = header.size
    this.type = header.type
    this.meta = false
    this.ignore = false
    switch (this.type) {
      case 'File':
      case 'OldFile':
      case 'Link':
      case 'SymbolicLink':
      case 'CharacterDevice':
      case 'BlockDevice':
      case 'Directory':
      case 'FIFO':
      case 'ContiguousFile':
      case 'GNUDumpDir':
        break

      case 'NextFileHasLongLinkpath':
      case 'NextFileHasLongPath':
      case 'OldGnuLongPath':
      case 'GlobalExtendedHeader':
      case 'ExtendedHeader':
      case 'OldExtendedHeader':
        this.meta = true
        break

      // NOTE: gnutar and bsdtar treat unrecognized types as 'File'
      // it may be worth doing the same, but with a warning.
      default:
        this.ignore = true
    }

    this.path = normPath(header.path)
    this.mode = header.mode
    if (this.mode) {
      this.mode = this.mode & 0o7777
    }
    this.uid = header.uid
    this.gid = header.gid
    this.uname = header.uname
    this.gname = header.gname
    this.size = header.size
    this.mtime = header.mtime
    this.atime = header.atime
    this.ctime = header.ctime
    this.linkpath = normPath(header.linkpath)
    this.uname = header.uname
    this.gname = header.gname

    if (ex) {
      this[SLURP](ex)
    }
    if (gex) {
      this[SLURP](gex, true)
    }
  }

  write (data) {
    const writeLen = data.length
    if (writeLen > this.blockRemain) {
      throw new Error('writing more to entry than is appropriate')
    }

    const r = this.remain
    const br = this.blockRemain
    this.remain = Math.max(0, r - writeLen)
    this.blockRemain = Math.max(0, br - writeLen)
    if (this.ignore) {
      return true
    }

    if (r >= writeLen) {
      return super.write(data)
    }

    // r < writeLen
    return super.write(data.slice(0, r))
  }

  [SLURP] (ex, global) {
    for (const k in ex) {
      // we slurp in everything except for the path attribute in
      // a global extended header, because that's weird.
      if (ex[k] !== null && ex[k] !== undefined &&
          !(global && k === 'path')) {
        this[k] = k === 'path' || k === 'linkpath' ? normPath(ex[k]) : ex[k]
      }
    }
  }
}


/***/ }),
/* 131 */
/***/ ((module) => {

// on windows, either \ or / are valid directory separators.
// on unix, \ is a valid character in filenames.
// so, on windows, and only on windows, we replace all \ chars with /,
// so that we can use / as our one and only directory separator char.

const platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform
module.exports = platform !== 'win32' ? p => p
  : p => p && p.replace(/\\/g, '/')


/***/ }),
/* 132 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const MiniPass = __webpack_require__(122)
const Pax = __webpack_require__(133)
const Header = __webpack_require__(134)
const fs = __webpack_require__(57)
const path = __webpack_require__(58)
const normPath = __webpack_require__(131)
const stripSlash = __webpack_require__(137)

const prefixPath = (path, prefix) => {
  if (!prefix) {
    return normPath(path)
  }
  path = normPath(path).replace(/^\.(\/|$)/, '')
  return stripSlash(prefix) + '/' + path
}

const maxReadSize = 16 * 1024 * 1024
const PROCESS = Symbol('process')
const FILE = Symbol('file')
const DIRECTORY = Symbol('directory')
const SYMLINK = Symbol('symlink')
const HARDLINK = Symbol('hardlink')
const HEADER = Symbol('header')
const READ = Symbol('read')
const LSTAT = Symbol('lstat')
const ONLSTAT = Symbol('onlstat')
const ONREAD = Symbol('onread')
const ONREADLINK = Symbol('onreadlink')
const OPENFILE = Symbol('openfile')
const ONOPENFILE = Symbol('onopenfile')
const CLOSE = Symbol('close')
const MODE = Symbol('mode')
const AWAITDRAIN = Symbol('awaitDrain')
const ONDRAIN = Symbol('ondrain')
const PREFIX = Symbol('prefix')
const HAD_ERROR = Symbol('hadError')
const warner = __webpack_require__(138)
const winchars = __webpack_require__(139)
const stripAbsolutePath = __webpack_require__(140)

const modeFix = __webpack_require__(141)

const WriteEntry = warner(class WriteEntry extends MiniPass {
  constructor (p, opt) {
    opt = opt || {}
    super(opt)
    if (typeof p !== 'string') {
      throw new TypeError('path is required')
    }
    this.path = normPath(p)
    // suppress atime, ctime, uid, gid, uname, gname
    this.portable = !!opt.portable
    // until node has builtin pwnam functions, this'll have to do
    this.myuid = process.getuid && process.getuid() || 0
    this.myuser = process.env.USER || ''
    this.maxReadSize = opt.maxReadSize || maxReadSize
    this.linkCache = opt.linkCache || new Map()
    this.statCache = opt.statCache || new Map()
    this.preservePaths = !!opt.preservePaths
    this.cwd = normPath(opt.cwd || process.cwd())
    this.strict = !!opt.strict
    this.noPax = !!opt.noPax
    this.noMtime = !!opt.noMtime
    this.mtime = opt.mtime || null
    this.prefix = opt.prefix ? normPath(opt.prefix) : null

    this.fd = null
    this.blockLen = null
    this.blockRemain = null
    this.buf = null
    this.offset = null
    this.length = null
    this.pos = null
    this.remain = null

    if (typeof opt.onwarn === 'function') {
      this.on('warn', opt.onwarn)
    }

    let pathWarn = false
    if (!this.preservePaths) {
      const [root, stripped] = stripAbsolutePath(this.path)
      if (root) {
        this.path = stripped
        pathWarn = root
      }
    }

    this.win32 = !!opt.win32 || process.platform === 'win32'
    if (this.win32) {
      // force the \ to / normalization, since we might not *actually*
      // be on windows, but want \ to be considered a path separator.
      this.path = winchars.decode(this.path.replace(/\\/g, '/'))
      p = p.replace(/\\/g, '/')
    }

    this.absolute = normPath(opt.absolute || path.resolve(this.cwd, p))

    if (this.path === '') {
      this.path = './'
    }

    if (pathWarn) {
      this.warn('TAR_ENTRY_INFO', `stripping ${pathWarn} from absolute path`, {
        entry: this,
        path: pathWarn + this.path,
      })
    }

    if (this.statCache.has(this.absolute)) {
      this[ONLSTAT](this.statCache.get(this.absolute))
    } else {
      this[LSTAT]()
    }
  }

  emit (ev, ...data) {
    if (ev === 'error') {
      this[HAD_ERROR] = true
    }
    return super.emit(ev, ...data)
  }

  [LSTAT] () {
    fs.lstat(this.absolute, (er, stat) => {
      if (er) {
        return this.emit('error', er)
      }
      this[ONLSTAT](stat)
    })
  }

  [ONLSTAT] (stat) {
    this.statCache.set(this.absolute, stat)
    this.stat = stat
    if (!stat.isFile()) {
      stat.size = 0
    }
    this.type = getType(stat)
    this.emit('stat', stat)
    this[PROCESS]()
  }

  [PROCESS] () {
    switch (this.type) {
      case 'File': return this[FILE]()
      case 'Directory': return this[DIRECTORY]()
      case 'SymbolicLink': return this[SYMLINK]()
      // unsupported types are ignored.
      default: return this.end()
    }
  }

  [MODE] (mode) {
    return modeFix(mode, this.type === 'Directory', this.portable)
  }

  [PREFIX] (path) {
    return prefixPath(path, this.prefix)
  }

  [HEADER] () {
    if (this.type === 'Directory' && this.portable) {
      this.noMtime = true
    }

    this.header = new Header({
      path: this[PREFIX](this.path),
      // only apply the prefix to hard links.
      linkpath: this.type === 'Link' ? this[PREFIX](this.linkpath)
      : this.linkpath,
      // only the permissions and setuid/setgid/sticky bitflags
      // not the higher-order bits that specify file type
      mode: this[MODE](this.stat.mode),
      uid: this.portable ? null : this.stat.uid,
      gid: this.portable ? null : this.stat.gid,
      size: this.stat.size,
      mtime: this.noMtime ? null : this.mtime || this.stat.mtime,
      type: this.type,
      uname: this.portable ? null :
      this.stat.uid === this.myuid ? this.myuser : '',
      atime: this.portable ? null : this.stat.atime,
      ctime: this.portable ? null : this.stat.ctime,
    })

    if (this.header.encode() && !this.noPax) {
      super.write(new Pax({
        atime: this.portable ? null : this.header.atime,
        ctime: this.portable ? null : this.header.ctime,
        gid: this.portable ? null : this.header.gid,
        mtime: this.noMtime ? null : this.mtime || this.header.mtime,
        path: this[PREFIX](this.path),
        linkpath: this.type === 'Link' ? this[PREFIX](this.linkpath)
        : this.linkpath,
        size: this.header.size,
        uid: this.portable ? null : this.header.uid,
        uname: this.portable ? null : this.header.uname,
        dev: this.portable ? null : this.stat.dev,
        ino: this.portable ? null : this.stat.ino,
        nlink: this.portable ? null : this.stat.nlink,
      }).encode())
    }
    super.write(this.header.block)
  }

  [DIRECTORY] () {
    if (this.path.slice(-1) !== '/') {
      this.path += '/'
    }
    this.stat.size = 0
    this[HEADER]()
    this.end()
  }

  [SYMLINK] () {
    fs.readlink(this.absolute, (er, linkpath) => {
      if (er) {
        return this.emit('error', er)
      }
      this[ONREADLINK](linkpath)
    })
  }

  [ONREADLINK] (linkpath) {
    this.linkpath = normPath(linkpath)
    this[HEADER]()
    this.end()
  }

  [HARDLINK] (linkpath) {
    this.type = 'Link'
    this.linkpath = normPath(path.relative(this.cwd, linkpath))
    this.stat.size = 0
    this[HEADER]()
    this.end()
  }

  [FILE] () {
    if (this.stat.nlink > 1) {
      const linkKey = this.stat.dev + ':' + this.stat.ino
      if (this.linkCache.has(linkKey)) {
        const linkpath = this.linkCache.get(linkKey)
        if (linkpath.indexOf(this.cwd) === 0) {
          return this[HARDLINK](linkpath)
        }
      }
      this.linkCache.set(linkKey, this.absolute)
    }

    this[HEADER]()
    if (this.stat.size === 0) {
      return this.end()
    }

    this[OPENFILE]()
  }

  [OPENFILE] () {
    fs.open(this.absolute, 'r', (er, fd) => {
      if (er) {
        return this.emit('error', er)
      }
      this[ONOPENFILE](fd)
    })
  }

  [ONOPENFILE] (fd) {
    this.fd = fd
    if (this[HAD_ERROR]) {
      return this[CLOSE]()
    }

    this.blockLen = 512 * Math.ceil(this.stat.size / 512)
    this.blockRemain = this.blockLen
    const bufLen = Math.min(this.blockLen, this.maxReadSize)
    this.buf = Buffer.allocUnsafe(bufLen)
    this.offset = 0
    this.pos = 0
    this.remain = this.stat.size
    this.length = this.buf.length
    this[READ]()
  }

  [READ] () {
    const { fd, buf, offset, length, pos } = this
    fs.read(fd, buf, offset, length, pos, (er, bytesRead) => {
      if (er) {
        // ignoring the error from close(2) is a bad practice, but at
        // this point we already have an error, don't need another one
        return this[CLOSE](() => this.emit('error', er))
      }
      this[ONREAD](bytesRead)
    })
  }

  [CLOSE] (cb) {
    fs.close(this.fd, cb)
  }

  [ONREAD] (bytesRead) {
    if (bytesRead <= 0 && this.remain > 0) {
      const er = new Error('encountered unexpected EOF')
      er.path = this.absolute
      er.syscall = 'read'
      er.code = 'EOF'
      return this[CLOSE](() => this.emit('error', er))
    }

    if (bytesRead > this.remain) {
      const er = new Error('did not encounter expected EOF')
      er.path = this.absolute
      er.syscall = 'read'
      er.code = 'EOF'
      return this[CLOSE](() => this.emit('error', er))
    }

    // null out the rest of the buffer, if we could fit the block padding
    // at the end of this loop, we've incremented bytesRead and this.remain
    // to be incremented up to the blockRemain level, as if we had expected
    // to get a null-padded file, and read it until the end.  then we will
    // decrement both remain and blockRemain by bytesRead, and know that we
    // reached the expected EOF, without any null buffer to append.
    if (bytesRead === this.remain) {
      for (let i = bytesRead; i < this.length && bytesRead < this.blockRemain; i++) {
        this.buf[i + this.offset] = 0
        bytesRead++
        this.remain++
      }
    }

    const writeBuf = this.offset === 0 && bytesRead === this.buf.length ?
      this.buf : this.buf.slice(this.offset, this.offset + bytesRead)

    const flushed = this.write(writeBuf)
    if (!flushed) {
      this[AWAITDRAIN](() => this[ONDRAIN]())
    } else {
      this[ONDRAIN]()
    }
  }

  [AWAITDRAIN] (cb) {
    this.once('drain', cb)
  }

  write (writeBuf) {
    if (this.blockRemain < writeBuf.length) {
      const er = new Error('writing more data than expected')
      er.path = this.absolute
      return this.emit('error', er)
    }
    this.remain -= writeBuf.length
    this.blockRemain -= writeBuf.length
    this.pos += writeBuf.length
    this.offset += writeBuf.length
    return super.write(writeBuf)
  }

  [ONDRAIN] () {
    if (!this.remain) {
      if (this.blockRemain) {
        super.write(Buffer.alloc(this.blockRemain))
      }
      return this[CLOSE](er => er ? this.emit('error', er) : this.end())
    }

    if (this.offset >= this.length) {
      // if we only have a smaller bit left to read, alloc a smaller buffer
      // otherwise, keep it the same length it was before.
      this.buf = Buffer.allocUnsafe(Math.min(this.blockRemain, this.buf.length))
      this.offset = 0
    }
    this.length = this.buf.length - this.offset
    this[READ]()
  }
})

class WriteEntrySync extends WriteEntry {
  [LSTAT] () {
    this[ONLSTAT](fs.lstatSync(this.absolute))
  }

  [SYMLINK] () {
    this[ONREADLINK](fs.readlinkSync(this.absolute))
  }

  [OPENFILE] () {
    this[ONOPENFILE](fs.openSync(this.absolute, 'r'))
  }

  [READ] () {
    let threw = true
    try {
      const { fd, buf, offset, length, pos } = this
      const bytesRead = fs.readSync(fd, buf, offset, length, pos)
      this[ONREAD](bytesRead)
      threw = false
    } finally {
      // ignoring the error from close(2) is a bad practice, but at
      // this point we already have an error, don't need another one
      if (threw) {
        try {
          this[CLOSE](() => {})
        } catch (er) {}
      }
    }
  }

  [AWAITDRAIN] (cb) {
    cb()
  }

  [CLOSE] (cb) {
    fs.closeSync(this.fd)
    cb()
  }
}

const WriteEntryTar = warner(class WriteEntryTar extends MiniPass {
  constructor (readEntry, opt) {
    opt = opt || {}
    super(opt)
    this.preservePaths = !!opt.preservePaths
    this.portable = !!opt.portable
    this.strict = !!opt.strict
    this.noPax = !!opt.noPax
    this.noMtime = !!opt.noMtime

    this.readEntry = readEntry
    this.type = readEntry.type
    if (this.type === 'Directory' && this.portable) {
      this.noMtime = true
    }

    this.prefix = opt.prefix || null

    this.path = normPath(readEntry.path)
    this.mode = this[MODE](readEntry.mode)
    this.uid = this.portable ? null : readEntry.uid
    this.gid = this.portable ? null : readEntry.gid
    this.uname = this.portable ? null : readEntry.uname
    this.gname = this.portable ? null : readEntry.gname
    this.size = readEntry.size
    this.mtime = this.noMtime ? null : opt.mtime || readEntry.mtime
    this.atime = this.portable ? null : readEntry.atime
    this.ctime = this.portable ? null : readEntry.ctime
    this.linkpath = normPath(readEntry.linkpath)

    if (typeof opt.onwarn === 'function') {
      this.on('warn', opt.onwarn)
    }

    let pathWarn = false
    if (!this.preservePaths) {
      const [root, stripped] = stripAbsolutePath(this.path)
      if (root) {
        this.path = stripped
        pathWarn = root
      }
    }

    this.remain = readEntry.size
    this.blockRemain = readEntry.startBlockSize

    this.header = new Header({
      path: this[PREFIX](this.path),
      linkpath: this.type === 'Link' ? this[PREFIX](this.linkpath)
      : this.linkpath,
      // only the permissions and setuid/setgid/sticky bitflags
      // not the higher-order bits that specify file type
      mode: this.mode,
      uid: this.portable ? null : this.uid,
      gid: this.portable ? null : this.gid,
      size: this.size,
      mtime: this.noMtime ? null : this.mtime,
      type: this.type,
      uname: this.portable ? null : this.uname,
      atime: this.portable ? null : this.atime,
      ctime: this.portable ? null : this.ctime,
    })

    if (pathWarn) {
      this.warn('TAR_ENTRY_INFO', `stripping ${pathWarn} from absolute path`, {
        entry: this,
        path: pathWarn + this.path,
      })
    }

    if (this.header.encode() && !this.noPax) {
      super.write(new Pax({
        atime: this.portable ? null : this.atime,
        ctime: this.portable ? null : this.ctime,
        gid: this.portable ? null : this.gid,
        mtime: this.noMtime ? null : this.mtime,
        path: this[PREFIX](this.path),
        linkpath: this.type === 'Link' ? this[PREFIX](this.linkpath)
        : this.linkpath,
        size: this.size,
        uid: this.portable ? null : this.uid,
        uname: this.portable ? null : this.uname,
        dev: this.portable ? null : this.readEntry.dev,
        ino: this.portable ? null : this.readEntry.ino,
        nlink: this.portable ? null : this.readEntry.nlink,
      }).encode())
    }

    super.write(this.header.block)
    readEntry.pipe(this)
  }

  [PREFIX] (path) {
    return prefixPath(path, this.prefix)
  }

  [MODE] (mode) {
    return modeFix(mode, this.type === 'Directory', this.portable)
  }

  write (data) {
    const writeLen = data.length
    if (writeLen > this.blockRemain) {
      throw new Error('writing more to entry than is appropriate')
    }
    this.blockRemain -= writeLen
    return super.write(data)
  }

  end () {
    if (this.blockRemain) {
      super.write(Buffer.alloc(this.blockRemain))
    }
    return super.end()
  }
})

WriteEntry.Sync = WriteEntrySync
WriteEntry.Tar = WriteEntryTar

const getType = stat =>
  stat.isFile() ? 'File'
  : stat.isDirectory() ? 'Directory'
  : stat.isSymbolicLink() ? 'SymbolicLink'
  : 'Unsupported'

module.exports = WriteEntry


/***/ }),
/* 133 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Header = __webpack_require__(134)
const path = __webpack_require__(58)

class Pax {
  constructor (obj, global) {
    this.atime = obj.atime || null
    this.charset = obj.charset || null
    this.comment = obj.comment || null
    this.ctime = obj.ctime || null
    this.gid = obj.gid || null
    this.gname = obj.gname || null
    this.linkpath = obj.linkpath || null
    this.mtime = obj.mtime || null
    this.path = obj.path || null
    this.size = obj.size || null
    this.uid = obj.uid || null
    this.uname = obj.uname || null
    this.dev = obj.dev || null
    this.ino = obj.ino || null
    this.nlink = obj.nlink || null
    this.global = global || false
  }

  encode () {
    const body = this.encodeBody()
    if (body === '') {
      return null
    }

    const bodyLen = Buffer.byteLength(body)
    // round up to 512 bytes
    // add 512 for header
    const bufLen = 512 * Math.ceil(1 + bodyLen / 512)
    const buf = Buffer.allocUnsafe(bufLen)

    // 0-fill the header section, it might not hit every field
    for (let i = 0; i < 512; i++) {
      buf[i] = 0
    }

    new Header({
      // XXX split the path
      // then the path should be PaxHeader + basename, but less than 99,
      // prepend with the dirname
      path: ('PaxHeader/' + path.basename(this.path)).slice(0, 99),
      mode: this.mode || 0o644,
      uid: this.uid || null,
      gid: this.gid || null,
      size: bodyLen,
      mtime: this.mtime || null,
      type: this.global ? 'GlobalExtendedHeader' : 'ExtendedHeader',
      linkpath: '',
      uname: this.uname || '',
      gname: this.gname || '',
      devmaj: 0,
      devmin: 0,
      atime: this.atime || null,
      ctime: this.ctime || null,
    }).encode(buf)

    buf.write(body, 512, bodyLen, 'utf8')

    // null pad after the body
    for (let i = bodyLen + 512; i < buf.length; i++) {
      buf[i] = 0
    }

    return buf
  }

  encodeBody () {
    return (
      this.encodeField('path') +
      this.encodeField('ctime') +
      this.encodeField('atime') +
      this.encodeField('dev') +
      this.encodeField('ino') +
      this.encodeField('nlink') +
      this.encodeField('charset') +
      this.encodeField('comment') +
      this.encodeField('gid') +
      this.encodeField('gname') +
      this.encodeField('linkpath') +
      this.encodeField('mtime') +
      this.encodeField('size') +
      this.encodeField('uid') +
      this.encodeField('uname')
    )
  }

  encodeField (field) {
    if (this[field] === null || this[field] === undefined) {
      return ''
    }
    const v = this[field] instanceof Date ? this[field].getTime() / 1000
      : this[field]
    const s = ' ' +
      (field === 'dev' || field === 'ino' || field === 'nlink'
        ? 'SCHILY.' : '') +
      field + '=' + v + '\n'
    const byteLen = Buffer.byteLength(s)
    // the digits includes the length of the digits in ascii base-10
    // so if it's 9 characters, then adding 1 for the 9 makes it 10
    // which makes it 11 chars.
    let digits = Math.floor(Math.log(byteLen) / Math.log(10)) + 1
    if (byteLen + digits >= Math.pow(10, digits)) {
      digits += 1
    }
    const len = digits + byteLen
    return len + s
  }
}

Pax.parse = (string, ex, g) => new Pax(merge(parseKV(string), ex), g)

const merge = (a, b) =>
  b ? Object.keys(a).reduce((s, k) => (s[k] = a[k], s), b) : a

const parseKV = string =>
  string
    .replace(/\n$/, '')
    .split('\n')
    .reduce(parseKVLine, Object.create(null))

const parseKVLine = (set, line) => {
  const n = parseInt(line, 10)

  // XXX Values with \n in them will fail this.
  // Refactor to not be a naive line-by-line parse.
  if (n !== Buffer.byteLength(line) + 1) {
    return set
  }

  line = line.slice((n + ' ').length)
  const kv = line.split('=')
  const k = kv.shift().replace(/^SCHILY\.(dev|ino|nlink)/, '$1')
  if (!k) {
    return set
  }

  const v = kv.join('=')
  set[k] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(k)
    ? new Date(v * 1000)
    : /^[0-9]+$/.test(v) ? +v
    : v
  return set
}

module.exports = Pax


/***/ }),
/* 134 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// parse a 512-byte header block to a data object, or vice-versa
// encode returns `true` if a pax extended header is needed, because
// the data could not be faithfully encoded in a simple header.
// (Also, check header.needPax to see if it needs a pax header.)

const types = __webpack_require__(135)
const pathModule = (__webpack_require__(58).posix)
const large = __webpack_require__(136)

const SLURP = Symbol('slurp')
const TYPE = Symbol('type')

class Header {
  constructor (data, off, ex, gex) {
    this.cksumValid = false
    this.needPax = false
    this.nullBlock = false

    this.block = null
    this.path = null
    this.mode = null
    this.uid = null
    this.gid = null
    this.size = null
    this.mtime = null
    this.cksum = null
    this[TYPE] = '0'
    this.linkpath = null
    this.uname = null
    this.gname = null
    this.devmaj = 0
    this.devmin = 0
    this.atime = null
    this.ctime = null

    if (Buffer.isBuffer(data)) {
      this.decode(data, off || 0, ex, gex)
    } else if (data) {
      this.set(data)
    }
  }

  decode (buf, off, ex, gex) {
    if (!off) {
      off = 0
    }

    if (!buf || !(buf.length >= off + 512)) {
      throw new Error('need 512 bytes for header')
    }

    this.path = decString(buf, off, 100)
    this.mode = decNumber(buf, off + 100, 8)
    this.uid = decNumber(buf, off + 108, 8)
    this.gid = decNumber(buf, off + 116, 8)
    this.size = decNumber(buf, off + 124, 12)
    this.mtime = decDate(buf, off + 136, 12)
    this.cksum = decNumber(buf, off + 148, 12)

    // if we have extended or global extended headers, apply them now
    // See https://github.com/npm/node-tar/pull/187
    this[SLURP](ex)
    this[SLURP](gex, true)

    // old tar versions marked dirs as a file with a trailing /
    this[TYPE] = decString(buf, off + 156, 1)
    if (this[TYPE] === '') {
      this[TYPE] = '0'
    }
    if (this[TYPE] === '0' && this.path.slice(-1) === '/') {
      this[TYPE] = '5'
    }

    // tar implementations sometimes incorrectly put the stat(dir).size
    // as the size in the tarball, even though Directory entries are
    // not able to have any body at all.  In the very rare chance that
    // it actually DOES have a body, we weren't going to do anything with
    // it anyway, and it'll just be a warning about an invalid header.
    if (this[TYPE] === '5') {
      this.size = 0
    }

    this.linkpath = decString(buf, off + 157, 100)
    if (buf.slice(off + 257, off + 265).toString() === 'ustar\u000000') {
      this.uname = decString(buf, off + 265, 32)
      this.gname = decString(buf, off + 297, 32)
      this.devmaj = decNumber(buf, off + 329, 8)
      this.devmin = decNumber(buf, off + 337, 8)
      if (buf[off + 475] !== 0) {
        // definitely a prefix, definitely >130 chars.
        const prefix = decString(buf, off + 345, 155)
        this.path = prefix + '/' + this.path
      } else {
        const prefix = decString(buf, off + 345, 130)
        if (prefix) {
          this.path = prefix + '/' + this.path
        }
        this.atime = decDate(buf, off + 476, 12)
        this.ctime = decDate(buf, off + 488, 12)
      }
    }

    let sum = 8 * 0x20
    for (let i = off; i < off + 148; i++) {
      sum += buf[i]
    }

    for (let i = off + 156; i < off + 512; i++) {
      sum += buf[i]
    }

    this.cksumValid = sum === this.cksum
    if (this.cksum === null && sum === 8 * 0x20) {
      this.nullBlock = true
    }
  }

  [SLURP] (ex, global) {
    for (const k in ex) {
      // we slurp in everything except for the path attribute in
      // a global extended header, because that's weird.
      if (ex[k] !== null && ex[k] !== undefined &&
          !(global && k === 'path')) {
        this[k] = ex[k]
      }
    }
  }

  encode (buf, off) {
    if (!buf) {
      buf = this.block = Buffer.alloc(512)
      off = 0
    }

    if (!off) {
      off = 0
    }

    if (!(buf.length >= off + 512)) {
      throw new Error('need 512 bytes for header')
    }

    const prefixSize = this.ctime || this.atime ? 130 : 155
    const split = splitPrefix(this.path || '', prefixSize)
    const path = split[0]
    const prefix = split[1]
    this.needPax = split[2]

    this.needPax = encString(buf, off, 100, path) || this.needPax
    this.needPax = encNumber(buf, off + 100, 8, this.mode) || this.needPax
    this.needPax = encNumber(buf, off + 108, 8, this.uid) || this.needPax
    this.needPax = encNumber(buf, off + 116, 8, this.gid) || this.needPax
    this.needPax = encNumber(buf, off + 124, 12, this.size) || this.needPax
    this.needPax = encDate(buf, off + 136, 12, this.mtime) || this.needPax
    buf[off + 156] = this[TYPE].charCodeAt(0)
    this.needPax = encString(buf, off + 157, 100, this.linkpath) || this.needPax
    buf.write('ustar\u000000', off + 257, 8)
    this.needPax = encString(buf, off + 265, 32, this.uname) || this.needPax
    this.needPax = encString(buf, off + 297, 32, this.gname) || this.needPax
    this.needPax = encNumber(buf, off + 329, 8, this.devmaj) || this.needPax
    this.needPax = encNumber(buf, off + 337, 8, this.devmin) || this.needPax
    this.needPax = encString(buf, off + 345, prefixSize, prefix) || this.needPax
    if (buf[off + 475] !== 0) {
      this.needPax = encString(buf, off + 345, 155, prefix) || this.needPax
    } else {
      this.needPax = encString(buf, off + 345, 130, prefix) || this.needPax
      this.needPax = encDate(buf, off + 476, 12, this.atime) || this.needPax
      this.needPax = encDate(buf, off + 488, 12, this.ctime) || this.needPax
    }

    let sum = 8 * 0x20
    for (let i = off; i < off + 148; i++) {
      sum += buf[i]
    }

    for (let i = off + 156; i < off + 512; i++) {
      sum += buf[i]
    }

    this.cksum = sum
    encNumber(buf, off + 148, 8, this.cksum)
    this.cksumValid = true

    return this.needPax
  }

  set (data) {
    for (const i in data) {
      if (data[i] !== null && data[i] !== undefined) {
        this[i] = data[i]
      }
    }
  }

  get type () {
    return types.name.get(this[TYPE]) || this[TYPE]
  }

  get typeKey () {
    return this[TYPE]
  }

  set type (type) {
    if (types.code.has(type)) {
      this[TYPE] = types.code.get(type)
    } else {
      this[TYPE] = type
    }
  }
}

const splitPrefix = (p, prefixSize) => {
  const pathSize = 100
  let pp = p
  let prefix = ''
  let ret
  const root = pathModule.parse(p).root || '.'

  if (Buffer.byteLength(pp) < pathSize) {
    ret = [pp, prefix, false]
  } else {
    // first set prefix to the dir, and path to the base
    prefix = pathModule.dirname(pp)
    pp = pathModule.basename(pp)

    do {
      if (Buffer.byteLength(pp) <= pathSize &&
          Buffer.byteLength(prefix) <= prefixSize) {
        // both fit!
        ret = [pp, prefix, false]
      } else if (Buffer.byteLength(pp) > pathSize &&
          Buffer.byteLength(prefix) <= prefixSize) {
        // prefix fits in prefix, but path doesn't fit in path
        ret = [pp.slice(0, pathSize - 1), prefix, true]
      } else {
        // make path take a bit from prefix
        pp = pathModule.join(pathModule.basename(prefix), pp)
        prefix = pathModule.dirname(prefix)
      }
    } while (prefix !== root && !ret)

    // at this point, found no resolution, just truncate
    if (!ret) {
      ret = [p.slice(0, pathSize - 1), '', true]
    }
  }
  return ret
}

const decString = (buf, off, size) =>
  buf.slice(off, off + size).toString('utf8').replace(/\0.*/, '')

const decDate = (buf, off, size) =>
  numToDate(decNumber(buf, off, size))

const numToDate = num => num === null ? null : new Date(num * 1000)

const decNumber = (buf, off, size) =>
  buf[off] & 0x80 ? large.parse(buf.slice(off, off + size))
  : decSmallNumber(buf, off, size)

const nanNull = value => isNaN(value) ? null : value

const decSmallNumber = (buf, off, size) =>
  nanNull(parseInt(
    buf.slice(off, off + size)
      .toString('utf8').replace(/\0.*$/, '').trim(), 8))

// the maximum encodable as a null-terminated octal, by field size
const MAXNUM = {
  12: 0o77777777777,
  8: 0o7777777,
}

const encNumber = (buf, off, size, number) =>
  number === null ? false :
  number > MAXNUM[size] || number < 0
    ? (large.encode(number, buf.slice(off, off + size)), true)
    : (encSmallNumber(buf, off, size, number), false)

const encSmallNumber = (buf, off, size, number) =>
  buf.write(octalString(number, size), off, size, 'ascii')

const octalString = (number, size) =>
  padOctal(Math.floor(number).toString(8), size)

const padOctal = (string, size) =>
  (string.length === size - 1 ? string
  : new Array(size - string.length - 1).join('0') + string + ' ') + '\0'

const encDate = (buf, off, size, date) =>
  date === null ? false :
  encNumber(buf, off, size, date.getTime() / 1000)

// enough to fill the longest string we've got
const NULLS = new Array(156).join('\0')
// pad with nulls, return true if it's longer or non-ascii
const encString = (buf, off, size, string) =>
  string === null ? false :
  (buf.write(string + NULLS, off, size, 'utf8'),
  string.length !== Buffer.byteLength(string) || string.length > size)

module.exports = Header


/***/ }),
/* 135 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// map types from key to human-friendly name
exports.name = new Map([
  ['0', 'File'],
  // same as File
  ['', 'OldFile'],
  ['1', 'Link'],
  ['2', 'SymbolicLink'],
  // Devices and FIFOs aren't fully supported
  // they are parsed, but skipped when unpacking
  ['3', 'CharacterDevice'],
  ['4', 'BlockDevice'],
  ['5', 'Directory'],
  ['6', 'FIFO'],
  // same as File
  ['7', 'ContiguousFile'],
  // pax headers
  ['g', 'GlobalExtendedHeader'],
  ['x', 'ExtendedHeader'],
  // vendor-specific stuff
  // skip
  ['A', 'SolarisACL'],
  // like 5, but with data, which should be skipped
  ['D', 'GNUDumpDir'],
  // metadata only, skip
  ['I', 'Inode'],
  // data = link path of next file
  ['K', 'NextFileHasLongLinkpath'],
  // data = path of next file
  ['L', 'NextFileHasLongPath'],
  // skip
  ['M', 'ContinuationFile'],
  // like L
  ['N', 'OldGnuLongPath'],
  // skip
  ['S', 'SparseFile'],
  // skip
  ['V', 'TapeVolumeHeader'],
  // like x
  ['X', 'OldExtendedHeader'],
])

// map the other direction
exports.code = new Map(Array.from(exports.name).map(kv => [kv[1], kv[0]]))


/***/ }),
/* 136 */
/***/ ((module) => {

"use strict";

// Tar can encode large and negative numbers using a leading byte of
// 0xff for negative, and 0x80 for positive.

const encode = (num, buf) => {
  if (!Number.isSafeInteger(num)) {
  // The number is so large that javascript cannot represent it with integer
  // precision.
    throw Error('cannot encode number outside of javascript safe integer range')
  } else if (num < 0) {
    encodeNegative(num, buf)
  } else {
    encodePositive(num, buf)
  }
  return buf
}

const encodePositive = (num, buf) => {
  buf[0] = 0x80

  for (var i = buf.length; i > 1; i--) {
    buf[i - 1] = num & 0xff
    num = Math.floor(num / 0x100)
  }
}

const encodeNegative = (num, buf) => {
  buf[0] = 0xff
  var flipped = false
  num = num * -1
  for (var i = buf.length; i > 1; i--) {
    var byte = num & 0xff
    num = Math.floor(num / 0x100)
    if (flipped) {
      buf[i - 1] = onesComp(byte)
    } else if (byte === 0) {
      buf[i - 1] = 0
    } else {
      flipped = true
      buf[i - 1] = twosComp(byte)
    }
  }
}

const parse = (buf) => {
  const pre = buf[0]
  const value = pre === 0x80 ? pos(buf.slice(1, buf.length))
    : pre === 0xff ? twos(buf)
    : null
  if (value === null) {
    throw Error('invalid base256 encoding')
  }

  if (!Number.isSafeInteger(value)) {
  // The number is so large that javascript cannot represent it with integer
  // precision.
    throw Error('parsed number outside of javascript safe integer range')
  }

  return value
}

const twos = (buf) => {
  var len = buf.length
  var sum = 0
  var flipped = false
  for (var i = len - 1; i > -1; i--) {
    var byte = buf[i]
    var f
    if (flipped) {
      f = onesComp(byte)
    } else if (byte === 0) {
      f = byte
    } else {
      flipped = true
      f = twosComp(byte)
    }
    if (f !== 0) {
      sum -= f * Math.pow(256, len - i - 1)
    }
  }
  return sum
}

const pos = (buf) => {
  var len = buf.length
  var sum = 0
  for (var i = len - 1; i > -1; i--) {
    var byte = buf[i]
    if (byte !== 0) {
      sum += byte * Math.pow(256, len - i - 1)
    }
  }
  return sum
}

const onesComp = byte => (0xff ^ byte) & 0xff

const twosComp = byte => ((0xff ^ byte) + 1) & 0xff

module.exports = {
  encode,
  parse,
}


/***/ }),
/* 137 */
/***/ ((module) => {

// warning: extremely hot code path.
// This has been meticulously optimized for use
// within npm install on large package trees.
// Do not edit without careful benchmarking.
module.exports = str => {
  let i = str.length - 1
  let slashesStart = -1
  while (i > -1 && str.charAt(i) === '/') {
    slashesStart = i
    i--
  }
  return slashesStart === -1 ? str : str.slice(0, slashesStart)
}


/***/ }),
/* 138 */
/***/ ((module) => {

"use strict";

module.exports = Base => class extends Base {
  warn (code, message, data = {}) {
    if (this.file) {
      data.file = this.file
    }
    if (this.cwd) {
      data.cwd = this.cwd
    }
    data.code = message instanceof Error && message.code || code
    data.tarCode = code
    if (!this.strict && data.recoverable !== false) {
      if (message instanceof Error) {
        data = Object.assign(message, data)
        message = message.message
      }
      this.emit('warn', data.tarCode, message, data)
    } else if (message instanceof Error) {
      this.emit('error', Object.assign(message, data))
    } else {
      this.emit('error', Object.assign(new Error(`${code}: ${message}`), data))
    }
  }
}


/***/ }),
/* 139 */
/***/ ((module) => {

"use strict";


// When writing files on Windows, translate the characters to their
// 0xf000 higher-encoded versions.

const raw = [
  '|',
  '<',
  '>',
  '?',
  ':',
]

const win = raw.map(char =>
  String.fromCharCode(0xf000 + char.charCodeAt(0)))

const toWin = new Map(raw.map((char, i) => [char, win[i]]))
const toRaw = new Map(win.map((char, i) => [char, raw[i]]))

module.exports = {
  encode: s => raw.reduce((s, c) => s.split(c).join(toWin.get(c)), s),
  decode: s => win.reduce((s, c) => s.split(c).join(toRaw.get(c)), s),
}


/***/ }),
/* 140 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// unix absolute paths are also absolute on win32, so we use this for both
const { isAbsolute, parse } = (__webpack_require__(58).win32)

// returns [root, stripped]
// Note that windows will think that //x/y/z/a has a "root" of //x/y, and in
// those cases, we want to sanitize it to x/y/z/a, not z/a, so we strip /
// explicitly if it's the first character.
// drive-specific relative paths on Windows get their root stripped off even
// though they are not absolute, so `c:../foo` becomes ['c:', '../foo']
module.exports = path => {
  let r = ''

  let parsed = parse(path)
  while (isAbsolute(path) || parsed.root) {
    // windows will think that //x/y/z has a "root" of //x/y/
    // but strip the //?/C:/ off of //?/C:/path
    const root = path.charAt(0) === '/' && path.slice(0, 4) !== '//?/' ? '/'
      : parsed.root
    path = path.slice(root.length)
    r += root
    parsed = parse(path)
  }
  return [r, path]
}


/***/ }),
/* 141 */
/***/ ((module) => {

"use strict";

module.exports = (mode, isDir, portable) => {
  mode &= 0o7777

  // in portable mode, use the minimum reasonable umask
  // if this system creates files with 0o664 by default
  // (as some linux distros do), then we'll write the
  // archive with 0o644 instead.  Also, don't ever create
  // a file that is not readable/writable by the owner.
  if (portable) {
    mode = (mode | 0o600) & ~0o22
  }

  // if dirs are readable, then they should be listable
  if (isDir) {
    if (mode & 0o400) {
      mode |= 0o100
    }
    if (mode & 0o40) {
      mode |= 0o10
    }
    if (mode & 0o4) {
      mode |= 0o1
    }
  }
  return mode
}


/***/ }),
/* 142 */
/***/ ((module) => {

"use strict";
module.exports = require("yallist");

/***/ }),
/* 143 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

const MiniPass = __webpack_require__(144)
const EE = (__webpack_require__(68).EventEmitter)
const fs = __webpack_require__(57)

let writev = fs.writev
/* istanbul ignore next */
if (!writev) {
  // This entire block can be removed if support for earlier than Node.js
  // 12.9.0 is not needed.
  const binding = process.binding('fs')
  const FSReqWrap = binding.FSReqWrap || binding.FSReqCallback

  writev = (fd, iovec, pos, cb) => {
    const done = (er, bw) => cb(er, bw, iovec)
    const req = new FSReqWrap()
    req.oncomplete = done
    binding.writeBuffers(fd, iovec, pos, req)
  }
}

const _autoClose = Symbol('_autoClose')
const _close = Symbol('_close')
const _ended = Symbol('_ended')
const _fd = Symbol('_fd')
const _finished = Symbol('_finished')
const _flags = Symbol('_flags')
const _flush = Symbol('_flush')
const _handleChunk = Symbol('_handleChunk')
const _makeBuf = Symbol('_makeBuf')
const _mode = Symbol('_mode')
const _needDrain = Symbol('_needDrain')
const _onerror = Symbol('_onerror')
const _onopen = Symbol('_onopen')
const _onread = Symbol('_onread')
const _onwrite = Symbol('_onwrite')
const _open = Symbol('_open')
const _path = Symbol('_path')
const _pos = Symbol('_pos')
const _queue = Symbol('_queue')
const _read = Symbol('_read')
const _readSize = Symbol('_readSize')
const _reading = Symbol('_reading')
const _remain = Symbol('_remain')
const _size = Symbol('_size')
const _write = Symbol('_write')
const _writing = Symbol('_writing')
const _defaultFlag = Symbol('_defaultFlag')
const _errored = Symbol('_errored')

class ReadStream extends MiniPass {
  constructor (path, opt) {
    opt = opt || {}
    super(opt)

    this.readable = true
    this.writable = false

    if (typeof path !== 'string')
      throw new TypeError('path must be a string')

    this[_errored] = false
    this[_fd] = typeof opt.fd === 'number' ? opt.fd : null
    this[_path] = path
    this[_readSize] = opt.readSize || 16*1024*1024
    this[_reading] = false
    this[_size] = typeof opt.size === 'number' ? opt.size : Infinity
    this[_remain] = this[_size]
    this[_autoClose] = typeof opt.autoClose === 'boolean' ?
      opt.autoClose : true

    if (typeof this[_fd] === 'number')
      this[_read]()
    else
      this[_open]()
  }

  get fd () { return this[_fd] }
  get path () { return this[_path] }

  write () {
    throw new TypeError('this is a readable stream')
  }

  end () {
    throw new TypeError('this is a readable stream')
  }

  [_open] () {
    fs.open(this[_path], 'r', (er, fd) => this[_onopen](er, fd))
  }

  [_onopen] (er, fd) {
    if (er)
      this[_onerror](er)
    else {
      this[_fd] = fd
      this.emit('open', fd)
      this[_read]()
    }
  }

  [_makeBuf] () {
    return Buffer.allocUnsafe(Math.min(this[_readSize], this[_remain]))
  }

  [_read] () {
    if (!this[_reading]) {
      this[_reading] = true
      const buf = this[_makeBuf]()
      /* istanbul ignore if */
      if (buf.length === 0)
        return process.nextTick(() => this[_onread](null, 0, buf))
      fs.read(this[_fd], buf, 0, buf.length, null, (er, br, buf) =>
        this[_onread](er, br, buf))
    }
  }

  [_onread] (er, br, buf) {
    this[_reading] = false
    if (er)
      this[_onerror](er)
    else if (this[_handleChunk](br, buf))
      this[_read]()
  }

  [_close] () {
    if (this[_autoClose] && typeof this[_fd] === 'number') {
      const fd = this[_fd]
      this[_fd] = null
      fs.close(fd, er => er ? this.emit('error', er) : this.emit('close'))
    }
  }

  [_onerror] (er) {
    this[_reading] = true
    this[_close]()
    this.emit('error', er)
  }

  [_handleChunk] (br, buf) {
    let ret = false
    // no effect if infinite
    this[_remain] -= br
    if (br > 0)
      ret = super.write(br < buf.length ? buf.slice(0, br) : buf)

    if (br === 0 || this[_remain] <= 0) {
      ret = false
      this[_close]()
      super.end()
    }

    return ret
  }

  emit (ev, data) {
    switch (ev) {
      case 'prefinish':
      case 'finish':
        break

      case 'drain':
        if (typeof this[_fd] === 'number')
          this[_read]()
        break

      case 'error':
        if (this[_errored])
          return
        this[_errored] = true
        return super.emit(ev, data)

      default:
        return super.emit(ev, data)
    }
  }
}

class ReadStreamSync extends ReadStream {
  [_open] () {
    let threw = true
    try {
      this[_onopen](null, fs.openSync(this[_path], 'r'))
      threw = false
    } finally {
      if (threw)
        this[_close]()
    }
  }

  [_read] () {
    let threw = true
    try {
      if (!this[_reading]) {
        this[_reading] = true
        do {
          const buf = this[_makeBuf]()
          /* istanbul ignore next */
          const br = buf.length === 0 ? 0
            : fs.readSync(this[_fd], buf, 0, buf.length, null)
          if (!this[_handleChunk](br, buf))
            break
        } while (true)
        this[_reading] = false
      }
      threw = false
    } finally {
      if (threw)
        this[_close]()
    }
  }

  [_close] () {
    if (this[_autoClose] && typeof this[_fd] === 'number') {
      const fd = this[_fd]
      this[_fd] = null
      fs.closeSync(fd)
      this.emit('close')
    }
  }
}

class WriteStream extends EE {
  constructor (path, opt) {
    opt = opt || {}
    super(opt)
    this.readable = false
    this.writable = true
    this[_errored] = false
    this[_writing] = false
    this[_ended] = false
    this[_needDrain] = false
    this[_queue] = []
    this[_path] = path
    this[_fd] = typeof opt.fd === 'number' ? opt.fd : null
    this[_mode] = opt.mode === undefined ? 0o666 : opt.mode
    this[_pos] = typeof opt.start === 'number' ? opt.start : null
    this[_autoClose] = typeof opt.autoClose === 'boolean' ?
      opt.autoClose : true

    // truncating makes no sense when writing into the middle
    const defaultFlag = this[_pos] !== null ? 'r+' : 'w'
    this[_defaultFlag] = opt.flags === undefined
    this[_flags] = this[_defaultFlag] ? defaultFlag : opt.flags

    if (this[_fd] === null)
      this[_open]()
  }

  emit (ev, data) {
    if (ev === 'error') {
      if (this[_errored])
        return
      this[_errored] = true
    }
    return super.emit(ev, data)
  }


  get fd () { return this[_fd] }
  get path () { return this[_path] }

  [_onerror] (er) {
    this[_close]()
    this[_writing] = true
    this.emit('error', er)
  }

  [_open] () {
    fs.open(this[_path], this[_flags], this[_mode],
      (er, fd) => this[_onopen](er, fd))
  }

  [_onopen] (er, fd) {
    if (this[_defaultFlag] &&
        this[_flags] === 'r+' &&
        er && er.code === 'ENOENT') {
      this[_flags] = 'w'
      this[_open]()
    } else if (er)
      this[_onerror](er)
    else {
      this[_fd] = fd
      this.emit('open', fd)
      this[_flush]()
    }
  }

  end (buf, enc) {
    if (buf)
      this.write(buf, enc)

    this[_ended] = true

    // synthetic after-write logic, where drain/finish live
    if (!this[_writing] && !this[_queue].length &&
        typeof this[_fd] === 'number')
      this[_onwrite](null, 0)
    return this
  }

  write (buf, enc) {
    if (typeof buf === 'string')
      buf = Buffer.from(buf, enc)

    if (this[_ended]) {
      this.emit('error', new Error('write() after end()'))
      return false
    }

    if (this[_fd] === null || this[_writing] || this[_queue].length) {
      this[_queue].push(buf)
      this[_needDrain] = true
      return false
    }

    this[_writing] = true
    this[_write](buf)
    return true
  }

  [_write] (buf) {
    fs.write(this[_fd], buf, 0, buf.length, this[_pos], (er, bw) =>
      this[_onwrite](er, bw))
  }

  [_onwrite] (er, bw) {
    if (er)
      this[_onerror](er)
    else {
      if (this[_pos] !== null)
        this[_pos] += bw
      if (this[_queue].length)
        this[_flush]()
      else {
        this[_writing] = false

        if (this[_ended] && !this[_finished]) {
          this[_finished] = true
          this[_close]()
          this.emit('finish')
        } else if (this[_needDrain]) {
          this[_needDrain] = false
          this.emit('drain')
        }
      }
    }
  }

  [_flush] () {
    if (this[_queue].length === 0) {
      if (this[_ended])
        this[_onwrite](null, 0)
    } else if (this[_queue].length === 1)
      this[_write](this[_queue].pop())
    else {
      const iovec = this[_queue]
      this[_queue] = []
      writev(this[_fd], iovec, this[_pos],
        (er, bw) => this[_onwrite](er, bw))
    }
  }

  [_close] () {
    if (this[_autoClose] && typeof this[_fd] === 'number') {
      const fd = this[_fd]
      this[_fd] = null
      fs.close(fd, er => er ? this.emit('error', er) : this.emit('close'))
    }
  }
}

class WriteStreamSync extends WriteStream {
  [_open] () {
    let fd
    // only wrap in a try{} block if we know we'll retry, to avoid
    // the rethrow obscuring the error's source frame in most cases.
    if (this[_defaultFlag] && this[_flags] === 'r+') {
      try {
        fd = fs.openSync(this[_path], this[_flags], this[_mode])
      } catch (er) {
        if (er.code === 'ENOENT') {
          this[_flags] = 'w'
          return this[_open]()
        } else
          throw er
      }
    } else
      fd = fs.openSync(this[_path], this[_flags], this[_mode])

    this[_onopen](null, fd)
  }

  [_close] () {
    if (this[_autoClose] && typeof this[_fd] === 'number') {
      const fd = this[_fd]
      this[_fd] = null
      fs.closeSync(fd)
      this.emit('close')
    }
  }

  [_write] (buf) {
    // throw the original, but try to close if it fails
    let threw = true
    try {
      this[_onwrite](null,
        fs.writeSync(this[_fd], buf, 0, buf.length, this[_pos]))
      threw = false
    } finally {
      if (threw)
        try { this[_close]() } catch (_) {}
    }
  }
}

exports.ReadStream = ReadStream
exports.ReadStreamSync = ReadStreamSync

exports.WriteStream = WriteStream
exports.WriteStreamSync = WriteStreamSync


/***/ }),
/* 144 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const proc = typeof process === 'object' && process ? process : {
  stdout: null,
  stderr: null,
}
const EE = __webpack_require__(68)
const Stream = __webpack_require__(61)
const SD = (__webpack_require__(123).StringDecoder)

const EOF = Symbol('EOF')
const MAYBE_EMIT_END = Symbol('maybeEmitEnd')
const EMITTED_END = Symbol('emittedEnd')
const EMITTING_END = Symbol('emittingEnd')
const EMITTED_ERROR = Symbol('emittedError')
const CLOSED = Symbol('closed')
const READ = Symbol('read')
const FLUSH = Symbol('flush')
const FLUSHCHUNK = Symbol('flushChunk')
const ENCODING = Symbol('encoding')
const DECODER = Symbol('decoder')
const FLOWING = Symbol('flowing')
const PAUSED = Symbol('paused')
const RESUME = Symbol('resume')
const BUFFERLENGTH = Symbol('bufferLength')
const BUFFERPUSH = Symbol('bufferPush')
const BUFFERSHIFT = Symbol('bufferShift')
const OBJECTMODE = Symbol('objectMode')
const DESTROYED = Symbol('destroyed')
const EMITDATA = Symbol('emitData')
const EMITEND = Symbol('emitEnd')
const EMITEND2 = Symbol('emitEnd2')
const ASYNC = Symbol('async')

const defer = fn => Promise.resolve().then(fn)

// TODO remove when Node v8 support drops
const doIter = global._MP_NO_ITERATOR_SYMBOLS_  !== '1'
const ASYNCITERATOR = doIter && Symbol.asyncIterator
  || Symbol('asyncIterator not implemented')
const ITERATOR = doIter && Symbol.iterator
  || Symbol('iterator not implemented')

// events that mean 'the stream is over'
// these are treated specially, and re-emitted
// if they are listened for after emitting.
const isEndish = ev =>
  ev === 'end' ||
  ev === 'finish' ||
  ev === 'prefinish'

const isArrayBuffer = b => b instanceof ArrayBuffer ||
  typeof b === 'object' &&
  b.constructor &&
  b.constructor.name === 'ArrayBuffer' &&
  b.byteLength >= 0

const isArrayBufferView = b => !Buffer.isBuffer(b) && ArrayBuffer.isView(b)

class Pipe {
  constructor (src, dest, opts) {
    this.src = src
    this.dest = dest
    this.opts = opts
    this.ondrain = () => src[RESUME]()
    dest.on('drain', this.ondrain)
  }
  unpipe () {
    this.dest.removeListener('drain', this.ondrain)
  }
  // istanbul ignore next - only here for the prototype
  proxyErrors () {}
  end () {
    this.unpipe()
    if (this.opts.end)
      this.dest.end()
  }
}

class PipeProxyErrors extends Pipe {
  unpipe () {
    this.src.removeListener('error', this.proxyErrors)
    super.unpipe()
  }
  constructor (src, dest, opts) {
    super(src, dest, opts)
    this.proxyErrors = er => dest.emit('error', er)
    src.on('error', this.proxyErrors)
  }
}

module.exports = class Minipass extends Stream {
  constructor (options) {
    super()
    this[FLOWING] = false
    // whether we're explicitly paused
    this[PAUSED] = false
    this.pipes = []
    this.buffer = []
    this[OBJECTMODE] = options && options.objectMode || false
    if (this[OBJECTMODE])
      this[ENCODING] = null
    else
      this[ENCODING] = options && options.encoding || null
    if (this[ENCODING] === 'buffer')
      this[ENCODING] = null
    this[ASYNC] = options && !!options.async || false
    this[DECODER] = this[ENCODING] ? new SD(this[ENCODING]) : null
    this[EOF] = false
    this[EMITTED_END] = false
    this[EMITTING_END] = false
    this[CLOSED] = false
    this[EMITTED_ERROR] = null
    this.writable = true
    this.readable = true
    this[BUFFERLENGTH] = 0
    this[DESTROYED] = false
  }

  get bufferLength () { return this[BUFFERLENGTH] }

  get encoding () { return this[ENCODING] }
  set encoding (enc) {
    if (this[OBJECTMODE])
      throw new Error('cannot set encoding in objectMode')

    if (this[ENCODING] && enc !== this[ENCODING] &&
        (this[DECODER] && this[DECODER].lastNeed || this[BUFFERLENGTH]))
      throw new Error('cannot change encoding')

    if (this[ENCODING] !== enc) {
      this[DECODER] = enc ? new SD(enc) : null
      if (this.buffer.length)
        this.buffer = this.buffer.map(chunk => this[DECODER].write(chunk))
    }

    this[ENCODING] = enc
  }

  setEncoding (enc) {
    this.encoding = enc
  }

  get objectMode () { return this[OBJECTMODE] }
  set objectMode (om) { this[OBJECTMODE] = this[OBJECTMODE] || !!om }

  get ['async'] () { return this[ASYNC] }
  set ['async'] (a) { this[ASYNC] = this[ASYNC] || !!a }

  write (chunk, encoding, cb) {
    if (this[EOF])
      throw new Error('write after end')

    if (this[DESTROYED]) {
      this.emit('error', Object.assign(
        new Error('Cannot call write after a stream was destroyed'),
        { code: 'ERR_STREAM_DESTROYED' }
      ))
      return true
    }

    if (typeof encoding === 'function')
      cb = encoding, encoding = 'utf8'

    if (!encoding)
      encoding = 'utf8'

    const fn = this[ASYNC] ? defer : f => f()

    // convert array buffers and typed array views into buffers
    // at some point in the future, we may want to do the opposite!
    // leave strings and buffers as-is
    // anything else switches us into object mode
    if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
      if (isArrayBufferView(chunk))
        chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)
      else if (isArrayBuffer(chunk))
        chunk = Buffer.from(chunk)
      else if (typeof chunk !== 'string')
        // use the setter so we throw if we have encoding set
        this.objectMode = true
    }

    // handle object mode up front, since it's simpler
    // this yields better performance, fewer checks later.
    if (this[OBJECTMODE]) {
      /* istanbul ignore if - maybe impossible? */
      if (this.flowing && this[BUFFERLENGTH] !== 0)
        this[FLUSH](true)

      if (this.flowing)
        this.emit('data', chunk)
      else
        this[BUFFERPUSH](chunk)

      if (this[BUFFERLENGTH] !== 0)
        this.emit('readable')

      if (cb)
        fn(cb)

      return this.flowing
    }

    // at this point the chunk is a buffer or string
    // don't buffer it up or send it to the decoder
    if (!chunk.length) {
      if (this[BUFFERLENGTH] !== 0)
        this.emit('readable')
      if (cb)
        fn(cb)
      return this.flowing
    }

    // fast-path writing strings of same encoding to a stream with
    // an empty buffer, skipping the buffer/decoder dance
    if (typeof chunk === 'string' &&
        // unless it is a string already ready for us to use
        !(encoding === this[ENCODING] && !this[DECODER].lastNeed)) {
      chunk = Buffer.from(chunk, encoding)
    }

    if (Buffer.isBuffer(chunk) && this[ENCODING])
      chunk = this[DECODER].write(chunk)

    // Note: flushing CAN potentially switch us into not-flowing mode
    if (this.flowing && this[BUFFERLENGTH] !== 0)
      this[FLUSH](true)

    if (this.flowing)
      this.emit('data', chunk)
    else
      this[BUFFERPUSH](chunk)

    if (this[BUFFERLENGTH] !== 0)
      this.emit('readable')

    if (cb)
      fn(cb)

    return this.flowing
  }

  read (n) {
    if (this[DESTROYED])
      return null

    if (this[BUFFERLENGTH] === 0 || n === 0 || n > this[BUFFERLENGTH]) {
      this[MAYBE_EMIT_END]()
      return null
    }

    if (this[OBJECTMODE])
      n = null

    if (this.buffer.length > 1 && !this[OBJECTMODE]) {
      if (this.encoding)
        this.buffer = [this.buffer.join('')]
      else
        this.buffer = [Buffer.concat(this.buffer, this[BUFFERLENGTH])]
    }

    const ret = this[READ](n || null, this.buffer[0])
    this[MAYBE_EMIT_END]()
    return ret
  }

  [READ] (n, chunk) {
    if (n === chunk.length || n === null)
      this[BUFFERSHIFT]()
    else {
      this.buffer[0] = chunk.slice(n)
      chunk = chunk.slice(0, n)
      this[BUFFERLENGTH] -= n
    }

    this.emit('data', chunk)

    if (!this.buffer.length && !this[EOF])
      this.emit('drain')

    return chunk
  }

  end (chunk, encoding, cb) {
    if (typeof chunk === 'function')
      cb = chunk, chunk = null
    if (typeof encoding === 'function')
      cb = encoding, encoding = 'utf8'
    if (chunk)
      this.write(chunk, encoding)
    if (cb)
      this.once('end', cb)
    this[EOF] = true
    this.writable = false

    // if we haven't written anything, then go ahead and emit,
    // even if we're not reading.
    // we'll re-emit if a new 'end' listener is added anyway.
    // This makes MP more suitable to write-only use cases.
    if (this.flowing || !this[PAUSED])
      this[MAYBE_EMIT_END]()
    return this
  }

  // don't let the internal resume be overwritten
  [RESUME] () {
    if (this[DESTROYED])
      return

    this[PAUSED] = false
    this[FLOWING] = true
    this.emit('resume')
    if (this.buffer.length)
      this[FLUSH]()
    else if (this[EOF])
      this[MAYBE_EMIT_END]()
    else
      this.emit('drain')
  }

  resume () {
    return this[RESUME]()
  }

  pause () {
    this[FLOWING] = false
    this[PAUSED] = true
  }

  get destroyed () {
    return this[DESTROYED]
  }

  get flowing () {
    return this[FLOWING]
  }

  get paused () {
    return this[PAUSED]
  }

  [BUFFERPUSH] (chunk) {
    if (this[OBJECTMODE])
      this[BUFFERLENGTH] += 1
    else
      this[BUFFERLENGTH] += chunk.length
    this.buffer.push(chunk)
  }

  [BUFFERSHIFT] () {
    if (this.buffer.length) {
      if (this[OBJECTMODE])
        this[BUFFERLENGTH] -= 1
      else
        this[BUFFERLENGTH] -= this.buffer[0].length
    }
    return this.buffer.shift()
  }

  [FLUSH] (noDrain) {
    do {} while (this[FLUSHCHUNK](this[BUFFERSHIFT]()))

    if (!noDrain && !this.buffer.length && !this[EOF])
      this.emit('drain')
  }

  [FLUSHCHUNK] (chunk) {
    return chunk ? (this.emit('data', chunk), this.flowing) : false
  }

  pipe (dest, opts) {
    if (this[DESTROYED])
      return

    const ended = this[EMITTED_END]
    opts = opts || {}
    if (dest === proc.stdout || dest === proc.stderr)
      opts.end = false
    else
      opts.end = opts.end !== false
    opts.proxyErrors = !!opts.proxyErrors

    // piping an ended stream ends immediately
    if (ended) {
      if (opts.end)
        dest.end()
    } else {
      this.pipes.push(!opts.proxyErrors ? new Pipe(this, dest, opts)
        : new PipeProxyErrors(this, dest, opts))
      if (this[ASYNC])
        defer(() => this[RESUME]())
      else
        this[RESUME]()
    }

    return dest
  }

  unpipe (dest) {
    const p = this.pipes.find(p => p.dest === dest)
    if (p) {
      this.pipes.splice(this.pipes.indexOf(p), 1)
      p.unpipe()
    }
  }

  addListener (ev, fn) {
    return this.on(ev, fn)
  }

  on (ev, fn) {
    const ret = super.on(ev, fn)
    if (ev === 'data' && !this.pipes.length && !this.flowing)
      this[RESUME]()
    else if (ev === 'readable' && this[BUFFERLENGTH] !== 0)
      super.emit('readable')
    else if (isEndish(ev) && this[EMITTED_END]) {
      super.emit(ev)
      this.removeAllListeners(ev)
    } else if (ev === 'error' && this[EMITTED_ERROR]) {
      if (this[ASYNC])
        defer(() => fn.call(this, this[EMITTED_ERROR]))
      else
        fn.call(this, this[EMITTED_ERROR])
    }
    return ret
  }

  get emittedEnd () {
    return this[EMITTED_END]
  }

  [MAYBE_EMIT_END] () {
    if (!this[EMITTING_END] &&
        !this[EMITTED_END] &&
        !this[DESTROYED] &&
        this.buffer.length === 0 &&
        this[EOF]) {
      this[EMITTING_END] = true
      this.emit('end')
      this.emit('prefinish')
      this.emit('finish')
      if (this[CLOSED])
        this.emit('close')
      this[EMITTING_END] = false
    }
  }

  emit (ev, data, ...extra) {
    // error and close are only events allowed after calling destroy()
    if (ev !== 'error' && ev !== 'close' && ev !== DESTROYED && this[DESTROYED])
      return
    else if (ev === 'data') {
      return !data ? false
        : this[ASYNC] ? defer(() => this[EMITDATA](data))
        : this[EMITDATA](data)
    } else if (ev === 'end') {
      return this[EMITEND]()
    } else if (ev === 'close') {
      this[CLOSED] = true
      // don't emit close before 'end' and 'finish'
      if (!this[EMITTED_END] && !this[DESTROYED])
        return
      const ret = super.emit('close')
      this.removeAllListeners('close')
      return ret
    } else if (ev === 'error') {
      this[EMITTED_ERROR] = data
      const ret = super.emit('error', data)
      this[MAYBE_EMIT_END]()
      return ret
    } else if (ev === 'resume') {
      const ret = super.emit('resume')
      this[MAYBE_EMIT_END]()
      return ret
    } else if (ev === 'finish' || ev === 'prefinish') {
      const ret = super.emit(ev)
      this.removeAllListeners(ev)
      return ret
    }

    // Some other unknown event
    const ret = super.emit(ev, data, ...extra)
    this[MAYBE_EMIT_END]()
    return ret
  }

  [EMITDATA] (data) {
    for (const p of this.pipes) {
      if (p.dest.write(data) === false)
        this.pause()
    }
    const ret = super.emit('data', data)
    this[MAYBE_EMIT_END]()
    return ret
  }

  [EMITEND] () {
    if (this[EMITTED_END])
      return

    this[EMITTED_END] = true
    this.readable = false
    if (this[ASYNC])
      defer(() => this[EMITEND2]())
    else
      this[EMITEND2]()
  }

  [EMITEND2] () {
    if (this[DECODER]) {
      const data = this[DECODER].end()
      if (data) {
        for (const p of this.pipes) {
          p.dest.write(data)
        }
        super.emit('data', data)
      }
    }

    for (const p of this.pipes) {
      p.end()
    }
    const ret = super.emit('end')
    this.removeAllListeners('end')
    return ret
  }

  // const all = await stream.collect()
  collect () {
    const buf = []
    if (!this[OBJECTMODE])
      buf.dataLength = 0
    // set the promise first, in case an error is raised
    // by triggering the flow here.
    const p = this.promise()
    this.on('data', c => {
      buf.push(c)
      if (!this[OBJECTMODE])
        buf.dataLength += c.length
    })
    return p.then(() => buf)
  }

  // const data = await stream.concat()
  concat () {
    return this[OBJECTMODE]
      ? Promise.reject(new Error('cannot concat in objectMode'))
      : this.collect().then(buf =>
          this[OBJECTMODE]
            ? Promise.reject(new Error('cannot concat in objectMode'))
            : this[ENCODING] ? buf.join('') : Buffer.concat(buf, buf.dataLength))
  }

  // stream.promise().then(() => done, er => emitted error)
  promise () {
    return new Promise((resolve, reject) => {
      this.on(DESTROYED, () => reject(new Error('stream destroyed')))
      this.on('error', er => reject(er))
      this.on('end', () => resolve())
    })
  }

  // for await (let chunk of stream)
  [ASYNCITERATOR] () {
    const next = () => {
      const res = this.read()
      if (res !== null)
        return Promise.resolve({ done: false, value: res })

      if (this[EOF])
        return Promise.resolve({ done: true })

      let resolve = null
      let reject = null
      const onerr = er => {
        this.removeListener('data', ondata)
        this.removeListener('end', onend)
        reject(er)
      }
      const ondata = value => {
        this.removeListener('error', onerr)
        this.removeListener('end', onend)
        this.pause()
        resolve({ value: value, done: !!this[EOF] })
      }
      const onend = () => {
        this.removeListener('error', onerr)
        this.removeListener('data', ondata)
        resolve({ done: true })
      }
      const ondestroy = () => onerr(new Error('stream destroyed'))
      return new Promise((res, rej) => {
        reject = rej
        resolve = res
        this.once(DESTROYED, ondestroy)
        this.once('error', onerr)
        this.once('end', onend)
        this.once('data', ondata)
      })
    }

    return { next }
  }

  // for (let chunk of stream)
  [ITERATOR] () {
    const next = () => {
      const value = this.read()
      const done = value === null
      return { value, done }
    }
    return { next }
  }

  destroy (er) {
    if (this[DESTROYED]) {
      if (er)
        this.emit('error', er)
      else
        this.emit(DESTROYED)
      return this
    }

    this[DESTROYED] = true

    // throw away all buffered data, it's never coming out
    this.buffer.length = 0
    this[BUFFERLENGTH] = 0

    if (typeof this.close === 'function' && !this[CLOSED])
      this.close()

    if (er)
      this.emit('error', er)
    else // if no error to emit, still reject pending promises
      this.emit(DESTROYED)

    return this
  }

  static isStream (s) {
    return !!s && (s instanceof Minipass || s instanceof Stream ||
      s instanceof EE && (
        typeof s.pipe === 'function' || // readable
        (typeof s.write === 'function' && typeof s.end === 'function') // writable
      ))
  }
}


/***/ }),
/* 145 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// XXX: This shares a lot in common with extract.js
// maybe some DRY opportunity here?

// tar -t
const hlo = __webpack_require__(120)
const Parser = __webpack_require__(146)
const fs = __webpack_require__(57)
const fsm = __webpack_require__(143)
const path = __webpack_require__(58)
const stripSlash = __webpack_require__(137)

module.exports = (opt_, files, cb) => {
  if (typeof opt_ === 'function') {
    cb = opt_, files = null, opt_ = {}
  } else if (Array.isArray(opt_)) {
    files = opt_, opt_ = {}
  }

  if (typeof files === 'function') {
    cb = files, files = null
  }

  if (!files) {
    files = []
  } else {
    files = Array.from(files)
  }

  const opt = hlo(opt_)

  if (opt.sync && typeof cb === 'function') {
    throw new TypeError('callback not supported for sync tar functions')
  }

  if (!opt.file && typeof cb === 'function') {
    throw new TypeError('callback only supported with file option')
  }

  if (files.length) {
    filesFilter(opt, files)
  }

  if (!opt.noResume) {
    onentryFunction(opt)
  }

  return opt.file && opt.sync ? listFileSync(opt)
    : opt.file ? listFile(opt, cb)
    : list(opt)
}

const onentryFunction = opt => {
  const onentry = opt.onentry
  opt.onentry = onentry ? e => {
    onentry(e)
    e.resume()
  } : e => e.resume()
}

// construct a filter that limits the file entries listed
// include child entries if a dir is included
const filesFilter = (opt, files) => {
  const map = new Map(files.map(f => [stripSlash(f), true]))
  const filter = opt.filter

  const mapHas = (file, r) => {
    const root = r || path.parse(file).root || '.'
    const ret = file === root ? false
      : map.has(file) ? map.get(file)
      : mapHas(path.dirname(file), root)

    map.set(file, ret)
    return ret
  }

  opt.filter = filter
    ? (file, entry) => filter(file, entry) && mapHas(stripSlash(file))
    : file => mapHas(stripSlash(file))
}

const listFileSync = opt => {
  const p = list(opt)
  const file = opt.file
  let threw = true
  let fd
  try {
    const stat = fs.statSync(file)
    const readSize = opt.maxReadSize || 16 * 1024 * 1024
    if (stat.size < readSize) {
      p.end(fs.readFileSync(file))
    } else {
      let pos = 0
      const buf = Buffer.allocUnsafe(readSize)
      fd = fs.openSync(file, 'r')
      while (pos < stat.size) {
        const bytesRead = fs.readSync(fd, buf, 0, readSize, pos)
        pos += bytesRead
        p.write(buf.slice(0, bytesRead))
      }
      p.end()
    }
    threw = false
  } finally {
    if (threw && fd) {
      try {
        fs.closeSync(fd)
      } catch (er) {}
    }
  }
}

const listFile = (opt, cb) => {
  const parse = new Parser(opt)
  const readSize = opt.maxReadSize || 16 * 1024 * 1024

  const file = opt.file
  const p = new Promise((resolve, reject) => {
    parse.on('error', reject)
    parse.on('end', resolve)

    fs.stat(file, (er, stat) => {
      if (er) {
        reject(er)
      } else {
        const stream = new fsm.ReadStream(file, {
          readSize: readSize,
          size: stat.size,
        })
        stream.on('error', reject)
        stream.pipe(parse)
      }
    })
  })
  return cb ? p.then(cb, cb) : p
}

const list = opt => new Parser(opt)


/***/ }),
/* 146 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// this[BUFFER] is the remainder of a chunk if we're waiting for
// the full 512 bytes of a header to come in.  We will Buffer.concat()
// it to the next write(), which is a mem copy, but a small one.
//
// this[QUEUE] is a Yallist of entries that haven't been emitted
// yet this can only get filled up if the user keeps write()ing after
// a write() returns false, or does a write() with more than one entry
//
// We don't buffer chunks, we always parse them and either create an
// entry, or push it into the active entry.  The ReadEntry class knows
// to throw data away if .ignore=true
//
// Shift entry off the buffer when it emits 'end', and emit 'entry' for
// the next one in the list.
//
// At any time, we're pushing body chunks into the entry at WRITEENTRY,
// and waiting for 'end' on the entry at READENTRY
//
// ignored entries get .resume() called on them straight away

const warner = __webpack_require__(138)
const Header = __webpack_require__(134)
const EE = __webpack_require__(68)
const Yallist = __webpack_require__(142)
const maxMetaEntrySize = 1024 * 1024
const Entry = __webpack_require__(130)
const Pax = __webpack_require__(133)
const zlib = __webpack_require__(124)
const { nextTick } = __webpack_require__(147)

const gzipHeader = Buffer.from([0x1f, 0x8b])
const STATE = Symbol('state')
const WRITEENTRY = Symbol('writeEntry')
const READENTRY = Symbol('readEntry')
const NEXTENTRY = Symbol('nextEntry')
const PROCESSENTRY = Symbol('processEntry')
const EX = Symbol('extendedHeader')
const GEX = Symbol('globalExtendedHeader')
const META = Symbol('meta')
const EMITMETA = Symbol('emitMeta')
const BUFFER = Symbol('buffer')
const QUEUE = Symbol('queue')
const ENDED = Symbol('ended')
const EMITTEDEND = Symbol('emittedEnd')
const EMIT = Symbol('emit')
const UNZIP = Symbol('unzip')
const CONSUMECHUNK = Symbol('consumeChunk')
const CONSUMECHUNKSUB = Symbol('consumeChunkSub')
const CONSUMEBODY = Symbol('consumeBody')
const CONSUMEMETA = Symbol('consumeMeta')
const CONSUMEHEADER = Symbol('consumeHeader')
const CONSUMING = Symbol('consuming')
const BUFFERCONCAT = Symbol('bufferConcat')
const MAYBEEND = Symbol('maybeEnd')
const WRITING = Symbol('writing')
const ABORTED = Symbol('aborted')
const DONE = Symbol('onDone')
const SAW_VALID_ENTRY = Symbol('sawValidEntry')
const SAW_NULL_BLOCK = Symbol('sawNullBlock')
const SAW_EOF = Symbol('sawEOF')
const CLOSESTREAM = Symbol('closeStream')

const noop = _ => true

module.exports = warner(class Parser extends EE {
  constructor (opt) {
    opt = opt || {}
    super(opt)

    this.file = opt.file || ''

    // set to boolean false when an entry starts.  1024 bytes of \0
    // is technically a valid tarball, albeit a boring one.
    this[SAW_VALID_ENTRY] = null

    // these BADARCHIVE errors can't be detected early. listen on DONE.
    this.on(DONE, _ => {
      if (this[STATE] === 'begin' || this[SAW_VALID_ENTRY] === false) {
        // either less than 1 block of data, or all entries were invalid.
        // Either way, probably not even a tarball.
        this.warn('TAR_BAD_ARCHIVE', 'Unrecognized archive format')
      }
    })

    if (opt.ondone) {
      this.on(DONE, opt.ondone)
    } else {
      this.on(DONE, _ => {
        this.emit('prefinish')
        this.emit('finish')
        this.emit('end')
      })
    }

    this.strict = !!opt.strict
    this.maxMetaEntrySize = opt.maxMetaEntrySize || maxMetaEntrySize
    this.filter = typeof opt.filter === 'function' ? opt.filter : noop

    // have to set this so that streams are ok piping into it
    this.writable = true
    this.readable = false

    this[QUEUE] = new Yallist()
    this[BUFFER] = null
    this[READENTRY] = null
    this[WRITEENTRY] = null
    this[STATE] = 'begin'
    this[META] = ''
    this[EX] = null
    this[GEX] = null
    this[ENDED] = false
    this[UNZIP] = null
    this[ABORTED] = false
    this[SAW_NULL_BLOCK] = false
    this[SAW_EOF] = false

    this.on('end', () => this[CLOSESTREAM]())

    if (typeof opt.onwarn === 'function') {
      this.on('warn', opt.onwarn)
    }
    if (typeof opt.onentry === 'function') {
      this.on('entry', opt.onentry)
    }
  }

  [CONSUMEHEADER] (chunk, position) {
    if (this[SAW_VALID_ENTRY] === null) {
      this[SAW_VALID_ENTRY] = false
    }
    let header
    try {
      header = new Header(chunk, position, this[EX], this[GEX])
    } catch (er) {
      return this.warn('TAR_ENTRY_INVALID', er)
    }

    if (header.nullBlock) {
      if (this[SAW_NULL_BLOCK]) {
        this[SAW_EOF] = true
        // ending an archive with no entries.  pointless, but legal.
        if (this[STATE] === 'begin') {
          this[STATE] = 'header'
        }
        this[EMIT]('eof')
      } else {
        this[SAW_NULL_BLOCK] = true
        this[EMIT]('nullBlock')
      }
    } else {
      this[SAW_NULL_BLOCK] = false
      if (!header.cksumValid) {
        this.warn('TAR_ENTRY_INVALID', 'checksum failure', { header })
      } else if (!header.path) {
        this.warn('TAR_ENTRY_INVALID', 'path is required', { header })
      } else {
        const type = header.type
        if (/^(Symbolic)?Link$/.test(type) && !header.linkpath) {
          this.warn('TAR_ENTRY_INVALID', 'linkpath required', { header })
        } else if (!/^(Symbolic)?Link$/.test(type) && header.linkpath) {
          this.warn('TAR_ENTRY_INVALID', 'linkpath forbidden', { header })
        } else {
          const entry = this[WRITEENTRY] = new Entry(header, this[EX], this[GEX])

          // we do this for meta & ignored entries as well, because they
          // are still valid tar, or else we wouldn't know to ignore them
          if (!this[SAW_VALID_ENTRY]) {
            if (entry.remain) {
              // this might be the one!
              const onend = () => {
                if (!entry.invalid) {
                  this[SAW_VALID_ENTRY] = true
                }
              }
              entry.on('end', onend)
            } else {
              this[SAW_VALID_ENTRY] = true
            }
          }

          if (entry.meta) {
            if (entry.size > this.maxMetaEntrySize) {
              entry.ignore = true
              this[EMIT]('ignoredEntry', entry)
              this[STATE] = 'ignore'
              entry.resume()
            } else if (entry.size > 0) {
              this[META] = ''
              entry.on('data', c => this[META] += c)
              this[STATE] = 'meta'
            }
          } else {
            this[EX] = null
            entry.ignore = entry.ignore || !this.filter(entry.path, entry)

            if (entry.ignore) {
              // probably valid, just not something we care about
              this[EMIT]('ignoredEntry', entry)
              this[STATE] = entry.remain ? 'ignore' : 'header'
              entry.resume()
            } else {
              if (entry.remain) {
                this[STATE] = 'body'
              } else {
                this[STATE] = 'header'
                entry.end()
              }

              if (!this[READENTRY]) {
                this[QUEUE].push(entry)
                this[NEXTENTRY]()
              } else {
                this[QUEUE].push(entry)
              }
            }
          }
        }
      }
    }
  }

  [CLOSESTREAM] () {
    nextTick(() => this.emit('close'))
  }

  [PROCESSENTRY] (entry) {
    let go = true

    if (!entry) {
      this[READENTRY] = null
      go = false
    } else if (Array.isArray(entry)) {
      this.emit.apply(this, entry)
    } else {
      this[READENTRY] = entry
      this.emit('entry', entry)
      if (!entry.emittedEnd) {
        entry.on('end', _ => this[NEXTENTRY]())
        go = false
      }
    }

    return go
  }

  [NEXTENTRY] () {
    do {} while (this[PROCESSENTRY](this[QUEUE].shift()))

    if (!this[QUEUE].length) {
      // At this point, there's nothing in the queue, but we may have an
      // entry which is being consumed (readEntry).
      // If we don't, then we definitely can handle more data.
      // If we do, and either it's flowing, or it has never had any data
      // written to it, then it needs more.
      // The only other possibility is that it has returned false from a
      // write() call, so we wait for the next drain to continue.
      const re = this[READENTRY]
      const drainNow = !re || re.flowing || re.size === re.remain
      if (drainNow) {
        if (!this[WRITING]) {
          this.emit('drain')
        }
      } else {
        re.once('drain', _ => this.emit('drain'))
      }
    }
  }

  [CONSUMEBODY] (chunk, position) {
    // write up to but no  more than writeEntry.blockRemain
    const entry = this[WRITEENTRY]
    const br = entry.blockRemain
    const c = (br >= chunk.length && position === 0) ? chunk
      : chunk.slice(position, position + br)

    entry.write(c)

    if (!entry.blockRemain) {
      this[STATE] = 'header'
      this[WRITEENTRY] = null
      entry.end()
    }

    return c.length
  }

  [CONSUMEMETA] (chunk, position) {
    const entry = this[WRITEENTRY]
    const ret = this[CONSUMEBODY](chunk, position)

    // if we finished, then the entry is reset
    if (!this[WRITEENTRY]) {
      this[EMITMETA](entry)
    }

    return ret
  }

  [EMIT] (ev, data, extra) {
    if (!this[QUEUE].length && !this[READENTRY]) {
      this.emit(ev, data, extra)
    } else {
      this[QUEUE].push([ev, data, extra])
    }
  }

  [EMITMETA] (entry) {
    this[EMIT]('meta', this[META])
    switch (entry.type) {
      case 'ExtendedHeader':
      case 'OldExtendedHeader':
        this[EX] = Pax.parse(this[META], this[EX], false)
        break

      case 'GlobalExtendedHeader':
        this[GEX] = Pax.parse(this[META], this[GEX], true)
        break

      case 'NextFileHasLongPath':
      case 'OldGnuLongPath':
        this[EX] = this[EX] || Object.create(null)
        this[EX].path = this[META].replace(/\0.*/, '')
        break

      case 'NextFileHasLongLinkpath':
        this[EX] = this[EX] || Object.create(null)
        this[EX].linkpath = this[META].replace(/\0.*/, '')
        break

      /* istanbul ignore next */
      default: throw new Error('unknown meta: ' + entry.type)
    }
  }

  abort (error) {
    this[ABORTED] = true
    this.emit('abort', error)
    // always throws, even in non-strict mode
    this.warn('TAR_ABORT', error, { recoverable: false })
  }

  write (chunk) {
    if (this[ABORTED]) {
      return
    }

    // first write, might be gzipped
    if (this[UNZIP] === null && chunk) {
      if (this[BUFFER]) {
        chunk = Buffer.concat([this[BUFFER], chunk])
        this[BUFFER] = null
      }
      if (chunk.length < gzipHeader.length) {
        this[BUFFER] = chunk
        return true
      }
      for (let i = 0; this[UNZIP] === null && i < gzipHeader.length; i++) {
        if (chunk[i] !== gzipHeader[i]) {
          this[UNZIP] = false
        }
      }
      if (this[UNZIP] === null) {
        const ended = this[ENDED]
        this[ENDED] = false
        this[UNZIP] = new zlib.Unzip()
        this[UNZIP].on('data', chunk => this[CONSUMECHUNK](chunk))
        this[UNZIP].on('error', er => this.abort(er))
        this[UNZIP].on('end', _ => {
          this[ENDED] = true
          this[CONSUMECHUNK]()
        })
        this[WRITING] = true
        const ret = this[UNZIP][ended ? 'end' : 'write'](chunk)
        this[WRITING] = false
        return ret
      }
    }

    this[WRITING] = true
    if (this[UNZIP]) {
      this[UNZIP].write(chunk)
    } else {
      this[CONSUMECHUNK](chunk)
    }
    this[WRITING] = false

    // return false if there's a queue, or if the current entry isn't flowing
    const ret =
      this[QUEUE].length ? false :
      this[READENTRY] ? this[READENTRY].flowing :
      true

    // if we have no queue, then that means a clogged READENTRY
    if (!ret && !this[QUEUE].length) {
      this[READENTRY].once('drain', _ => this.emit('drain'))
    }

    return ret
  }

  [BUFFERCONCAT] (c) {
    if (c && !this[ABORTED]) {
      this[BUFFER] = this[BUFFER] ? Buffer.concat([this[BUFFER], c]) : c
    }
  }

  [MAYBEEND] () {
    if (this[ENDED] &&
        !this[EMITTEDEND] &&
        !this[ABORTED] &&
        !this[CONSUMING]) {
      this[EMITTEDEND] = true
      const entry = this[WRITEENTRY]
      if (entry && entry.blockRemain) {
        // truncated, likely a damaged file
        const have = this[BUFFER] ? this[BUFFER].length : 0
        this.warn('TAR_BAD_ARCHIVE', `Truncated input (needed ${
          entry.blockRemain} more bytes, only ${have} available)`, { entry })
        if (this[BUFFER]) {
          entry.write(this[BUFFER])
        }
        entry.end()
      }
      this[EMIT](DONE)
    }
  }

  [CONSUMECHUNK] (chunk) {
    if (this[CONSUMING]) {
      this[BUFFERCONCAT](chunk)
    } else if (!chunk && !this[BUFFER]) {
      this[MAYBEEND]()
    } else {
      this[CONSUMING] = true
      if (this[BUFFER]) {
        this[BUFFERCONCAT](chunk)
        const c = this[BUFFER]
        this[BUFFER] = null
        this[CONSUMECHUNKSUB](c)
      } else {
        this[CONSUMECHUNKSUB](chunk)
      }

      while (this[BUFFER] &&
          this[BUFFER].length >= 512 &&
          !this[ABORTED] &&
          !this[SAW_EOF]) {
        const c = this[BUFFER]
        this[BUFFER] = null
        this[CONSUMECHUNKSUB](c)
      }
      this[CONSUMING] = false
    }

    if (!this[BUFFER] || this[ENDED]) {
      this[MAYBEEND]()
    }
  }

  [CONSUMECHUNKSUB] (chunk) {
    // we know that we are in CONSUMING mode, so anything written goes into
    // the buffer.  Advance the position and put any remainder in the buffer.
    let position = 0
    const length = chunk.length
    while (position + 512 <= length && !this[ABORTED] && !this[SAW_EOF]) {
      switch (this[STATE]) {
        case 'begin':
        case 'header':
          this[CONSUMEHEADER](chunk, position)
          position += 512
          break

        case 'ignore':
        case 'body':
          position += this[CONSUMEBODY](chunk, position)
          break

        case 'meta':
          position += this[CONSUMEMETA](chunk, position)
          break

        /* istanbul ignore next */
        default:
          throw new Error('invalid state: ' + this[STATE])
      }
    }

    if (position < length) {
      if (this[BUFFER]) {
        this[BUFFER] = Buffer.concat([chunk.slice(position), this[BUFFER]])
      } else {
        this[BUFFER] = chunk.slice(position)
      }
    }
  }

  end (chunk) {
    if (!this[ABORTED]) {
      if (this[UNZIP]) {
        this[UNZIP].end(chunk)
      } else {
        this[ENDED] = true
        this.write(chunk)
      }
    }
  }
})


/***/ }),
/* 147 */
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),
/* 148 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// tar -r
const hlo = __webpack_require__(120)
const Pack = __webpack_require__(121)
const fs = __webpack_require__(57)
const fsm = __webpack_require__(143)
const t = __webpack_require__(145)
const path = __webpack_require__(58)

// starting at the head of the file, read a Header
// If the checksum is invalid, that's our position to start writing
// If it is, jump forward by the specified size (round up to 512)
// and try again.
// Write the new Pack stream starting there.

const Header = __webpack_require__(134)

module.exports = (opt_, files, cb) => {
  const opt = hlo(opt_)

  if (!opt.file) {
    throw new TypeError('file is required')
  }

  if (opt.gzip) {
    throw new TypeError('cannot append to compressed archives')
  }

  if (!files || !Array.isArray(files) || !files.length) {
    throw new TypeError('no files or directories specified')
  }

  files = Array.from(files)

  return opt.sync ? replaceSync(opt, files)
    : replace(opt, files, cb)
}

const replaceSync = (opt, files) => {
  const p = new Pack.Sync(opt)

  let threw = true
  let fd
  let position

  try {
    try {
      fd = fs.openSync(opt.file, 'r+')
    } catch (er) {
      if (er.code === 'ENOENT') {
        fd = fs.openSync(opt.file, 'w+')
      } else {
        throw er
      }
    }

    const st = fs.fstatSync(fd)
    const headBuf = Buffer.alloc(512)

    POSITION: for (position = 0; position < st.size; position += 512) {
      for (let bufPos = 0, bytes = 0; bufPos < 512; bufPos += bytes) {
        bytes = fs.readSync(
          fd, headBuf, bufPos, headBuf.length - bufPos, position + bufPos
        )

        if (position === 0 && headBuf[0] === 0x1f && headBuf[1] === 0x8b) {
          throw new Error('cannot append to compressed archives')
        }

        if (!bytes) {
          break POSITION
        }
      }

      const h = new Header(headBuf)
      if (!h.cksumValid) {
        break
      }
      const entryBlockSize = 512 * Math.ceil(h.size / 512)
      if (position + entryBlockSize + 512 > st.size) {
        break
      }
      // the 512 for the header we just parsed will be added as well
      // also jump ahead all the blocks for the body
      position += entryBlockSize
      if (opt.mtimeCache) {
        opt.mtimeCache.set(h.path, h.mtime)
      }
    }
    threw = false

    streamSync(opt, p, position, fd, files)
  } finally {
    if (threw) {
      try {
        fs.closeSync(fd)
      } catch (er) {}
    }
  }
}

const streamSync = (opt, p, position, fd, files) => {
  const stream = new fsm.WriteStreamSync(opt.file, {
    fd: fd,
    start: position,
  })
  p.pipe(stream)
  addFilesSync(p, files)
}

const replace = (opt, files, cb) => {
  files = Array.from(files)
  const p = new Pack(opt)

  const getPos = (fd, size, cb_) => {
    const cb = (er, pos) => {
      if (er) {
        fs.close(fd, _ => cb_(er))
      } else {
        cb_(null, pos)
      }
    }

    let position = 0
    if (size === 0) {
      return cb(null, 0)
    }

    let bufPos = 0
    const headBuf = Buffer.alloc(512)
    const onread = (er, bytes) => {
      if (er) {
        return cb(er)
      }
      bufPos += bytes
      if (bufPos < 512 && bytes) {
        return fs.read(
          fd, headBuf, bufPos, headBuf.length - bufPos,
          position + bufPos, onread
        )
      }

      if (position === 0 && headBuf[0] === 0x1f && headBuf[1] === 0x8b) {
        return cb(new Error('cannot append to compressed archives'))
      }

      // truncated header
      if (bufPos < 512) {
        return cb(null, position)
      }

      const h = new Header(headBuf)
      if (!h.cksumValid) {
        return cb(null, position)
      }

      const entryBlockSize = 512 * Math.ceil(h.size / 512)
      if (position + entryBlockSize + 512 > size) {
        return cb(null, position)
      }

      position += entryBlockSize + 512
      if (position >= size) {
        return cb(null, position)
      }

      if (opt.mtimeCache) {
        opt.mtimeCache.set(h.path, h.mtime)
      }
      bufPos = 0
      fs.read(fd, headBuf, 0, 512, position, onread)
    }
    fs.read(fd, headBuf, 0, 512, position, onread)
  }

  const promise = new Promise((resolve, reject) => {
    p.on('error', reject)
    let flag = 'r+'
    const onopen = (er, fd) => {
      if (er && er.code === 'ENOENT' && flag === 'r+') {
        flag = 'w+'
        return fs.open(opt.file, flag, onopen)
      }

      if (er) {
        return reject(er)
      }

      fs.fstat(fd, (er, st) => {
        if (er) {
          return fs.close(fd, () => reject(er))
        }

        getPos(fd, st.size, (er, position) => {
          if (er) {
            return reject(er)
          }
          const stream = new fsm.WriteStream(opt.file, {
            fd: fd,
            start: position,
          })
          p.pipe(stream)
          stream.on('error', reject)
          stream.on('close', resolve)
          addFilesAsync(p, files)
        })
      })
    }
    fs.open(opt.file, flag, onopen)
  })

  return cb ? promise.then(cb, cb) : promise
}

const addFilesSync = (p, files) => {
  files.forEach(file => {
    if (file.charAt(0) === '@') {
      t({
        file: path.resolve(p.cwd, file.slice(1)),
        sync: true,
        noResume: true,
        onentry: entry => p.add(entry),
      })
    } else {
      p.add(file)
    }
  })
  p.end()
}

const addFilesAsync = (p, files) => {
  while (files.length) {
    const file = files.shift()
    if (file.charAt(0) === '@') {
      return t({
        file: path.resolve(p.cwd, file.slice(1)),
        noResume: true,
        onentry: entry => p.add(entry),
      }).then(_ => addFilesAsync(p, files))
    } else {
      p.add(file)
    }
  }
  p.end()
}


/***/ }),
/* 149 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// tar -u

const hlo = __webpack_require__(120)
const r = __webpack_require__(148)
// just call tar.r with the filter and mtimeCache

module.exports = (opt_, files, cb) => {
  const opt = hlo(opt_)

  if (!opt.file) {
    throw new TypeError('file is required')
  }

  if (opt.gzip) {
    throw new TypeError('cannot append to compressed archives')
  }

  if (!files || !Array.isArray(files) || !files.length) {
    throw new TypeError('no files or directories specified')
  }

  files = Array.from(files)

  mtimeFilter(opt)
  return r(opt, files, cb)
}

const mtimeFilter = opt => {
  const filter = opt.filter

  if (!opt.mtimeCache) {
    opt.mtimeCache = new Map()
  }

  opt.filter = filter ? (path, stat) =>
    filter(path, stat) && !(opt.mtimeCache.get(path) > stat.mtime)
    : (path, stat) => !(opt.mtimeCache.get(path) > stat.mtime)
}


/***/ }),
/* 150 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// tar -x
const hlo = __webpack_require__(120)
const Unpack = __webpack_require__(151)
const fs = __webpack_require__(57)
const fsm = __webpack_require__(143)
const path = __webpack_require__(58)
const stripSlash = __webpack_require__(137)

module.exports = (opt_, files, cb) => {
  if (typeof opt_ === 'function') {
    cb = opt_, files = null, opt_ = {}
  } else if (Array.isArray(opt_)) {
    files = opt_, opt_ = {}
  }

  if (typeof files === 'function') {
    cb = files, files = null
  }

  if (!files) {
    files = []
  } else {
    files = Array.from(files)
  }

  const opt = hlo(opt_)

  if (opt.sync && typeof cb === 'function') {
    throw new TypeError('callback not supported for sync tar functions')
  }

  if (!opt.file && typeof cb === 'function') {
    throw new TypeError('callback only supported with file option')
  }

  if (files.length) {
    filesFilter(opt, files)
  }

  return opt.file && opt.sync ? extractFileSync(opt)
    : opt.file ? extractFile(opt, cb)
    : opt.sync ? extractSync(opt)
    : extract(opt)
}

// construct a filter that limits the file entries listed
// include child entries if a dir is included
const filesFilter = (opt, files) => {
  const map = new Map(files.map(f => [stripSlash(f), true]))
  const filter = opt.filter

  const mapHas = (file, r) => {
    const root = r || path.parse(file).root || '.'
    const ret = file === root ? false
      : map.has(file) ? map.get(file)
      : mapHas(path.dirname(file), root)

    map.set(file, ret)
    return ret
  }

  opt.filter = filter
    ? (file, entry) => filter(file, entry) && mapHas(stripSlash(file))
    : file => mapHas(stripSlash(file))
}

const extractFileSync = opt => {
  const u = new Unpack.Sync(opt)

  const file = opt.file
  const stat = fs.statSync(file)
  // This trades a zero-byte read() syscall for a stat
  // However, it will usually result in less memory allocation
  const readSize = opt.maxReadSize || 16 * 1024 * 1024
  const stream = new fsm.ReadStreamSync(file, {
    readSize: readSize,
    size: stat.size,
  })
  stream.pipe(u)
}

const extractFile = (opt, cb) => {
  const u = new Unpack(opt)
  const readSize = opt.maxReadSize || 16 * 1024 * 1024

  const file = opt.file
  const p = new Promise((resolve, reject) => {
    u.on('error', reject)
    u.on('close', resolve)

    // This trades a zero-byte read() syscall for a stat
    // However, it will usually result in less memory allocation
    fs.stat(file, (er, stat) => {
      if (er) {
        reject(er)
      } else {
        const stream = new fsm.ReadStream(file, {
          readSize: readSize,
          size: stat.size,
        })
        stream.on('error', reject)
        stream.pipe(u)
      }
    })
  })
  return cb ? p.then(cb, cb) : p
}

const extractSync = opt => new Unpack.Sync(opt)

const extract = opt => new Unpack(opt)


/***/ }),
/* 151 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// the PEND/UNPEND stuff tracks whether we're ready to emit end/close yet.
// but the path reservations are required to avoid race conditions where
// parallelized unpack ops may mess with one another, due to dependencies
// (like a Link depending on its target) or destructive operations (like
// clobbering an fs object to create one of a different type.)

const assert = __webpack_require__(125)
const Parser = __webpack_require__(146)
const fs = __webpack_require__(57)
const fsm = __webpack_require__(143)
const path = __webpack_require__(58)
const mkdir = __webpack_require__(152)
const wc = __webpack_require__(139)
const pathReservations = __webpack_require__(155)
const stripAbsolutePath = __webpack_require__(140)
const normPath = __webpack_require__(131)
const stripSlash = __webpack_require__(137)
const normalize = __webpack_require__(156)

const ONENTRY = Symbol('onEntry')
const CHECKFS = Symbol('checkFs')
const CHECKFS2 = Symbol('checkFs2')
const PRUNECACHE = Symbol('pruneCache')
const ISREUSABLE = Symbol('isReusable')
const MAKEFS = Symbol('makeFs')
const FILE = Symbol('file')
const DIRECTORY = Symbol('directory')
const LINK = Symbol('link')
const SYMLINK = Symbol('symlink')
const HARDLINK = Symbol('hardlink')
const UNSUPPORTED = Symbol('unsupported')
const CHECKPATH = Symbol('checkPath')
const MKDIR = Symbol('mkdir')
const ONERROR = Symbol('onError')
const PENDING = Symbol('pending')
const PEND = Symbol('pend')
const UNPEND = Symbol('unpend')
const ENDED = Symbol('ended')
const MAYBECLOSE = Symbol('maybeClose')
const SKIP = Symbol('skip')
const DOCHOWN = Symbol('doChown')
const UID = Symbol('uid')
const GID = Symbol('gid')
const CHECKED_CWD = Symbol('checkedCwd')
const crypto = __webpack_require__(157)
const getFlag = __webpack_require__(158)
const platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform
const isWindows = platform === 'win32'

// Unlinks on Windows are not atomic.
//
// This means that if you have a file entry, followed by another
// file entry with an identical name, and you cannot re-use the file
// (because it's a hardlink, or because unlink:true is set, or it's
// Windows, which does not have useful nlink values), then the unlink
// will be committed to the disk AFTER the new file has been written
// over the old one, deleting the new file.
//
// To work around this, on Windows systems, we rename the file and then
// delete the renamed file.  It's a sloppy kludge, but frankly, I do not
// know of a better way to do this, given windows' non-atomic unlink
// semantics.
//
// See: https://github.com/npm/node-tar/issues/183
/* istanbul ignore next */
const unlinkFile = (path, cb) => {
  if (!isWindows) {
    return fs.unlink(path, cb)
  }

  const name = path + '.DELETE.' + crypto.randomBytes(16).toString('hex')
  fs.rename(path, name, er => {
    if (er) {
      return cb(er)
    }
    fs.unlink(name, cb)
  })
}

/* istanbul ignore next */
const unlinkFileSync = path => {
  if (!isWindows) {
    return fs.unlinkSync(path)
  }

  const name = path + '.DELETE.' + crypto.randomBytes(16).toString('hex')
  fs.renameSync(path, name)
  fs.unlinkSync(name)
}

// this.gid, entry.gid, this.processUid
const uint32 = (a, b, c) =>
  a === a >>> 0 ? a
  : b === b >>> 0 ? b
  : c

// clear the cache if it's a case-insensitive unicode-squashing match.
// we can't know if the current file system is case-sensitive or supports
// unicode fully, so we check for similarity on the maximally compatible
// representation.  Err on the side of pruning, since all it's doing is
// preventing lstats, and it's not the end of the world if we get a false
// positive.
// Note that on windows, we always drop the entire cache whenever a
// symbolic link is encountered, because 8.3 filenames are impossible
// to reason about, and collisions are hazards rather than just failures.
const cacheKeyNormalize = path => normalize(stripSlash(normPath(path)))
  .toLowerCase()

const pruneCache = (cache, abs) => {
  abs = cacheKeyNormalize(abs)
  for (const path of cache.keys()) {
    const pnorm = cacheKeyNormalize(path)
    if (pnorm === abs || pnorm.indexOf(abs + '/') === 0) {
      cache.delete(path)
    }
  }
}

const dropCache = cache => {
  for (const key of cache.keys()) {
    cache.delete(key)
  }
}

class Unpack extends Parser {
  constructor (opt) {
    if (!opt) {
      opt = {}
    }

    opt.ondone = _ => {
      this[ENDED] = true
      this[MAYBECLOSE]()
    }

    super(opt)

    this[CHECKED_CWD] = false

    this.reservations = pathReservations()

    this.transform = typeof opt.transform === 'function' ? opt.transform : null

    this.writable = true
    this.readable = false

    this[PENDING] = 0
    this[ENDED] = false

    this.dirCache = opt.dirCache || new Map()

    if (typeof opt.uid === 'number' || typeof opt.gid === 'number') {
      // need both or neither
      if (typeof opt.uid !== 'number' || typeof opt.gid !== 'number') {
        throw new TypeError('cannot set owner without number uid and gid')
      }
      if (opt.preserveOwner) {
        throw new TypeError(
          'cannot preserve owner in archive and also set owner explicitly')
      }
      this.uid = opt.uid
      this.gid = opt.gid
      this.setOwner = true
    } else {
      this.uid = null
      this.gid = null
      this.setOwner = false
    }

    // default true for root
    if (opt.preserveOwner === undefined && typeof opt.uid !== 'number') {
      this.preserveOwner = process.getuid && process.getuid() === 0
    } else {
      this.preserveOwner = !!opt.preserveOwner
    }

    this.processUid = (this.preserveOwner || this.setOwner) && process.getuid ?
      process.getuid() : null
    this.processGid = (this.preserveOwner || this.setOwner) && process.getgid ?
      process.getgid() : null

    // mostly just for testing, but useful in some cases.
    // Forcibly trigger a chown on every entry, no matter what
    this.forceChown = opt.forceChown === true

    // turn ><?| in filenames into 0xf000-higher encoded forms
    this.win32 = !!opt.win32 || isWindows

    // do not unpack over files that are newer than what's in the archive
    this.newer = !!opt.newer

    // do not unpack over ANY files
    this.keep = !!opt.keep

    // do not set mtime/atime of extracted entries
    this.noMtime = !!opt.noMtime

    // allow .., absolute path entries, and unpacking through symlinks
    // without this, warn and skip .., relativize absolutes, and error
    // on symlinks in extraction path
    this.preservePaths = !!opt.preservePaths

    // unlink files and links before writing. This breaks existing hard
    // links, and removes symlink directories rather than erroring
    this.unlink = !!opt.unlink

    this.cwd = normPath(path.resolve(opt.cwd || process.cwd()))
    this.strip = +opt.strip || 0
    // if we're not chmodding, then we don't need the process umask
    this.processUmask = opt.noChmod ? 0 : process.umask()
    this.umask = typeof opt.umask === 'number' ? opt.umask : this.processUmask

    // default mode for dirs created as parents
    this.dmode = opt.dmode || (0o0777 & (~this.umask))
    this.fmode = opt.fmode || (0o0666 & (~this.umask))

    this.on('entry', entry => this[ONENTRY](entry))
  }

  // a bad or damaged archive is a warning for Parser, but an error
  // when extracting.  Mark those errors as unrecoverable, because
  // the Unpack contract cannot be met.
  warn (code, msg, data = {}) {
    if (code === 'TAR_BAD_ARCHIVE' || code === 'TAR_ABORT') {
      data.recoverable = false
    }
    return super.warn(code, msg, data)
  }

  [MAYBECLOSE] () {
    if (this[ENDED] && this[PENDING] === 0) {
      this.emit('prefinish')
      this.emit('finish')
      this.emit('end')
    }
  }

  [CHECKPATH] (entry) {
    if (this.strip) {
      const parts = normPath(entry.path).split('/')
      if (parts.length < this.strip) {
        return false
      }
      entry.path = parts.slice(this.strip).join('/')

      if (entry.type === 'Link') {
        const linkparts = normPath(entry.linkpath).split('/')
        if (linkparts.length >= this.strip) {
          entry.linkpath = linkparts.slice(this.strip).join('/')
        } else {
          return false
        }
      }
    }

    if (!this.preservePaths) {
      const p = normPath(entry.path)
      const parts = p.split('/')
      if (parts.includes('..') || isWindows && /^[a-z]:\.\.$/i.test(parts[0])) {
        this.warn('TAR_ENTRY_ERROR', `path contains '..'`, {
          entry,
          path: p,
        })
        return false
      }

      // strip off the root
      const [root, stripped] = stripAbsolutePath(p)
      if (root) {
        entry.path = stripped
        this.warn('TAR_ENTRY_INFO', `stripping ${root} from absolute path`, {
          entry,
          path: p,
        })
      }
    }

    if (path.isAbsolute(entry.path)) {
      entry.absolute = normPath(path.resolve(entry.path))
    } else {
      entry.absolute = normPath(path.resolve(this.cwd, entry.path))
    }

    // if we somehow ended up with a path that escapes the cwd, and we are
    // not in preservePaths mode, then something is fishy!  This should have
    // been prevented above, so ignore this for coverage.
    /* istanbul ignore if - defense in depth */
    if (!this.preservePaths &&
        entry.absolute.indexOf(this.cwd + '/') !== 0 &&
        entry.absolute !== this.cwd) {
      this.warn('TAR_ENTRY_ERROR', 'path escaped extraction target', {
        entry,
        path: normPath(entry.path),
        resolvedPath: entry.absolute,
        cwd: this.cwd,
      })
      return false
    }

    // an archive can set properties on the extraction directory, but it
    // may not replace the cwd with a different kind of thing entirely.
    if (entry.absolute === this.cwd &&
        entry.type !== 'Directory' &&
        entry.type !== 'GNUDumpDir') {
      return false
    }

    // only encode : chars that aren't drive letter indicators
    if (this.win32) {
      const { root: aRoot } = path.win32.parse(entry.absolute)
      entry.absolute = aRoot + wc.encode(entry.absolute.slice(aRoot.length))
      const { root: pRoot } = path.win32.parse(entry.path)
      entry.path = pRoot + wc.encode(entry.path.slice(pRoot.length))
    }

    return true
  }

  [ONENTRY] (entry) {
    if (!this[CHECKPATH](entry)) {
      return entry.resume()
    }

    assert.equal(typeof entry.absolute, 'string')

    switch (entry.type) {
      case 'Directory':
      case 'GNUDumpDir':
        if (entry.mode) {
          entry.mode = entry.mode | 0o700
        }

      // eslint-disable-next-line no-fallthrough
      case 'File':
      case 'OldFile':
      case 'ContiguousFile':
      case 'Link':
      case 'SymbolicLink':
        return this[CHECKFS](entry)

      case 'CharacterDevice':
      case 'BlockDevice':
      case 'FIFO':
      default:
        return this[UNSUPPORTED](entry)
    }
  }

  [ONERROR] (er, entry) {
    // Cwd has to exist, or else nothing works. That's serious.
    // Other errors are warnings, which raise the error in strict
    // mode, but otherwise continue on.
    if (er.name === 'CwdError') {
      this.emit('error', er)
    } else {
      this.warn('TAR_ENTRY_ERROR', er, { entry })
      this[UNPEND]()
      entry.resume()
    }
  }

  [MKDIR] (dir, mode, cb) {
    mkdir(normPath(dir), {
      uid: this.uid,
      gid: this.gid,
      processUid: this.processUid,
      processGid: this.processGid,
      umask: this.processUmask,
      preserve: this.preservePaths,
      unlink: this.unlink,
      cache: this.dirCache,
      cwd: this.cwd,
      mode: mode,
      noChmod: this.noChmod,
    }, cb)
  }

  [DOCHOWN] (entry) {
    // in preserve owner mode, chown if the entry doesn't match process
    // in set owner mode, chown if setting doesn't match process
    return this.forceChown ||
      this.preserveOwner &&
      (typeof entry.uid === 'number' && entry.uid !== this.processUid ||
        typeof entry.gid === 'number' && entry.gid !== this.processGid)
      ||
      (typeof this.uid === 'number' && this.uid !== this.processUid ||
        typeof this.gid === 'number' && this.gid !== this.processGid)
  }

  [UID] (entry) {
    return uint32(this.uid, entry.uid, this.processUid)
  }

  [GID] (entry) {
    return uint32(this.gid, entry.gid, this.processGid)
  }

  [FILE] (entry, fullyDone) {
    const mode = entry.mode & 0o7777 || this.fmode
    const stream = new fsm.WriteStream(entry.absolute, {
      flags: getFlag(entry.size),
      mode: mode,
      autoClose: false,
    })
    stream.on('error', er => {
      if (stream.fd) {
        fs.close(stream.fd, () => {})
      }

      // flush all the data out so that we aren't left hanging
      // if the error wasn't actually fatal.  otherwise the parse
      // is blocked, and we never proceed.
      stream.write = () => true
      this[ONERROR](er, entry)
      fullyDone()
    })

    let actions = 1
    const done = er => {
      if (er) {
        /* istanbul ignore else - we should always have a fd by now */
        if (stream.fd) {
          fs.close(stream.fd, () => {})
        }

        this[ONERROR](er, entry)
        fullyDone()
        return
      }

      if (--actions === 0) {
        fs.close(stream.fd, er => {
          if (er) {
            this[ONERROR](er, entry)
          } else {
            this[UNPEND]()
          }
          fullyDone()
        })
      }
    }

    stream.on('finish', _ => {
      // if futimes fails, try utimes
      // if utimes fails, fail with the original error
      // same for fchown/chown
      const abs = entry.absolute
      const fd = stream.fd

      if (entry.mtime && !this.noMtime) {
        actions++
        const atime = entry.atime || new Date()
        const mtime = entry.mtime
        fs.futimes(fd, atime, mtime, er =>
          er ? fs.utimes(abs, atime, mtime, er2 => done(er2 && er))
          : done())
      }

      if (this[DOCHOWN](entry)) {
        actions++
        const uid = this[UID](entry)
        const gid = this[GID](entry)
        fs.fchown(fd, uid, gid, er =>
          er ? fs.chown(abs, uid, gid, er2 => done(er2 && er))
          : done())
      }

      done()
    })

    const tx = this.transform ? this.transform(entry) || entry : entry
    if (tx !== entry) {
      tx.on('error', er => {
        this[ONERROR](er, entry)
        fullyDone()
      })
      entry.pipe(tx)
    }
    tx.pipe(stream)
  }

  [DIRECTORY] (entry, fullyDone) {
    const mode = entry.mode & 0o7777 || this.dmode
    this[MKDIR](entry.absolute, mode, er => {
      if (er) {
        this[ONERROR](er, entry)
        fullyDone()
        return
      }

      let actions = 1
      const done = _ => {
        if (--actions === 0) {
          fullyDone()
          this[UNPEND]()
          entry.resume()
        }
      }

      if (entry.mtime && !this.noMtime) {
        actions++
        fs.utimes(entry.absolute, entry.atime || new Date(), entry.mtime, done)
      }

      if (this[DOCHOWN](entry)) {
        actions++
        fs.chown(entry.absolute, this[UID](entry), this[GID](entry), done)
      }

      done()
    })
  }

  [UNSUPPORTED] (entry) {
    entry.unsupported = true
    this.warn('TAR_ENTRY_UNSUPPORTED',
      `unsupported entry type: ${entry.type}`, { entry })
    entry.resume()
  }

  [SYMLINK] (entry, done) {
    this[LINK](entry, entry.linkpath, 'symlink', done)
  }

  [HARDLINK] (entry, done) {
    const linkpath = normPath(path.resolve(this.cwd, entry.linkpath))
    this[LINK](entry, linkpath, 'link', done)
  }

  [PEND] () {
    this[PENDING]++
  }

  [UNPEND] () {
    this[PENDING]--
    this[MAYBECLOSE]()
  }

  [SKIP] (entry) {
    this[UNPEND]()
    entry.resume()
  }

  // Check if we can reuse an existing filesystem entry safely and
  // overwrite it, rather than unlinking and recreating
  // Windows doesn't report a useful nlink, so we just never reuse entries
  [ISREUSABLE] (entry, st) {
    return entry.type === 'File' &&
      !this.unlink &&
      st.isFile() &&
      st.nlink <= 1 &&
      !isWindows
  }

  // check if a thing is there, and if so, try to clobber it
  [CHECKFS] (entry) {
    this[PEND]()
    const paths = [entry.path]
    if (entry.linkpath) {
      paths.push(entry.linkpath)
    }
    this.reservations.reserve(paths, done => this[CHECKFS2](entry, done))
  }

  [PRUNECACHE] (entry) {
    // if we are not creating a directory, and the path is in the dirCache,
    // then that means we are about to delete the directory we created
    // previously, and it is no longer going to be a directory, and neither
    // is any of its children.
    // If a symbolic link is encountered, all bets are off.  There is no
    // reasonable way to sanitize the cache in such a way we will be able to
    // avoid having filesystem collisions.  If this happens with a non-symlink
    // entry, it'll just fail to unpack, but a symlink to a directory, using an
    // 8.3 shortname or certain unicode attacks, can evade detection and lead
    // to arbitrary writes to anywhere on the system.
    if (entry.type === 'SymbolicLink') {
      dropCache(this.dirCache)
    } else if (entry.type !== 'Directory') {
      pruneCache(this.dirCache, entry.absolute)
    }
  }

  [CHECKFS2] (entry, fullyDone) {
    this[PRUNECACHE](entry)

    const done = er => {
      this[PRUNECACHE](entry)
      fullyDone(er)
    }

    const checkCwd = () => {
      this[MKDIR](this.cwd, this.dmode, er => {
        if (er) {
          this[ONERROR](er, entry)
          done()
          return
        }
        this[CHECKED_CWD] = true
        start()
      })
    }

    const start = () => {
      if (entry.absolute !== this.cwd) {
        const parent = normPath(path.dirname(entry.absolute))
        if (parent !== this.cwd) {
          return this[MKDIR](parent, this.dmode, er => {
            if (er) {
              this[ONERROR](er, entry)
              done()
              return
            }
            afterMakeParent()
          })
        }
      }
      afterMakeParent()
    }

    const afterMakeParent = () => {
      fs.lstat(entry.absolute, (lstatEr, st) => {
        if (st && (this.keep || this.newer && st.mtime > entry.mtime)) {
          this[SKIP](entry)
          done()
          return
        }
        if (lstatEr || this[ISREUSABLE](entry, st)) {
          return this[MAKEFS](null, entry, done)
        }

        if (st.isDirectory()) {
          if (entry.type === 'Directory') {
            const needChmod = !this.noChmod &&
              entry.mode &&
              (st.mode & 0o7777) !== entry.mode
            const afterChmod = er => this[MAKEFS](er, entry, done)
            if (!needChmod) {
              return afterChmod()
            }
            return fs.chmod(entry.absolute, entry.mode, afterChmod)
          }
          // Not a dir entry, have to remove it.
          // NB: the only way to end up with an entry that is the cwd
          // itself, in such a way that == does not detect, is a
          // tricky windows absolute path with UNC or 8.3 parts (and
          // preservePaths:true, or else it will have been stripped).
          // In that case, the user has opted out of path protections
          // explicitly, so if they blow away the cwd, c'est la vie.
          if (entry.absolute !== this.cwd) {
            return fs.rmdir(entry.absolute, er =>
              this[MAKEFS](er, entry, done))
          }
        }

        // not a dir, and not reusable
        // don't remove if the cwd, we want that error
        if (entry.absolute === this.cwd) {
          return this[MAKEFS](null, entry, done)
        }

        unlinkFile(entry.absolute, er =>
          this[MAKEFS](er, entry, done))
      })
    }

    if (this[CHECKED_CWD]) {
      start()
    } else {
      checkCwd()
    }
  }

  [MAKEFS] (er, entry, done) {
    if (er) {
      this[ONERROR](er, entry)
      done()
      return
    }

    switch (entry.type) {
      case 'File':
      case 'OldFile':
      case 'ContiguousFile':
        return this[FILE](entry, done)

      case 'Link':
        return this[HARDLINK](entry, done)

      case 'SymbolicLink':
        return this[SYMLINK](entry, done)

      case 'Directory':
      case 'GNUDumpDir':
        return this[DIRECTORY](entry, done)
    }
  }

  [LINK] (entry, linkpath, link, done) {
    // XXX: get the type ('symlink' or 'junction') for windows
    fs[link](linkpath, entry.absolute, er => {
      if (er) {
        this[ONERROR](er, entry)
      } else {
        this[UNPEND]()
        entry.resume()
      }
      done()
    })
  }
}

const callSync = fn => {
  try {
    return [null, fn()]
  } catch (er) {
    return [er, null]
  }
}
class UnpackSync extends Unpack {
  [MAKEFS] (er, entry) {
    return super[MAKEFS](er, entry, () => {})
  }

  [CHECKFS] (entry) {
    this[PRUNECACHE](entry)

    if (!this[CHECKED_CWD]) {
      const er = this[MKDIR](this.cwd, this.dmode)
      if (er) {
        return this[ONERROR](er, entry)
      }
      this[CHECKED_CWD] = true
    }

    // don't bother to make the parent if the current entry is the cwd,
    // we've already checked it.
    if (entry.absolute !== this.cwd) {
      const parent = normPath(path.dirname(entry.absolute))
      if (parent !== this.cwd) {
        const mkParent = this[MKDIR](parent, this.dmode)
        if (mkParent) {
          return this[ONERROR](mkParent, entry)
        }
      }
    }

    const [lstatEr, st] = callSync(() => fs.lstatSync(entry.absolute))
    if (st && (this.keep || this.newer && st.mtime > entry.mtime)) {
      return this[SKIP](entry)
    }

    if (lstatEr || this[ISREUSABLE](entry, st)) {
      return this[MAKEFS](null, entry)
    }

    if (st.isDirectory()) {
      if (entry.type === 'Directory') {
        const needChmod = !this.noChmod &&
          entry.mode &&
          (st.mode & 0o7777) !== entry.mode
        const [er] = needChmod ? callSync(() => {
          fs.chmodSync(entry.absolute, entry.mode)
        }) : []
        return this[MAKEFS](er, entry)
      }
      // not a dir entry, have to remove it
      const [er] = callSync(() => fs.rmdirSync(entry.absolute))
      this[MAKEFS](er, entry)
    }

    // not a dir, and not reusable.
    // don't remove if it's the cwd, since we want that error.
    const [er] = entry.absolute === this.cwd ? []
      : callSync(() => unlinkFileSync(entry.absolute))
    this[MAKEFS](er, entry)
  }

  [FILE] (entry, done) {
    const mode = entry.mode & 0o7777 || this.fmode

    const oner = er => {
      let closeError
      try {
        fs.closeSync(fd)
      } catch (e) {
        closeError = e
      }
      if (er || closeError) {
        this[ONERROR](er || closeError, entry)
      }
      done()
    }

    let fd
    try {
      fd = fs.openSync(entry.absolute, getFlag(entry.size), mode)
    } catch (er) {
      return oner(er)
    }
    const tx = this.transform ? this.transform(entry) || entry : entry
    if (tx !== entry) {
      tx.on('error', er => this[ONERROR](er, entry))
      entry.pipe(tx)
    }

    tx.on('data', chunk => {
      try {
        fs.writeSync(fd, chunk, 0, chunk.length)
      } catch (er) {
        oner(er)
      }
    })

    tx.on('end', _ => {
      let er = null
      // try both, falling futimes back to utimes
      // if either fails, handle the first error
      if (entry.mtime && !this.noMtime) {
        const atime = entry.atime || new Date()
        const mtime = entry.mtime
        try {
          fs.futimesSync(fd, atime, mtime)
        } catch (futimeser) {
          try {
            fs.utimesSync(entry.absolute, atime, mtime)
          } catch (utimeser) {
            er = futimeser
          }
        }
      }

      if (this[DOCHOWN](entry)) {
        const uid = this[UID](entry)
        const gid = this[GID](entry)

        try {
          fs.fchownSync(fd, uid, gid)
        } catch (fchowner) {
          try {
            fs.chownSync(entry.absolute, uid, gid)
          } catch (chowner) {
            er = er || fchowner
          }
        }
      }

      oner(er)
    })
  }

  [DIRECTORY] (entry, done) {
    const mode = entry.mode & 0o7777 || this.dmode
    const er = this[MKDIR](entry.absolute, mode)
    if (er) {
      this[ONERROR](er, entry)
      done()
      return
    }
    if (entry.mtime && !this.noMtime) {
      try {
        fs.utimesSync(entry.absolute, entry.atime || new Date(), entry.mtime)
      } catch (er) {}
    }
    if (this[DOCHOWN](entry)) {
      try {
        fs.chownSync(entry.absolute, this[UID](entry), this[GID](entry))
      } catch (er) {}
    }
    done()
    entry.resume()
  }

  [MKDIR] (dir, mode) {
    try {
      return mkdir.sync(normPath(dir), {
        uid: this.uid,
        gid: this.gid,
        processUid: this.processUid,
        processGid: this.processGid,
        umask: this.processUmask,
        preserve: this.preservePaths,
        unlink: this.unlink,
        cache: this.dirCache,
        cwd: this.cwd,
        mode: mode,
      })
    } catch (er) {
      return er
    }
  }

  [LINK] (entry, linkpath, link, done) {
    try {
      fs[link + 'Sync'](linkpath, entry.absolute)
      done()
      entry.resume()
    } catch (er) {
      return this[ONERROR](er, entry)
    }
  }
}

Unpack.Sync = UnpackSync
module.exports = Unpack


/***/ }),
/* 152 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// wrapper around mkdirp for tar's needs.

// TODO: This should probably be a class, not functionally
// passing around state in a gazillion args.

const mkdirp = __webpack_require__(153)
const fs = __webpack_require__(57)
const path = __webpack_require__(58)
const chownr = __webpack_require__(154)
const normPath = __webpack_require__(131)

class SymlinkError extends Error {
  constructor (symlink, path) {
    super('Cannot extract through symbolic link')
    this.path = path
    this.symlink = symlink
  }

  get name () {
    return 'SylinkError'
  }
}

class CwdError extends Error {
  constructor (path, code) {
    super(code + ': Cannot cd into \'' + path + '\'')
    this.path = path
    this.code = code
  }

  get name () {
    return 'CwdError'
  }
}

const cGet = (cache, key) => cache.get(normPath(key))
const cSet = (cache, key, val) => cache.set(normPath(key), val)

const checkCwd = (dir, cb) => {
  fs.stat(dir, (er, st) => {
    if (er || !st.isDirectory()) {
      er = new CwdError(dir, er && er.code || 'ENOTDIR')
    }
    cb(er)
  })
}

module.exports = (dir, opt, cb) => {
  dir = normPath(dir)

  // if there's any overlap between mask and mode,
  // then we'll need an explicit chmod
  const umask = opt.umask
  const mode = opt.mode | 0o0700
  const needChmod = (mode & umask) !== 0

  const uid = opt.uid
  const gid = opt.gid
  const doChown = typeof uid === 'number' &&
    typeof gid === 'number' &&
    (uid !== opt.processUid || gid !== opt.processGid)

  const preserve = opt.preserve
  const unlink = opt.unlink
  const cache = opt.cache
  const cwd = normPath(opt.cwd)

  const done = (er, created) => {
    if (er) {
      cb(er)
    } else {
      cSet(cache, dir, true)
      if (created && doChown) {
        chownr(created, uid, gid, er => done(er))
      } else if (needChmod) {
        fs.chmod(dir, mode, cb)
      } else {
        cb()
      }
    }
  }

  if (cache && cGet(cache, dir) === true) {
    return done()
  }

  if (dir === cwd) {
    return checkCwd(dir, done)
  }

  if (preserve) {
    return mkdirp(dir, { mode }).then(made => done(null, made), done)
  }

  const sub = normPath(path.relative(cwd, dir))
  const parts = sub.split('/')
  mkdir_(cwd, parts, mode, cache, unlink, cwd, null, done)
}

const mkdir_ = (base, parts, mode, cache, unlink, cwd, created, cb) => {
  if (!parts.length) {
    return cb(null, created)
  }
  const p = parts.shift()
  const part = normPath(path.resolve(base + '/' + p))
  if (cGet(cache, part)) {
    return mkdir_(part, parts, mode, cache, unlink, cwd, created, cb)
  }
  fs.mkdir(part, mode, onmkdir(part, parts, mode, cache, unlink, cwd, created, cb))
}

const onmkdir = (part, parts, mode, cache, unlink, cwd, created, cb) => er => {
  if (er) {
    fs.lstat(part, (statEr, st) => {
      if (statEr) {
        statEr.path = statEr.path && normPath(statEr.path)
        cb(statEr)
      } else if (st.isDirectory()) {
        mkdir_(part, parts, mode, cache, unlink, cwd, created, cb)
      } else if (unlink) {
        fs.unlink(part, er => {
          if (er) {
            return cb(er)
          }
          fs.mkdir(part, mode, onmkdir(part, parts, mode, cache, unlink, cwd, created, cb))
        })
      } else if (st.isSymbolicLink()) {
        return cb(new SymlinkError(part, part + '/' + parts.join('/')))
      } else {
        cb(er)
      }
    })
  } else {
    created = created || part
    mkdir_(part, parts, mode, cache, unlink, cwd, created, cb)
  }
}

const checkCwdSync = dir => {
  let ok = false
  let code = 'ENOTDIR'
  try {
    ok = fs.statSync(dir).isDirectory()
  } catch (er) {
    code = er.code
  } finally {
    if (!ok) {
      throw new CwdError(dir, code)
    }
  }
}

module.exports.sync = (dir, opt) => {
  dir = normPath(dir)
  // if there's any overlap between mask and mode,
  // then we'll need an explicit chmod
  const umask = opt.umask
  const mode = opt.mode | 0o0700
  const needChmod = (mode & umask) !== 0

  const uid = opt.uid
  const gid = opt.gid
  const doChown = typeof uid === 'number' &&
    typeof gid === 'number' &&
    (uid !== opt.processUid || gid !== opt.processGid)

  const preserve = opt.preserve
  const unlink = opt.unlink
  const cache = opt.cache
  const cwd = normPath(opt.cwd)

  const done = (created) => {
    cSet(cache, dir, true)
    if (created && doChown) {
      chownr.sync(created, uid, gid)
    }
    if (needChmod) {
      fs.chmodSync(dir, mode)
    }
  }

  if (cache && cGet(cache, dir) === true) {
    return done()
  }

  if (dir === cwd) {
    checkCwdSync(cwd)
    return done()
  }

  if (preserve) {
    return done(mkdirp.sync(dir, mode))
  }

  const sub = normPath(path.relative(cwd, dir))
  const parts = sub.split('/')
  let created = null
  for (let p = parts.shift(), part = cwd;
    p && (part += '/' + p);
    p = parts.shift()) {
    part = normPath(path.resolve(part))
    if (cGet(cache, part)) {
      continue
    }

    try {
      fs.mkdirSync(part, mode)
      created = created || part
      cSet(cache, part, true)
    } catch (er) {
      const st = fs.lstatSync(part)
      if (st.isDirectory()) {
        cSet(cache, part, true)
        continue
      } else if (unlink) {
        fs.unlinkSync(part)
        fs.mkdirSync(part, mode)
        created = created || part
        cSet(cache, part, true)
        continue
      } else if (st.isSymbolicLink()) {
        return new SymlinkError(part, part + '/' + parts.join('/'))
      }
    }
  }

  return done(created)
}


/***/ }),
/* 153 */
/***/ ((module) => {

"use strict";
module.exports = require("mkdirp");

/***/ }),
/* 154 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const fs = __webpack_require__(57)
const path = __webpack_require__(58)

/* istanbul ignore next */
const LCHOWN = fs.lchown ? 'lchown' : 'chown'
/* istanbul ignore next */
const LCHOWNSYNC = fs.lchownSync ? 'lchownSync' : 'chownSync'

/* istanbul ignore next */
const needEISDIRHandled = fs.lchown &&
  !process.version.match(/v1[1-9]+\./) &&
  !process.version.match(/v10\.[6-9]/)

const lchownSync = (path, uid, gid) => {
  try {
    return fs[LCHOWNSYNC](path, uid, gid)
  } catch (er) {
    if (er.code !== 'ENOENT')
      throw er
  }
}

/* istanbul ignore next */
const chownSync = (path, uid, gid) => {
  try {
    return fs.chownSync(path, uid, gid)
  } catch (er) {
    if (er.code !== 'ENOENT')
      throw er
  }
}

/* istanbul ignore next */
const handleEISDIR =
  needEISDIRHandled ? (path, uid, gid, cb) => er => {
    // Node prior to v10 had a very questionable implementation of
    // fs.lchown, which would always try to call fs.open on a directory
    // Fall back to fs.chown in those cases.
    if (!er || er.code !== 'EISDIR')
      cb(er)
    else
      fs.chown(path, uid, gid, cb)
  }
  : (_, __, ___, cb) => cb

/* istanbul ignore next */
const handleEISDirSync =
  needEISDIRHandled ? (path, uid, gid) => {
    try {
      return lchownSync(path, uid, gid)
    } catch (er) {
      if (er.code !== 'EISDIR')
        throw er
      chownSync(path, uid, gid)
    }
  }
  : (path, uid, gid) => lchownSync(path, uid, gid)

// fs.readdir could only accept an options object as of node v6
const nodeVersion = process.version
let readdir = (path, options, cb) => fs.readdir(path, options, cb)
let readdirSync = (path, options) => fs.readdirSync(path, options)
/* istanbul ignore next */
if (/^v4\./.test(nodeVersion))
  readdir = (path, options, cb) => fs.readdir(path, cb)

const chown = (cpath, uid, gid, cb) => {
  fs[LCHOWN](cpath, uid, gid, handleEISDIR(cpath, uid, gid, er => {
    // Skip ENOENT error
    cb(er && er.code !== 'ENOENT' ? er : null)
  }))
}

const chownrKid = (p, child, uid, gid, cb) => {
  if (typeof child === 'string')
    return fs.lstat(path.resolve(p, child), (er, stats) => {
      // Skip ENOENT error
      if (er)
        return cb(er.code !== 'ENOENT' ? er : null)
      stats.name = child
      chownrKid(p, stats, uid, gid, cb)
    })

  if (child.isDirectory()) {
    chownr(path.resolve(p, child.name), uid, gid, er => {
      if (er)
        return cb(er)
      const cpath = path.resolve(p, child.name)
      chown(cpath, uid, gid, cb)
    })
  } else {
    const cpath = path.resolve(p, child.name)
    chown(cpath, uid, gid, cb)
  }
}


const chownr = (p, uid, gid, cb) => {
  readdir(p, { withFileTypes: true }, (er, children) => {
    // any error other than ENOTDIR or ENOTSUP means it's not readable,
    // or doesn't exist.  give up.
    if (er) {
      if (er.code === 'ENOENT')
        return cb()
      else if (er.code !== 'ENOTDIR' && er.code !== 'ENOTSUP')
        return cb(er)
    }
    if (er || !children.length)
      return chown(p, uid, gid, cb)

    let len = children.length
    let errState = null
    const then = er => {
      if (errState)
        return
      if (er)
        return cb(errState = er)
      if (-- len === 0)
        return chown(p, uid, gid, cb)
    }

    children.forEach(child => chownrKid(p, child, uid, gid, then))
  })
}

const chownrKidSync = (p, child, uid, gid) => {
  if (typeof child === 'string') {
    try {
      const stats = fs.lstatSync(path.resolve(p, child))
      stats.name = child
      child = stats
    } catch (er) {
      if (er.code === 'ENOENT')
        return
      else
        throw er
    }
  }

  if (child.isDirectory())
    chownrSync(path.resolve(p, child.name), uid, gid)

  handleEISDirSync(path.resolve(p, child.name), uid, gid)
}

const chownrSync = (p, uid, gid) => {
  let children
  try {
    children = readdirSync(p, { withFileTypes: true })
  } catch (er) {
    if (er.code === 'ENOENT')
      return
    else if (er.code === 'ENOTDIR' || er.code === 'ENOTSUP')
      return handleEISDirSync(p, uid, gid)
    else
      throw er
  }

  if (children && children.length)
    children.forEach(child => chownrKidSync(p, child, uid, gid))

  return handleEISDirSync(p, uid, gid)
}

module.exports = chownr
chownr.sync = chownrSync


/***/ }),
/* 155 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// A path exclusive reservation system
// reserve([list, of, paths], fn)
// When the fn is first in line for all its paths, it
// is called with a cb that clears the reservation.
//
// Used by async unpack to avoid clobbering paths in use,
// while still allowing maximal safe parallelization.

const assert = __webpack_require__(125)
const normalize = __webpack_require__(156)
const stripSlashes = __webpack_require__(137)
const { join } = __webpack_require__(58)

const platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform
const isWindows = platform === 'win32'

module.exports = () => {
  // path => [function or Set]
  // A Set object means a directory reservation
  // A fn is a direct reservation on that path
  const queues = new Map()

  // fn => {paths:[path,...], dirs:[path, ...]}
  const reservations = new Map()

  // return a set of parent dirs for a given path
  // '/a/b/c/d' -> ['/', '/a', '/a/b', '/a/b/c', '/a/b/c/d']
  const getDirs = path => {
    const dirs = path.split('/').slice(0, -1).reduce((set, path) => {
      if (set.length) {
        path = join(set[set.length - 1], path)
      }
      set.push(path || '/')
      return set
    }, [])
    return dirs
  }

  // functions currently running
  const running = new Set()

  // return the queues for each path the function cares about
  // fn => {paths, dirs}
  const getQueues = fn => {
    const res = reservations.get(fn)
    /* istanbul ignore if - unpossible */
    if (!res) {
      throw new Error('function does not have any path reservations')
    }
    return {
      paths: res.paths.map(path => queues.get(path)),
      dirs: [...res.dirs].map(path => queues.get(path)),
    }
  }

  // check if fn is first in line for all its paths, and is
  // included in the first set for all its dir queues
  const check = fn => {
    const { paths, dirs } = getQueues(fn)
    return paths.every(q => q[0] === fn) &&
      dirs.every(q => q[0] instanceof Set && q[0].has(fn))
  }

  // run the function if it's first in line and not already running
  const run = fn => {
    if (running.has(fn) || !check(fn)) {
      return false
    }
    running.add(fn)
    fn(() => clear(fn))
    return true
  }

  const clear = fn => {
    if (!running.has(fn)) {
      return false
    }

    const { paths, dirs } = reservations.get(fn)
    const next = new Set()

    paths.forEach(path => {
      const q = queues.get(path)
      assert.equal(q[0], fn)
      if (q.length === 1) {
        queues.delete(path)
      } else {
        q.shift()
        if (typeof q[0] === 'function') {
          next.add(q[0])
        } else {
          q[0].forEach(fn => next.add(fn))
        }
      }
    })

    dirs.forEach(dir => {
      const q = queues.get(dir)
      assert(q[0] instanceof Set)
      if (q[0].size === 1 && q.length === 1) {
        queues.delete(dir)
      } else if (q[0].size === 1) {
        q.shift()

        // must be a function or else the Set would've been reused
        next.add(q[0])
      } else {
        q[0].delete(fn)
      }
    })
    running.delete(fn)

    next.forEach(fn => run(fn))
    return true
  }

  const reserve = (paths, fn) => {
    // collide on matches across case and unicode normalization
    // On windows, thanks to the magic of 8.3 shortnames, it is fundamentally
    // impossible to determine whether two paths refer to the same thing on
    // disk, without asking the kernel for a shortname.
    // So, we just pretend that every path matches every other path here,
    // effectively removing all parallelization on windows.
    paths = isWindows ? ['win32 parallelization disabled'] : paths.map(p => {
      // don't need normPath, because we skip this entirely for windows
      return normalize(stripSlashes(join(p))).toLowerCase()
    })

    const dirs = new Set(
      paths.map(path => getDirs(path)).reduce((a, b) => a.concat(b))
    )
    reservations.set(fn, { dirs, paths })
    paths.forEach(path => {
      const q = queues.get(path)
      if (!q) {
        queues.set(path, [fn])
      } else {
        q.push(fn)
      }
    })
    dirs.forEach(dir => {
      const q = queues.get(dir)
      if (!q) {
        queues.set(dir, [new Set([fn])])
      } else if (q[q.length - 1] instanceof Set) {
        q[q.length - 1].add(fn)
      } else {
        q.push(new Set([fn]))
      }
    })

    return run(fn)
  }

  return { check, reserve }
}


/***/ }),
/* 156 */
/***/ ((module) => {

// warning: extremely hot code path.
// This has been meticulously optimized for use
// within npm install on large package trees.
// Do not edit without careful benchmarking.
const normalizeCache = Object.create(null)
const { hasOwnProperty } = Object.prototype
module.exports = s => {
  if (!hasOwnProperty.call(normalizeCache, s)) {
    normalizeCache[s] = s.normalize('NFKD')
  }
  return normalizeCache[s]
}


/***/ }),
/* 157 */
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),
/* 158 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Get the appropriate flag to use for creating files
// We use fmap on Windows platforms for files less than
// 512kb.  This is a fairly low limit, but avoids making
// things slower in some cases.  Since most of what this
// library is used for is extracting tarballs of many
// relatively small files in npm packages and the like,
// it can be a big boost on Windows platforms.
// Only supported in Node v12.9.0 and above.
const platform = process.env.__FAKE_PLATFORM__ || process.platform
const isWindows = platform === 'win32'
const fs = global.__FAKE_TESTING_FS__ || __webpack_require__(57)

/* istanbul ignore next */
const { O_CREAT, O_TRUNC, O_WRONLY, UV_FS_O_FILEMAP = 0 } = fs.constants

const fMapEnabled = isWindows && !!UV_FS_O_FILEMAP
const fMapLimit = 512 * 1024
const fMapFlag = UV_FS_O_FILEMAP | O_TRUNC | O_CREAT | O_WRONLY
module.exports = !fMapEnabled ? () => 'w'
  : size => size < fMapLimit ? fMapFlag : 'w'


/***/ }),
/* 159 */
/***/ ((module) => {

"use strict";
module.exports = require("https-proxy-agent");

/***/ }),
/* 160 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Set the title.
 */

process.title = 'node-pre-gyp';

const node_pre_gyp = __webpack_require__(54);
const log = __webpack_require__(63);

/**
 * Process and execute the selected commands.
 */

const prog = new node_pre_gyp.Run({ argv: process.argv });
let completed = false;

if (prog.todo.length === 0) {
  if (~process.argv.indexOf('-v') || ~process.argv.indexOf('--version')) {
    console.log('v%s', prog.version);
    process.exit(0);
  } else if (~process.argv.indexOf('-h') || ~process.argv.indexOf('--help')) {
    console.log('%s', prog.usage());
    process.exit(0);
  }
  console.log('%s', prog.usage());
  process.exit(1);
}

// if --no-color is passed
if (prog.opts && Object.hasOwnProperty.call(prog, 'color') && !prog.opts.color) {
  log.disableColor();
}

log.info('it worked if it ends with', 'ok');
log.verbose('cli', process.argv);
log.info('using', process.title + '@%s', prog.version);
log.info('using', 'node@%s | %s | %s', process.versions.node, process.platform, process.arch);


/**
 * Change dir if -C/--directory was passed.
 */

const dir = prog.opts.directory;
if (dir) {
  const fs = __webpack_require__(57);
  try {
    const stat = fs.statSync(dir);
    if (stat.isDirectory()) {
      log.info('chdir', dir);
      process.chdir(dir);
    } else {
      log.warn('chdir', dir + ' is not a directory');
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      log.warn('chdir', dir + ' is not a directory');
    } else {
      log.warn('chdir', 'error during chdir() "%s"', e.message);
    }
  }
}

function run() {
  const command = prog.todo.shift();
  if (!command) {
    // done!
    completed = true;
    log.info('ok');
    return;
  }

  // set binary.host when appropriate. host determines the s3 target bucket.
  const target = prog.setBinaryHostProperty(command.name);
  if (target && ['install', 'publish', 'unpublish', 'info'].indexOf(command.name) >= 0) {
    log.info('using binary.host: ' + prog.package_json.binary.host);
  }

  prog.commands[command.name](command.args, function(err) {
    if (err) {
      log.error(command.name + ' error');
      log.error('stack', err.stack);
      errorMessage();
      log.error('not ok');
      console.log(err.message);
      return process.exit(1);
    }
    const args_array = [].slice.call(arguments, 1);
    if (args_array.length) {
      console.log.apply(console, args_array);
    }
    // now run the next command in the queue
    process.nextTick(run);
  });
}

process.on('exit', (code) => {
  if (!completed && !code) {
    log.error('Completion callback never invoked!');
    errorMessage();
    process.exit(6);
  }
});

process.on('uncaughtException', (err) => {
  log.error('UNCAUGHT EXCEPTION');
  log.error('stack', err.stack);
  errorMessage();
  process.exit(7);
});

function errorMessage() {
  // copied from npm's lib/util/error-handler.js
  const os = __webpack_require__(59);
  log.error('System', os.type() + ' ' + os.release());
  log.error('command', process.argv.map(JSON.stringify).join(' '));
  log.error('cwd', process.cwd());
  log.error('node -v', process.version);
  log.error(process.title + ' -v', 'v' + prog.package.version);
}

// start running the given commands!
run();


/***/ }),
/* 161 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = _package;

exports.usage = 'Packs binary (and enclosing directory) into locally staged tarball';

const fs = __webpack_require__(57);
const path = __webpack_require__(58);
const log = __webpack_require__(63);
const versioning = __webpack_require__(101);
const napi = __webpack_require__(98);
const existsAsync = fs.exists || path.exists;
const makeDir = __webpack_require__(116);
const tar = __webpack_require__(118);

function readdirSync(dir) {
  let list = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const stats = fs.lstatSync(path.join(dir, file));
    if (stats.isDirectory()) {
      list = list.concat(readdirSync(path.join(dir, file)));
    } else {
      list.push(path.join(dir, file));
    }
  });
  return list;
}

function _package(gyp, argv, callback) {
  const package_json = gyp.package_json;
  const napi_build_version = napi.get_napi_build_version_from_command_args(argv);
  const opts = versioning.evaluate(package_json, gyp.opts, napi_build_version);
  const from = opts.module_path;
  const binary_module = path.join(from, opts.module_name + '.node');
  existsAsync(binary_module, (found) => {
    if (!found) {
      return callback(new Error('Cannot package because ' + binary_module + ' missing: run `node-pre-gyp rebuild` first'));
    }
    const tarball = opts.staged_tarball;
    const filter_func = function(entry) {
      const basename = path.basename(entry);
      if (basename.length && basename[0] !== '.') {
        console.log('packing ' + entry);
        return true;
      } else {
        console.log('skipping ' + entry);
      }
      return false;
    };
    makeDir(path.dirname(tarball)).then(() => {
      let files = readdirSync(from);
      const base = path.basename(from);
      files = files.map((file) => {
        return path.join(base, path.relative(from, file));
      });
      tar.create({
        portable: false,
        gzip: true,
        filter: filter_func,
        file: tarball,
        cwd: path.dirname(from)
      }, files, (err2) => {
        if (err2)  console.error('[' + package_json.name + '] ' + err2.message);
        else log.info('package', 'Binary staged at "' + tarball + '"');
        return callback(err2);
      });
    }).catch((err) => {
      return callback(err);
    });
  });
}


/***/ }),
/* 162 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = publish;

exports.usage = 'Publishes pre-built binary (requires aws-sdk)';

const fs = __webpack_require__(57);
const path = __webpack_require__(58);
const log = __webpack_require__(63);
const versioning = __webpack_require__(101);
const napi = __webpack_require__(98);
const s3_setup = __webpack_require__(55);
const existsAsync = fs.exists || path.exists;
const url = __webpack_require__(56);

function publish(gyp, argv, callback) {
  const package_json = gyp.package_json;
  const napi_build_version = napi.get_napi_build_version_from_command_args(argv);
  const opts = versioning.evaluate(package_json, gyp.opts, napi_build_version);
  const tarball = opts.staged_tarball;
  existsAsync(tarball, (found) => {
    if (!found) {
      return callback(new Error('Cannot publish because ' + tarball + ' missing: run `node-pre-gyp package` first'));
    }

    log.info('publish', 'Detecting s3 credentials');
    const config = {};
    s3_setup.detect(opts, config);
    const s3 = s3_setup.get_s3(config);

    const key_name = url.resolve(config.prefix, opts.package_name);
    const s3_opts = {
      Bucket: config.bucket,
      Key: key_name
    };
    log.info('publish', 'Authenticating with s3');
    log.info('publish', config);

    log.info('publish', 'Checking for existing binary at ' + opts.hosted_path);
    s3.headObject(s3_opts, (err, meta) => {
      if (meta) log.info('publish', JSON.stringify(meta));
      if (err && err.code === 'NotFound') {
        // we are safe to publish because
        // the object does not already exist
        log.info('publish', 'Preparing to put object');
        const s3_put_opts = {
          ACL: 'public-read',
          Body: fs.createReadStream(tarball),
          Key: key_name,
          Bucket: config.bucket
        };
        log.info('publish', 'Putting object', s3_put_opts.ACL, s3_put_opts.Bucket, s3_put_opts.Key);
        try {
          s3.putObject(s3_put_opts, (err2, resp) => {
            log.info('publish', 'returned from putting object');
            if (err2) {
              log.info('publish', 's3 putObject error: "' + err2 + '"');
              return callback(err2);
            }
            if (resp) log.info('publish', 's3 putObject response: "' + JSON.stringify(resp) + '"');
            log.info('publish', 'successfully put object');
            console.log('[' + package_json.name + '] published to ' + opts.hosted_path);
            return callback();
          });
        } catch (err3) {
          log.info('publish', 's3 putObject error: "' + err3 + '"');
          return callback(err3);
        }
      } else if (err) {
        log.info('publish', 's3 headObject error: "' + err + '"');
        return callback(err);
      } else {
        log.error('publish', 'Cannot publish over existing version');
        log.error('publish', "Update the 'version' field in package.json and try again");
        log.error('publish', 'If the previous version was published in error see:');
        log.error('publish', '\t node-pre-gyp unpublish');
        return callback(new Error('Failed publishing to ' + opts.hosted_path));
      }
    });
  });
}


/***/ }),
/* 163 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = rebuild;

exports.usage = 'Runs "clean" and "build" at once';

const napi = __webpack_require__(98);

function rebuild(gyp, argv, callback) {
  const package_json = gyp.package_json;
  let commands = [
    { name: 'clean', args: [] },
    { name: 'build', args: ['rebuild'] }
  ];
  commands = napi.expand_commands(package_json, gyp.opts, commands);
  for (let i = commands.length; i !== 0; i--) {
    gyp.todo.unshift(commands[i - 1]);
  }
  process.nextTick(callback);
}


/***/ }),
/* 164 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = rebuild;

exports.usage = 'Runs "clean" and "install" at once';

const napi = __webpack_require__(98);

function rebuild(gyp, argv, callback) {
  const package_json = gyp.package_json;
  let installArgs = [];
  const napi_build_version = napi.get_best_napi_build_version(package_json, gyp.opts);
  if (napi_build_version != null) installArgs = [napi.get_command_arg(napi_build_version)];
  gyp.todo.unshift(
    { name: 'clean', args: [] },
    { name: 'install', args: installArgs }
  );
  process.nextTick(callback);
}


/***/ }),
/* 165 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = reveal;

exports.usage = 'Reveals data on the versioned binary';

const versioning = __webpack_require__(101);
const napi = __webpack_require__(98);

function unix_paths(key, val) {
  return val && val.replace ? val.replace(/\\/g, '/') : val;
}

function reveal(gyp, argv, callback) {
  const package_json = gyp.package_json;
  const napi_build_version = napi.get_napi_build_version_from_command_args(argv);
  const opts = versioning.evaluate(package_json, gyp.opts, napi_build_version);
  let hit = false;
  // if a second arg is passed look to see
  // if it is a known option
  // console.log(JSON.stringify(gyp.opts,null,1))
  const remain = gyp.opts.argv.remain[gyp.opts.argv.remain.length - 1];
  if (remain && Object.hasOwnProperty.call(opts, remain)) {
    console.log(opts[remain].replace(/\\/g, '/'));
    hit = true;
  }
  // otherwise return all options as json
  if (!hit) {
    console.log(JSON.stringify(opts, unix_paths, 2));
  }
  return callback();
}


/***/ }),
/* 166 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = testbinary;

exports.usage = 'Tests that the binary.node can be required';

const path = __webpack_require__(58);
const log = __webpack_require__(63);
const cp = __webpack_require__(104);
const versioning = __webpack_require__(101);
const napi = __webpack_require__(98);

function testbinary(gyp, argv, callback) {
  const args = [];
  const options = {};
  let shell_cmd = process.execPath;
  const package_json = gyp.package_json;
  const napi_build_version = napi.get_napi_build_version_from_command_args(argv);
  const opts = versioning.evaluate(package_json, gyp.opts, napi_build_version);
  // skip validation for runtimes we don't explicitly support (like electron)
  if (opts.runtime &&
        opts.runtime !== 'node-webkit' &&
        opts.runtime !== 'node') {
    return callback();
  }
  const nw = (opts.runtime && opts.runtime === 'node-webkit');
  // ensure on windows that / are used for require path
  const binary_module = opts.module.replace(/\\/g, '/');
  if ((process.arch !== opts.target_arch) ||
        (process.platform !== opts.target_platform)) {
    let msg = 'skipping validation since host platform/arch (';
    msg += process.platform + '/' + process.arch + ')';
    msg += ' does not match target (';
    msg += opts.target_platform + '/' + opts.target_arch + ')';
    log.info('validate', msg);
    return callback();
  }
  if (nw) {
    options.timeout = 5000;
    if (process.platform === 'darwin') {
      shell_cmd = 'node-webkit';
    } else if (process.platform === 'win32') {
      shell_cmd = 'nw.exe';
    } else {
      shell_cmd = 'nw';
    }
    const modulePath = path.resolve(binary_module);
    const appDir = path.join(__dirname, 'util', 'nw-pre-gyp');
    args.push(appDir);
    args.push(modulePath);
    log.info('validate', "Running test command: '" + shell_cmd + ' ' + args.join(' ') + "'");
    cp.execFile(shell_cmd, args, options, (err, stdout, stderr) => {
      // check for normal timeout for node-webkit
      if (err) {
        if (err.killed === true && err.signal && err.signal.indexOf('SIG') > -1) {
          return callback();
        }
        const stderrLog = stderr.toString();
        log.info('stderr', stderrLog);
        if (/^\s*Xlib:\s*extension\s*"RANDR"\s*missing\s*on\s*display\s*":\d+\.\d+"\.\s*$/.test(stderrLog)) {
          log.info('RANDR', 'stderr contains only RANDR error, ignored');
          return callback();
        }
        return callback(err);
      }
      return callback();
    });
    return;
  }
  args.push('--eval');
  args.push("require('" + binary_module.replace(/'/g, '\'') + "')");
  log.info('validate', "Running test command: '" + shell_cmd + ' ' + args.join(' ') + "'");
  cp.execFile(shell_cmd, args, options, (err, stdout, stderr) => {
    if (err) {
      return callback(err, { stdout: stdout, stderr: stderr });
    }
    return callback();
  });
}


/***/ }),
/* 167 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = testpackage;

exports.usage = 'Tests that the staged package is valid';

const fs = __webpack_require__(57);
const path = __webpack_require__(58);
const log = __webpack_require__(63);
const existsAsync = fs.exists || path.exists;
const versioning = __webpack_require__(101);
const napi = __webpack_require__(98);
const testbinary = __webpack_require__(166);
const tar = __webpack_require__(118);
const makeDir = __webpack_require__(116);

function testpackage(gyp, argv, callback) {
  const package_json = gyp.package_json;
  const napi_build_version = napi.get_napi_build_version_from_command_args(argv);
  const opts = versioning.evaluate(package_json, gyp.opts, napi_build_version);
  const tarball = opts.staged_tarball;
  existsAsync(tarball, (found) => {
    if (!found) {
      return callback(new Error('Cannot test package because ' + tarball + ' missing: run `node-pre-gyp package` first'));
    }
    const to = opts.module_path;
    function filter_func(entry) {
      log.info('install', 'unpacking [' + entry.path + ']');
    }

    makeDir(to).then(() => {
      tar.extract({
        file: tarball,
        cwd: to,
        strip: 1,
        onentry: filter_func
      }).then(after_extract, callback);
    }).catch((err) => {
      return callback(err);
    });

    function after_extract() {
      testbinary(gyp, argv, (err) => {
        if (err) {
          return callback(err);
        } else {
          console.log('[' + package_json.name + '] Package appears valid');
          return callback();
        }
      });
    }
  });
}


/***/ }),
/* 168 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";


module.exports = exports = unpublish;

exports.usage = 'Unpublishes pre-built binary (requires aws-sdk)';

const log = __webpack_require__(63);
const versioning = __webpack_require__(101);
const napi = __webpack_require__(98);
const s3_setup = __webpack_require__(55);
const url = __webpack_require__(56);

function unpublish(gyp, argv, callback) {
  const package_json = gyp.package_json;
  const napi_build_version = napi.get_napi_build_version_from_command_args(argv);
  const opts = versioning.evaluate(package_json, gyp.opts, napi_build_version);
  const config = {};
  s3_setup.detect(opts, config);
  const s3 = s3_setup.get_s3(config);
  const key_name = url.resolve(config.prefix, opts.package_name);
  const s3_opts = {
    Bucket: config.bucket,
    Key: key_name
  };
  s3.headObject(s3_opts, (err, meta) => {
    if (err && err.code === 'NotFound') {
      console.log('[' + package_json.name + '] Not found: https://' + s3_opts.Bucket + '.s3.amazonaws.com/' + s3_opts.Key);
      return callback();
    } else if (err) {
      return callback(err);
    } else {
      log.info('unpublish', JSON.stringify(meta));
      s3.deleteObject(s3_opts, (err2, resp) => {
        if (err2) return callback(err2);
        log.info(JSON.stringify(resp));
        console.log('[' + package_json.name + '] Success: removed https://' + s3_opts.Bucket + '.s3.amazonaws.com/' + s3_opts.Key);
        return callback();
      });
    }
  });
}


/***/ }),
/* 169 */
/***/ (() => {

throw new Error("Module parse failed: Unexpected token (1:0)\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\n> <!doctype html>\n| <html>\n| <head>");

/***/ }),
/* 170 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"main":"index.html","name":"nw-pre-gyp-module-test","description":"Node-webkit-based module test.","version":"0.0.1","window":{"show":false}}');

/***/ }),
/* 171 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@mapbox/node-pre-gyp","description":"Node.js native addon binary install tool","version":"1.0.10","keywords":["native","addon","module","c","c++","bindings","binary"],"license":"BSD-3-Clause","author":"Dane Springmeyer <dane@mapbox.com>","repository":{"type":"git","url":"git://github.com/mapbox/node-pre-gyp.git"},"bin":"./bin/node-pre-gyp","main":"./lib/node-pre-gyp.js","dependencies":{"detect-libc":"^2.0.0","https-proxy-agent":"^5.0.0","make-dir":"^3.1.0","node-fetch":"^2.6.7","nopt":"^5.0.0","npmlog":"^5.0.1","rimraf":"^3.0.2","semver":"^7.3.5","tar":"^6.1.11"},"devDependencies":{"@mapbox/cloudfriend":"^5.1.0","@mapbox/eslint-config-mapbox":"^3.0.0","aws-sdk":"^2.1087.0","codecov":"^3.8.3","eslint":"^7.32.0","eslint-plugin-node":"^11.1.0","mock-aws-s3":"^4.0.2","nock":"^12.0.3","node-addon-api":"^4.3.0","nyc":"^15.1.0","tape":"^5.5.2","tar-fs":"^2.1.1"},"nyc":{"all":true,"skip-full":false,"exclude":["test/**"]},"scripts":{"coverage":"nyc --all --include index.js --include lib/ npm test","upload-coverage":"nyc report --reporter json && codecov --clear --flags=unit --file=./coverage/coverage-final.json","lint":"eslint bin/node-pre-gyp lib/*js lib/util/*js test/*js scripts/*js","fix":"npm run lint -- --fix","update-crosswalk":"node scripts/abi_crosswalk.js","test":"tape test/*test.js"}}');

/***/ }),
/* 172 */
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 172;
module.exports = webpackEmptyContext;

/***/ }),
/* 173 */
/***/ ((module) => {

"use strict";


var Promise = global.Promise;

/// encapsulate a method with a node-style callback in a Promise
/// @param {object} 'this' of the encapsulated function
/// @param {function} function to be encapsulated
/// @param {Array-like} args to be passed to the called function
/// @return {Promise} a Promise encapsulating the function
module.exports.promise = function (fn, context, args) {

    if (!Array.isArray(args)) {
        args = Array.prototype.slice.call(args);
    }

    if (typeof fn !== 'function') {
        return Promise.reject(new Error('fn must be a function'));
    }

    return new Promise(function(resolve, reject) {
        args.push(function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });

        fn.apply(context, args);
    });
};

/// @param {err} the error to be thrown
module.exports.reject = function (err) {
    return Promise.reject(err);
};

/// changes the promise implementation that bcrypt uses
/// @param {Promise} the implementation to use
module.exports.use = function(promise) {
  Promise = promise;
};


/***/ }),
/* 174 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InGameUsersService = exports.socketIdMap = void 0;
const common_1 = __webpack_require__(7);
const ws_exception_filter_1 = __webpack_require__(29);
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
let InGameUsersService = class InGameUsersService {
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
InGameUsersService = __decorate([
    (0, common_1.Injectable)()
], InGameUsersService);
exports.InGameUsersService = InGameUsersService;


/***/ })
];
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("9ccc3f1d968f3e124bf3")
/******/ })();
/******/ 
/******/ }
;