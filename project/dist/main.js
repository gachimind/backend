/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?100";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.slice(1) || 0;
	var log = __webpack_require__(1);

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}


/***/ }),
/* 1 */
/***/ ((module) => {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function (level) {
	logLevel = level;
};

module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(1);

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),
/* 3 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(5);
const app_module_1 = __webpack_require__(6);
const common_1 = __webpack_require__(7);
const http_exception_filter_1 = __webpack_require__(65);
const passport = __webpack_require__(66);
const cookieParser = __webpack_require__(67);
const logger_service_1 = __webpack_require__(68);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: logger_service_1.winstonLogger,
    });
    const port = process.env.PORT || 3000;
    app.enableCors({ origin: '*' });
    app.use(cookieParser());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.use(passport.initialize());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('가치마인드 API 명세')
        .setDescription('가치마인드 HTTP API 명세서')
        .setVersion('1.0')
        .addCookieAuth('connect.sid')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(port);
    console.log(`listening on port ${port}`);
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(7);
const users_module_1 = __webpack_require__(8);
const games_module_1 = __webpack_require__(28);
const config_1 = __webpack_require__(11);
const logger_middleware_1 = __webpack_require__(47);
const app_controller_1 = __webpack_require__(48);
const passport_1 = __webpack_require__(23);
const typeorm_1 = __webpack_require__(9);
const user_entity_1 = __webpack_require__(15);
const token_map_entity_1 = __webpack_require__(20);
const room_entity_1 = __webpack_require__(33);
const player_entity_1 = __webpack_require__(34);
const socketIdMap_entity_1 = __webpack_require__(35);
const keyword_module_1 = __webpack_require__(51);
const keyword_entities_1 = __webpack_require__(52);
const turn_entity_1 = __webpack_require__(36);
const turnResult_entity_1 = __webpack_require__(19);
const gameResult_entity_1 = __webpack_require__(18);
const admin_module_1 = __webpack_require__(57);
const todayResult_entity_1 = __webpack_require__(16);
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.MYSQL_HOST,
                port: 3306,
                username: process.env.MYSQL_USERNAME,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                entities: [
                    user_entity_1.User,
                    token_map_entity_1.TokenMap,
                    room_entity_1.Room,
                    player_entity_1.Player,
                    socketIdMap_entity_1.SocketIdMap,
                    keyword_entities_1.Keyword,
                    turn_entity_1.Turn,
                    turnResult_entity_1.TurnResult,
                    gameResult_entity_1.GameResult,
                    todayResult_entity_1.TodayResult,
                ],
                synchronize: false,
                logging: false,
                keepConnectionAlive: true,
                charset: 'utf8mb4_general_ci',
                timezone: 'Z',
                cache: true,
            }),
            users_module_1.UsersModule,
            games_module_1.GamesModule,
            keyword_module_1.KeywordModule,
            passport_1.PassportModule.register({ session: true }),
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [config_1.ConfigService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 7 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),
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
const users_service_1 = __webpack_require__(12);
const kakao_serializer_1 = __webpack_require__(24);
const user_entity_1 = __webpack_require__(15);
const kakao_strategy_1 = __webpack_require__(25);
const token_map_entity_1 = __webpack_require__(20);
const jwt_1 = __webpack_require__(14);
const passport_1 = __webpack_require__(23);
const config_1 = __webpack_require__(11);
const jwt_guard_1 = __webpack_require__(27);
const todayResult_entity_1 = __webpack_require__(16);
const gameResult_entity_1 = __webpack_require__(18);
const turnResult_entity_1 = __webpack_require__(19);
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, token_map_entity_1.TokenMap, todayResult_entity_1.TodayResult, gameResult_entity_1.GameResult, turnResult_entity_1.TurnResult]),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('TOKEN_SECRETE_KEY'),
                    signOptions: { expiresIn: '24h' },
                }),
            }),
            passport_1.PassportModule,
        ],
        controllers: [users_controller_1.UsersController],
        providers: [
            users_service_1.UsersService,
            kakao_serializer_1.SessionSerializer,
            kakao_strategy_1.KakaoStrategy,
            jwt_guard_1.JwtAuthGuard,
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
/* 9 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/typeorm");

/***/ }),
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(7);
const config_1 = __webpack_require__(11);
const users_service_1 = __webpack_require__(12);
const express_1 = __webpack_require__(22);
const passport_1 = __webpack_require__(23);
let UsersController = class UsersController {
    constructor(usersService, configService) {
        this.usersService = usersService;
        this.configService = configService;
    }
    handleLogin() {
        return { msg: 'Kakao-Talk Authentication' };
    }
    async kakaoLoginRedirect(code, req, res) {
        if (!req.user) {
            throw new common_1.HttpException('회원 인증에 실패하였습니다.', 401);
        }
        const user = await this.usersService.validateUser(req.user);
        const token = await this.usersService.createToken(user);
        return { url: this.configService.get('REDIRECT') + token };
    }
    async logout(headers) {
        const token = headers.authorization.replace('Bearer ', '');
        await this.usersService.logout(token);
        const message = '로그아웃 되었습니다.';
        return { data: message };
    }
    async getUserDetailsByToken(headers) {
        const token = headers.authorization.replace('Bearer ', '');
        const data = await this.usersService.getUserDetailsByToken(token);
        return { data };
    }
    async userKeyword(headers) {
        const token = headers.authorization.replace('Bearer ', '');
        const data = await this.usersService.userKeyword(token);
        return { data };
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    (0, common_1.Get)('login/kakao'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "handleLogin", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    (0, common_1.Get)('login/kakao/redirect'),
    (0, common_1.Redirect)('redirectUrl', 302),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "kakaoLoginRedirect", null);
__decorate([
    (0, common_1.Get)('/logout'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('/me'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserDetailsByToken", null);
__decorate([
    (0, common_1.Get)('/me/keyword'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userKeyword", null);
UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], UsersController);
exports.UsersController = UsersController;


/***/ }),
/* 11 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),
/* 12 */
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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(13);
const jwt_1 = __webpack_require__(14);
const user_entity_1 = __webpack_require__(15);
const token_map_entity_1 = __webpack_require__(20);
const config_1 = __webpack_require__(11);
const todayResult_entity_1 = __webpack_require__(16);
const gameResult_entity_1 = __webpack_require__(18);
const turnResult_entity_1 = __webpack_require__(19);
const today_date_constructor_1 = __webpack_require__(21);
let UsersService = class UsersService {
    constructor(usersRepository, tokenMapRepository, todayResultRepository, gameResultRepository, TurnResultRepository, jwtService, configService) {
        this.usersRepository = usersRepository;
        this.tokenMapRepository = tokenMapRepository;
        this.todayResultRepository = todayResultRepository;
        this.gameResultRepository = gameResultRepository;
        this.TurnResultRepository = TurnResultRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async createUser(details) {
        return await this.usersRepository.save(details);
    }
    async findUserByNickname(nickname) {
        return await this.usersRepository.findBy({ nickname: (0, typeorm_2.Like)(`${nickname}%`) });
    }
    async findUser(kakaoUserId, email) {
        let user = await this.usersRepository.findOne({ where: { kakaoUserId } });
        if (!user && email) {
            user = await this.usersRepository.findOne({ where: { email } });
        }
        return user;
    }
    async validateUser(userData) {
        let user = await this.findUser(userData.kakaoUserId, userData.email);
        if (!user) {
            const sameNickname = await this.findUserByNickname(userData.nickname);
            if (sameNickname.length) {
                userData.nickname = userData.nickname + (sameNickname.length + 1);
            }
            userData.isFirstLogin = true;
            user = await this.createUser(userData);
        }
        return user;
    }
    async createToken(user) {
        const payload = {};
        const token = this.jwtService.sign({
            payload,
        });
        const tokenMapId = await this.tokenMapRepository.findOne({
            where: { userInfo: user.userId },
            select: { tokenMapId: true },
        });
        let tokenMapData = { userInfo: user.userId, token: token };
        if (tokenMapId) {
            tokenMapData['tokenMapId'] = tokenMapId.tokenMapId;
        }
        await this.tokenMapRepository.save(tokenMapData);
        return token;
    }
    async tokenValidate(token) {
        return await this.jwtService.verify(token, {
            secret: this.configService.get('TOKEN_SECRETE_KEY'),
        });
    }
    async logout(token) {
        const findUser = await this.tokenMapRepository.delete({ token });
        if (!findUser)
            throw new common_1.HttpException('정상적인 접근이 아닙니다.', 401);
        return findUser;
    }
    async getUserDetailsByToken(token) {
        const getUserInfoByToken = await this.tokenMapRepository.findOne({
            where: { token },
            select: {
                user: { userId: true, nickname: true, profileImg: true, isFirstLogin: true },
            },
        });
        if (!getUserInfoByToken)
            throw new common_1.HttpException('해당하는 사용자를 찾을 수 없습니다.', 401);
        const { userId, nickname, profileImg, isFirstLogin } = getUserInfoByToken.user;
        if (isFirstLogin) {
            await this.usersRepository.save({ userId, isFirstLogin: false });
        }
        const todayScore = await this.getTodayScoreByUserId(userId);
        return {
            userId,
            nickname,
            profileImg,
            isFirstLogin,
            today: { todayScore, todayRank: 0 },
            total: { totalScore: 0 },
        };
    }
    async getTodayScoreByUserId(userInfo) {
        const today = (0, today_date_constructor_1.getTodayDate)();
        const findTodayScore = await this.todayResultRepository.findOne({
            where: {
                userInfo,
                createdAt: (0, typeorm_2.MoreThan)(today),
            },
        });
        let todayScore = 0;
        if (findTodayScore)
            todayScore = findTodayScore.todayScore;
        return todayScore;
    }
    async userKeyword(token) {
        const user = await this.tokenMapRepository.findOneBy({
            token,
        });
        if (!user)
            throw new common_1.HttpException('정상적인 접근이 아닙니다.', 401);
        const findTotalkeyword = await this.TurnResultRepository.find({
            where: { userId: user.userInfo },
            select: { keyword: true, isSpeech: true, createdAt: true },
        });
        const speechKeywordArray = [];
        const quizKeywordArray = [];
        for (const result of findTotalkeyword) {
            if (result.isSpeech) {
                speechKeywordArray.push(result.keyword);
            }
            else {
                quizKeywordArray.push(result.keyword);
            }
        }
        const totalSpeechKeyword = [...new Set(speechKeywordArray)];
        const totalQuizKeyword = [...new Set(quizKeywordArray)];
        const today = (0, today_date_constructor_1.getTodayDate)();
        const findTodaykeyword = await this.TurnResultRepository.find({
            where: {
                userId: user.userInfo,
                createdAt: (0, typeorm_2.MoreThan)(today),
            },
            select: { keyword: true, isSpeech: true },
        });
        const todaySpeechKeywordArray = [];
        const todayQuizKeywordArray = [];
        for (const result of findTodaykeyword) {
            if (result.isSpeech) {
                todaySpeechKeywordArray.push(result.keyword);
            }
            else {
                todayQuizKeywordArray.push(result.keyword);
            }
        }
        const todaySpeechKeyword = [...new Set(todaySpeechKeywordArray)];
        const todayQuizKeyword = [...new Set(todayQuizKeywordArray)];
        const data = {
            userId: user.userInfo,
            todaySpeechKeyword,
            todayQuizKeyword,
            totalSpeechKeyword,
            totalQuizKeyword,
        };
        console.log(data);
        return data;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __param(2, (0, typeorm_1.InjectRepository)(todayResult_entity_1.TodayResult)),
    __param(3, (0, typeorm_1.InjectRepository)(gameResult_entity_1.GameResult)),
    __param(4, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _f : Object, typeof (_g = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _g : Object])
], UsersService);
exports.UsersService = UsersService;


/***/ }),
/* 13 */
/***/ ((module) => {

"use strict";
module.exports = require("typeorm");

/***/ }),
/* 14 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),
/* 15 */
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
const typeorm_1 = __webpack_require__(13);
const todayResult_entity_1 = __webpack_require__(16);
const gameResult_entity_1 = __webpack_require__(18);
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "kakaoUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 50 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 30 }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], User.prototype, "profileImg", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], User.prototype, "isFirstLogin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ select: false }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => gameResult_entity_1.GameResult, (gameResult) => gameResult.user),
    __metadata("design:type", Array)
], User.prototype, "gameResults", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => todayResult_entity_1.TodayResult, (todayResult) => todayResult.user, { eager: true }),
    __metadata("design:type", Array)
], User.prototype, "todayResults", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;


/***/ }),
/* 16 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TodayResult = void 0;
const typeorm_1 = __webpack_require__(13);
const user_entity_1 = __webpack_require__(15);
const ManyToOne_1 = __webpack_require__(17);
const gameResult_entity_1 = __webpack_require__(18);
let TodayResult = class TodayResult {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TodayResult.prototype, "todayResultId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userInfo' }),
    __metadata("design:type", Number)
], TodayResult.prototype, "userInfo", void 0);
__decorate([
    (0, ManyToOne_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userInfo' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], TodayResult.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TodayResult.prototype, "todayScore", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], TodayResult.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], TodayResult.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ select: false }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], TodayResult.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => gameResult_entity_1.GameResult, (gameResult) => gameResult.todayResult, { eager: true }),
    __metadata("design:type", Array)
], TodayResult.prototype, "gameResults", void 0);
TodayResult = __decorate([
    (0, typeorm_1.Entity)()
], TodayResult);
exports.TodayResult = TodayResult;


/***/ }),
/* 17 */
/***/ ((module) => {

"use strict";
module.exports = require("typeorm/decorator/relations/ManyToOne");

/***/ }),
/* 18 */
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameResult = void 0;
const typeorm_1 = __webpack_require__(13);
const turnResult_entity_1 = __webpack_require__(19);
const user_entity_1 = __webpack_require__(15);
const ManyToOne_1 = __webpack_require__(17);
const todayResult_entity_1 = __webpack_require__(16);
let GameResult = class GameResult {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GameResult.prototype, "gameResultId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GameResult.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userInfo' }),
    __metadata("design:type", Number)
], GameResult.prototype, "userInfo", void 0);
__decorate([
    (0, ManyToOne_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userInfo' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], GameResult.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], GameResult.prototype, "gameScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'todayResultInfo', nullable: true, select: true }),
    __metadata("design:type", Number)
], GameResult.prototype, "todayResultInfo", void 0);
__decorate([
    (0, ManyToOne_1.ManyToOne)(() => todayResult_entity_1.TodayResult, (todayResult) => todayResult.gameResults, {
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'todayResultInfo' }),
    __metadata("design:type", typeof (_b = typeof todayResult_entity_1.TodayResult !== "undefined" && todayResult_entity_1.TodayResult) === "function" ? _b : Object)
], GameResult.prototype, "todayResult", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], GameResult.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], GameResult.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ select: false }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], GameResult.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => turnResult_entity_1.TurnResult, (turnResult) => turnResult.gameResult),
    __metadata("design:type", Array)
], GameResult.prototype, "turnResults", void 0);
GameResult = __decorate([
    (0, typeorm_1.Entity)()
], GameResult);
exports.GameResult = GameResult;


/***/ }),
/* 19 */
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
exports.TurnResult = void 0;
const typeorm_1 = __webpack_require__(13);
const gameResult_entity_1 = __webpack_require__(18);
let TurnResult = class TurnResult {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TurnResult.prototype, "turnResultId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gameResultInfo' }),
    __metadata("design:type", Number)
], TurnResult.prototype, "gameResultInfo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gameResult_entity_1.GameResult, (gameResult) => gameResult.gameResultId),
    (0, typeorm_1.JoinColumn)({ name: 'gameResultInfo' }),
    __metadata("design:type", typeof (_a = typeof gameResult_entity_1.GameResult !== "undefined" && gameResult_entity_1.GameResult) === "function" ? _a : Object)
], TurnResult.prototype, "gameResult", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TurnResult.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint' }),
    __metadata("design:type", Number)
], TurnResult.prototype, "turn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TurnResult.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TurnResult.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint' }),
    __metadata("design:type", Number)
], TurnResult.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TurnResult.prototype, "keyword", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], TurnResult.prototype, "isSpeech", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], TurnResult.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], TurnResult.prototype, "updatedAt", void 0);
TurnResult = __decorate([
    (0, typeorm_1.Entity)()
], TurnResult);
exports.TurnResult = TurnResult;


/***/ }),
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenMap = void 0;
const typeorm_1 = __webpack_require__(13);
const user_entity_1 = __webpack_require__(15);
let TokenMap = class TokenMap {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TokenMap.prototype, "tokenMapId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], TokenMap.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userInfo' }),
    __metadata("design:type", Number)
], TokenMap.prototype, "userInfo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { onDelete: 'CASCADE', eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userInfo' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], TokenMap.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], TokenMap.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], TokenMap.prototype, "updatedAt", void 0);
TokenMap = __decorate([
    (0, typeorm_1.Entity)()
], TokenMap);
exports.TokenMap = TokenMap;


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTodayDate = void 0;
function getTodayDate() {
    const date = new Date();
    const dateString = date.toDateString();
    const newDate = new Date(`${dateString} 0:00:00`);
    return newDate;
}
exports.getTodayDate = getTodayDate;


/***/ }),
/* 22 */
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),
/* 23 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/passport");

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
const passport_1 = __webpack_require__(23);
const users_service_1 = __webpack_require__(12);
let SessionSerializer = class SessionSerializer extends passport_1.PassportSerializer {
    constructor(usersService) {
        super();
        this.usersService = usersService;
    }
    serializeUser(user, done) {
        done(null, user);
    }
    async deserializeUser(payload, done) {
        const user = await this.usersService.findUser(payload.kakaoUserId, payload.email);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KakaoStrategy = void 0;
const common_1 = __webpack_require__(7);
const config_1 = __webpack_require__(11);
const passport_1 = __webpack_require__(23);
const passport_kakao_oauth2_1 = __webpack_require__(26);
let KakaoStrategy = class KakaoStrategy extends (0, passport_1.PassportStrategy)(passport_kakao_oauth2_1.Strategy) {
    constructor(configService) {
        super({
            clientID: configService.get('CLIENT_ID'),
            clientSecret: configService.get('SECRET_KEY'),
            callbackURL: configService.get('CALLBACK'),
        });
    }
    async validate(accessToken, refreshToken, profile, done) {
        const user = {
            kakaoUserId: profile._json.id,
            email: profile._json.kakao_account.email || `email${profile._json.id}@gachimind.com`,
            nickname: profile._json.properties.nickname,
            profileImg: 'white-red',
        };
        done(null, user);
    }
};
KakaoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], KakaoStrategy);
exports.KakaoStrategy = KakaoStrategy;


/***/ }),
/* 26 */
/***/ ((module) => {

"use strict";
module.exports = require("passport-kakao-oauth2");

/***/ }),
/* 27 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(7);
const common_2 = __webpack_require__(7);
const users_service_1 = __webpack_require__(12);
let JwtAuthGuard = class JwtAuthGuard {
    constructor(userService) {
        this.userService = userService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        console.log(authorization);
        if (!authorization) {
            throw new common_2.HttpException('확인되지 않는 유저입니다.', common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = authorization.replace('Bearer ', '');
        await this.userService.tokenValidate(token);
        return true;
    }
};
JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;


/***/ }),
/* 28 */
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
const typeorm_1 = __webpack_require__(9);
const games_gateway_1 = __webpack_require__(29);
const room_service_1 = __webpack_require__(32);
const chat_service_1 = __webpack_require__(44);
const users_module_1 = __webpack_require__(8);
const players_service_1 = __webpack_require__(42);
const room_entity_1 = __webpack_require__(33);
const player_entity_1 = __webpack_require__(34);
const socketIdMap_entity_1 = __webpack_require__(35);
const turn_entity_1 = __webpack_require__(36);
const turnResult_entity_1 = __webpack_require__(19);
const gameResult_entity_1 = __webpack_require__(18);
const games_service_1 = __webpack_require__(46);
const todayResult_entity_1 = __webpack_require__(16);
let GamesModule = class GamesModule {
};
GamesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            typeorm_1.TypeOrmModule.forFeature([
                room_entity_1.Room,
                player_entity_1.Player,
                socketIdMap_entity_1.SocketIdMap,
                turn_entity_1.Turn,
                turnResult_entity_1.TurnResult,
                gameResult_entity_1.GameResult,
                todayResult_entity_1.TodayResult,
            ]),
        ],
        providers: [games_gateway_1.GamesGateway, room_service_1.RoomService, chat_service_1.ChatService, players_service_1.PlayersService, games_service_1.GamesService],
        exports: [games_gateway_1.GamesGateway, typeorm_1.TypeOrmModule],
    })
], GamesModule);
exports.GamesModule = GamesModule;


/***/ }),
/* 29 */
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamesGateway = void 0;
const websockets_1 = __webpack_require__(30);
const socket_io_1 = __webpack_require__(31);
const room_service_1 = __webpack_require__(32);
const ws_exception_filter_1 = __webpack_require__(37);
const players_service_1 = __webpack_require__(42);
const event_user_info_constructor_1 = __webpack_require__(43);
const chat_service_1 = __webpack_require__(44);
const common_1 = __webpack_require__(7);
const update_room_info_constructor_1 = __webpack_require__(45);
const games_service_1 = __webpack_require__(46);
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
            const updateRoom = await this.updateRoom(requestUser.player.roomInfo);
            await this.announceUpdateRoomInfo(updateRoom, requestUser, 'leave');
        }
        return console.log('disconnected socket', socket.id);
    }
    async socketIdMapToLoginUser(socket, { data }) {
        const token = data.authorization;
        if (!token) {
            throw new ws_exception_filter_1.SocketException('사용자 인증에 실패했습니다.', 401, 'log-in');
        }
        const requestUser = await this.playersService.socketIdMapToLoginUser(token, socket.id);
        await this.playersService.createTodayResult(requestUser.userInfo);
        console.log('로그인 성공!');
        socket.emit('log-in', { message: '로그인 성공!' });
    }
    async socketIdMapToLogOutUser(socket) {
        const event = 'log-out';
        const requestUser = await this.socketAuthentication(socket.id, event);
        await this.playersService.removeSocketBySocketId(socket.id);
        if (requestUser.player) {
            const updateRoom = await this.updateRoom(requestUser.player.roomInfo);
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
        await this.updateRoomListToMain();
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
    async handleLeaveRoomEvent(socket) {
        const event = 'leave-room';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player) {
            throw new ws_exception_filter_1.SocketException('잘못된 요청입니다.', 400, event);
        }
        await this.RemovePlayerFormRoom(requestUser, socket);
        const updateRoom = await this.updateRoom(requestUser.player.roomInfo);
        await this.announceUpdateRoomInfo(updateRoom, requestUser, 'leave');
    }
    async handleReadyEvent(socket) {
        const event = 'ready';
        const requestUser = await this.socketAuthentication(socket.id, event);
        if (!requestUser.player || requestUser.player.isHost) {
            throw new ws_exception_filter_1.SocketException('잘못된 접근입니다.', 400, event);
        }
        await this.playersService.setPlayerReady(requestUser.player);
        const room = await this.roomService.updateIsGameReadyToStart(requestUser.player.roomInfo);
        await this.updateRoomInfoToRoom(requestUser, room, event);
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
        let turnCount = 0;
        let turn = await this.gamesService.createTurn(room.roomId);
        await this.gameTimer(room, 'startCount', turn);
        while (turnCount < room.players.length) {
            await this.gameTimer(room, 'readyTime', turn);
            await this.gameTimer(room, 'speechTime', turn);
            room = await this.roomService.getOneRoomByRoomId(room.roomId);
            if (!room) {
                throw new ws_exception_filter_1.SocketException('방이 존재하지 않습니다.', 500, 'start');
            }
            let nextTurn = turn;
            if (turn.turn < room.players.length) {
                nextTurn = await this.gamesService.createTurn(room.roomId);
            }
            await this.gameTimer(room, 'discussionTime', turn, nextTurn);
            room = await this.roomService.getOneRoomByRoomId(room.roomId);
            if (!room) {
                throw new ws_exception_filter_1.SocketException('방이 존재하지 않습니다.', 500, 'start');
            }
            turn = nextTurn;
            turnCount++;
        }
    }
    timer(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    async gameTimer(room, eventName, turn, nextTurn) {
        room = await this.roomService.getOneRoomByRoomId(room.roomId);
        if (!room) {
            throw new ws_exception_filter_1.SocketException('방이 존재하지 않습니다.', 500, 'start');
        }
        const roomId = room.roomId;
        const timer = eventName === 'startCount' ? 10000 : room[eventName];
        const event = eventName === 'startCount' ? eventName : `${eventName}r`;
        turn = await this.gamesService.updateTurn(turn, eventName);
        if (event === 'readyTimer') {
            const turnInfo = {
                currentTurn: turn.turn,
                speechPlayer: turn.speechPlayer,
                keyword: turn.keyword,
                hint: turn.hint,
            };
            this.server.to(`${roomId}`).emit('game-info', { data: turnInfo });
        }
        this.server.to(`${roomId}`).emit('time-start', {
            data: {
                currentTurn: turn.turn,
                timer,
                event,
            },
        });
        await this.timer(timer);
        let key = 'currentTurn';
        if (event === 'discussionTimer') {
            const turnResult = await this.gamesService.recordSpeechPlayerScore(roomId, turn.turn, turn.speechPlayer, turn.speechPlayerNickname);
            this.server
                .to(`${roomId}`)
                .emit('score', { data: { userId: turn.speechPlayer, score: turnResult.score } });
            key = 'nextTurn';
            if (turn === nextTurn) {
                nextTurn.turn = 0;
            }
        }
        const data = {
            timer,
            event,
        };
        data[key] = key === 'currentTurn' ? turn.turn : nextTurn.turn;
        this.server.to(`${roomId}`).emit('time-end', { data });
        if (event === 'discussionTimer' && !nextTurn.turn) {
            const roomInfo = await this.gamesService.handleGameEndEvent(room);
            const updateRoom = (0, update_room_info_constructor_1.updateRoomInfoConstructor)(roomInfo);
            this.server.to(`${updateRoom.roomId}`).emit('update-room', {
                data: { room: updateRoom, eventUserInfo: null, event: 'game-end' },
            });
            this.updateRoomListToMain;
        }
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
    async RemovePlayerFormRoom(requestUser, socket) {
        socket.leave(`${requestUser.player.roomInfo}`);
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
        if (roomUpdate.state === 'updated') {
            await this.updateRoomInfoToRoom(requestUser, roomUpdate.room, event);
        }
        await this.updateRoomListToMain();
    }
    async updateRoomInfoToRoom(requestUser, room, event) {
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
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_e = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _e : Object)
], GamesGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('log-in'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "socketIdMapToLoginUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('log-out'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "socketIdMapToLogOutUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('create-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _k : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleCreateRoomRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('enter-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _l : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleEnterRoomRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('valid-room-password'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _m : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleValidRoomPassword", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _o : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleLeaveRoomEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ready'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _p : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleReadyEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _q : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleStartEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_r = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _r : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "sendChatRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('turn-evaluate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _s : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleTurnEvaluation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-ice'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_t = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _t : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleIce", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-offer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_u = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _u : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleOffer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-answer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_v = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _v : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_w = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _w : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handler", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('update-userstream'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_x = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _x : Object, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleChangeStream", null);
GamesGateway = __decorate([
    (0, common_1.UseFilters)(new ws_exception_filter_1.SocketExceptionFilter()),
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [typeof (_a = typeof room_service_1.RoomService !== "undefined" && room_service_1.RoomService) === "function" ? _a : Object, typeof (_b = typeof players_service_1.PlayersService !== "undefined" && players_service_1.PlayersService) === "function" ? _b : Object, typeof (_c = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _c : Object, typeof (_d = typeof games_service_1.GamesService !== "undefined" && games_service_1.GamesService) === "function" ? _d : Object])
], GamesGateway);
exports.GamesGateway = GamesGateway;


/***/ }),
/* 30 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/websockets");

/***/ }),
/* 31 */
/***/ ((module) => {

"use strict";
module.exports = require("socket.io");

/***/ }),
/* 32 */
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
exports.RoomService = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(13);
const room_entity_1 = __webpack_require__(33);
const ws_exception_filter_1 = __webpack_require__(37);
const player_entity_1 = __webpack_require__(34);
const score_map_1 = __webpack_require__(41);
let RoomService = class RoomService {
    constructor(roomRepository, playerRepository) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
    }
    async getAllRoomList() {
        const roomList = await this.roomRepository.find({ order: { updatedAt: 'DESC' } });
        return roomList.map((room) => {
            const { roomId, roomTitle, maxCount, players, isSecretRoom, isGameOn } = room;
            return {
                roomId,
                roomTitle,
                maxCount,
                participants: players.length,
                isSecretRoom,
                isGameOn,
            };
        });
    }
    async getOneRoomByRoomId(roomId) {
        return await this.roomRepository.findOne({
            where: { roomId },
            relations: { players: { socket: true } },
            order: { players: { createdAt: 'ASC' } },
        });
    }
    async getOneRoomByRoomIdWithTurnKeyword(roomId) {
        return await this.roomRepository.findOne({
            where: { roomId },
            select: { players: { userInfo: true }, turns: { keyword: true } },
        });
    }
    async removeRoomByRoomId(roomId) {
        return await this.roomRepository.softDelete(roomId);
    }
    async updateRoomStatusByRoomId(data) {
        return this.roomRepository.save(data);
    }
    async createRoom(room) {
        if (!room.roomTitle) {
            room.roomTitle = '같이 가치마인드 한 판 해요!';
        }
        if (room.isSecretRoom && !room.roomPassword) {
            throw new ws_exception_filter_1.SocketException('방 비밀번호를 입력해주세요.', 400, 'create-room');
        }
        if (room.roomPassword) {
            room.isSecretRoom = true;
        }
        const newRoom = Object.assign(Object.assign({}, room), { isGameOn: false, isGameReadyToStart: false });
        const roomInsert = await this.roomRepository.insert(newRoom);
        const roomId = roomInsert.identifiers[0].roomId;
        score_map_1.scoreMap[roomId] = {};
        return roomId;
    }
    async enterRoom(requestUser, requestRoom) {
        const room = await this.getOneRoomByRoomId(requestRoom.roomId);
        if (!room) {
            throw new ws_exception_filter_1.SocketException('요청하신 방을 찾을 수 없습니다.', 404, 'enter-room');
        }
        if (room.maxCount == room.players.length) {
            throw new ws_exception_filter_1.SocketException('정원초과로 방 입장에 실패했습니다.', 400, 'enter-room');
        }
        if (room.isSecretRoom) {
            if (!requestRoom.roomPassword || room.roomPassword !== requestRoom.roomPassword) {
                throw new ws_exception_filter_1.SocketException('방 비밀번호가 올바르지 않습니다.', 400, 'enter-room');
            }
        }
        let isHost;
        if (room.players.length === 0)
            isHost = true;
        else
            isHost = false;
        await this.playerRepository.insert({
            userInfo: requestUser.userInfo,
            socketInfo: requestUser.socketId,
            roomInfo: requestRoom.roomId,
            isReady: false,
            isHost,
        });
    }
    async validateRoomPassword(password, roomId) {
        const room = await this.getOneRoomByRoomId(roomId);
        if (!room) {
            throw new ws_exception_filter_1.SocketException('요청하신 방을 찾을 수 없습니다.', 404, 'valid-room-password');
        }
        if (room.isSecretRoom) {
            if (room.roomPassword !== password) {
                throw new ws_exception_filter_1.SocketException('방 비밀번호가 올바르지 않습니다.', 400, 'valid-room-password');
            }
        }
    }
    async updateIsGameReadyToStart(roomId) {
        let room = await this.getOneRoomByRoomId(roomId);
        if (room.players.length === 1) {
            await this.updateRoomStatusByRoomId({
                roomId: room.roomId,
                isGameReadyToStart: false,
            });
            room = await this.getOneRoomByRoomId(room.roomId);
        }
        if (room.players.length > 1) {
            const isAllPlayerReadyToStart = (() => {
                for (const player of room.players) {
                    if (!player.isHost && !player.isReady)
                        return false;
                }
                return true;
            })();
            if (isAllPlayerReadyToStart !== room.isGameReadyToStart) {
                await this.updateRoomStatusByRoomId({
                    roomId: room.roomId,
                    isGameReadyToStart: isAllPlayerReadyToStart,
                });
            }
            room = await this.getOneRoomByRoomId(room.roomId);
        }
        return room;
    }
    async updateIsGameOn(roomId) {
        let room = await this.getOneRoomByRoomId(roomId);
        for (const player of room.players) {
            if (!player.isHost && !player.isReady) {
                throw new ws_exception_filter_1.SocketException('모든 플레이어가 ready상태여야 게임을 시작할 수 있습니다.', 400, 'start');
            }
        }
        room = await this.updateRoomStatusByRoomId({
            roomId,
            isGameOn: true,
        });
        return await this.getOneRoomByRoomId(roomId);
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], RoomService);
exports.RoomService = RoomService;


/***/ }),
/* 33 */
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
exports.Room = void 0;
const typeorm_1 = __webpack_require__(13);
const player_entity_1 = __webpack_require__(34);
const turn_entity_1 = __webpack_require__(36);
let Room = class Room {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Room.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Room.prototype, "roomTitle", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint'),
    __metadata("design:type", Number)
], Room.prototype, "maxCount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "readyTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "speechTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "discussionTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "isSecretRoom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', width: 4 }),
    __metadata("design:type", Number)
], Room.prototype, "roomPassword", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "isGameOn", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "isGameReadyToStart", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Room.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Room.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ select: false }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Room.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => player_entity_1.Player, (player) => player.room, { eager: true }),
    __metadata("design:type", Array)
], Room.prototype, "players", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => turn_entity_1.Turn, (turn) => turn.room, { eager: true }),
    __metadata("design:type", Array)
], Room.prototype, "turns", void 0);
Room = __decorate([
    (0, typeorm_1.Entity)()
], Room);
exports.Room = Room;


/***/ }),
/* 34 */
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
const user_entity_1 = __webpack_require__(15);
const typeorm_1 = __webpack_require__(13);
const room_entity_1 = __webpack_require__(33);
const socketIdMap_entity_1 = __webpack_require__(35);
let Player = class Player {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'userInfo' }),
    __metadata("design:type", Number)
], Player.prototype, "userInfo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { eager: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userInfo' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Player.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'socketInfo' }),
    __metadata("design:type", String)
], Player.prototype, "socketInfo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => socketIdMap_entity_1.SocketIdMap, { onDelete: 'CASCADE', eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'socketInfo' }),
    __metadata("design:type", typeof (_b = typeof socketIdMap_entity_1.SocketIdMap !== "undefined" && socketIdMap_entity_1.SocketIdMap) === "function" ? _b : Object)
], Player.prototype, "socket", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'roomInfo' }),
    __metadata("design:type", Number)
], Player.prototype, "roomInfo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, (room) => room.roomId, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'roomInfo' }),
    __metadata("design:type", typeof (_c = typeof room_entity_1.Room !== "undefined" && room_entity_1.Room) === "function" ? _c : Object)
], Player.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Player.prototype, "isReady", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Player.prototype, "isHost", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Player.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Player.prototype, "updatedAt", void 0);
Player = __decorate([
    (0, typeorm_1.Entity)()
], Player);
exports.Player = Player;


/***/ }),
/* 35 */
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
exports.SocketIdMap = void 0;
const user_entity_1 = __webpack_require__(15);
const typeorm_1 = __webpack_require__(13);
const player_entity_1 = __webpack_require__(34);
let SocketIdMap = class SocketIdMap {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)('varchar'),
    __metadata("design:type", String)
], SocketIdMap.prototype, "socketId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userInfo' }),
    __metadata("design:type", Number)
], SocketIdMap.prototype, "userInfo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { onDelete: 'CASCADE', eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userInfo' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], SocketIdMap.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => player_entity_1.Player, (player) => player.socket),
    __metadata("design:type", typeof (_b = typeof player_entity_1.Player !== "undefined" && player_entity_1.Player) === "function" ? _b : Object)
], SocketIdMap.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], SocketIdMap.prototype, "createdAt", void 0);
SocketIdMap = __decorate([
    (0, typeorm_1.Entity)()
], SocketIdMap);
exports.SocketIdMap = SocketIdMap;


/***/ }),
/* 36 */
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
exports.Turn = void 0;
const typeorm_1 = __webpack_require__(13);
const room_entity_1 = __webpack_require__(33);
let Turn = class Turn {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Turn.prototype, "turnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'roomInfo' }),
    __metadata("design:type", Number)
], Turn.prototype, "roomInfo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, (room) => room.roomId, {
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'roomInfo' }),
    __metadata("design:type", typeof (_a = typeof room_entity_1.Room !== "undefined" && room_entity_1.Room) === "function" ? _a : Object)
], Turn.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint' }),
    __metadata("design:type", Number)
], Turn.prototype, "turn", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Turn.prototype, "currentEvent", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Turn.prototype, "speechPlayer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Turn.prototype, "speechPlayerNickname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Turn.prototype, "keyword", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Turn.prototype, "hint", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Turn.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ select: false }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Turn.prototype, "updatedAt", void 0);
Turn = __decorate([
    (0, typeorm_1.Entity)()
], Turn);
exports.Turn = Turn;


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketExceptionFilter = exports.SocketException = void 0;
const common_1 = __webpack_require__(7);
const websockets_1 = __webpack_require__(30);
const errors_1 = __webpack_require__(38);
const shared_utils_1 = __webpack_require__(39);
const constants_1 = __webpack_require__(40);
class SocketException extends errors_1.WsException {
    constructor(message, status, eventName) {
        super({ message, status, eventName });
        this.message = message;
        this.status = status;
        this.eventName = eventName;
    }
}
exports.SocketException = SocketException;
let SocketExceptionFilter = class SocketExceptionFilter extends websockets_1.BaseWsExceptionFilter {
    catch(exception, host) {
        const client = host.switchToWs().getClient();
        this.handleError(client, exception);
        const logger = new common_1.Logger('WsExceptionsHandler');
        logger.error(exception instanceof SocketException ? 'SocketException' : 'UnknownError', exception instanceof SocketException ? exception.eventName : 'unknownEvent', exception instanceof Error ? exception.stack : null);
    }
    handleError(client, exception) {
        if (!(exception instanceof SocketException)) {
            return this.handleUnknownError(exception, client);
        }
        const event = exception.eventName;
        const status = exception.status;
        const errorMessage = exception.message;
        const error = {
            errorMessage,
            status,
            event,
        };
        client.emit('error', { error });
    }
    handleUnknownError(exception, client) {
        console.log('handleUnknownError');
        const status = 500;
        client.emit('error', {
            status,
            message: constants_1.MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
        });
    }
    isExceptionObject(err) {
        return (0, shared_utils_1.isObject)(err) && !!err.message;
    }
};
SocketExceptionFilter = __decorate([
    (0, common_1.Catch)()
], SocketExceptionFilter);
exports.SocketExceptionFilter = SocketExceptionFilter;


/***/ }),
/* 38 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/websockets/errors");

/***/ }),
/* 39 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common/utils/shared.utils");

/***/ }),
/* 40 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/constants");

/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.scoreMap = void 0;
exports.scoreMap = {};


/***/ }),
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayersService = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(13);
const ws_exception_filter_1 = __webpack_require__(37);
const token_map_entity_1 = __webpack_require__(20);
const socketIdMap_entity_1 = __webpack_require__(35);
const player_entity_1 = __webpack_require__(34);
const todayResult_entity_1 = __webpack_require__(16);
const today_date_constructor_1 = __webpack_require__(21);
let PlayersService = class PlayersService {
    constructor(tokenMapRepository, socketIdMapRepository, playerRepository, todayResultRepository) {
        this.tokenMapRepository = tokenMapRepository;
        this.socketIdMapRepository = socketIdMapRepository;
        this.playerRepository = playerRepository;
        this.todayResultRepository = todayResultRepository;
    }
    async getUserBySocketId(socketId) {
        const user = await this.socketIdMapRepository.findOne({
            where: { socketId },
            relations: {
                player: { room: true },
            },
        });
        return user;
    }
    async getUserByUserID(userId) {
        const user = await this.socketIdMapRepository.findOne({
            where: { userInfo: userId },
            relations: { player: { room: true } },
        });
        return user;
    }
    async getPlayerBySocketId(socketInfo) {
        const player = await this.playerRepository.findOne({
            where: { socketInfo },
            relations: { room: true },
            select: { roomInfo: true },
        });
        return player;
    }
    async getAllPlayersUserIdByRoomID(roomId) {
        return await this.playerRepository.find({
            where: { roomInfo: roomId },
            select: { userInfo: true },
        });
    }
    async updatePlayerStatusByUserId(user) {
        return await this.playerRepository.save(user);
    }
    async updateAllPlayerStatusByUserId(users) {
        return await this.playerRepository.save(users);
    }
    async removeSocketBySocketId(socketId) {
        return await this.socketIdMapRepository.delete(socketId);
    }
    async removePlayerByUserId(userId) {
        return await this.playerRepository.delete(userId);
    }
    async socketIdMapToLoginUser(token, socketId) {
        const requestUser = await this.tokenMapRepository.findOneBy({ token });
        const userId = requestUser.userInfo;
        if (!userId) {
            throw new ws_exception_filter_1.SocketException('사용자 정보를 찾을 수 없습니다', 404, 'log-in');
        }
        if (await this.getUserBySocketId(socketId)) {
            throw new ws_exception_filter_1.SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
        }
        const prevLoinInfo = await this.getUserByUserID(userId);
        if (prevLoinInfo) {
            await this.removeSocketBySocketId(prevLoinInfo.socketId);
        }
        const user = { socketId, userInfo: userId };
        return await this.socketIdMapRepository.save(user);
    }
    async createTodayResult(userInfo) {
        const today = (0, today_date_constructor_1.getTodayDate)();
        const todayResult = await this.todayResultRepository.findOne({
            where: { userInfo, createdAt: (0, typeorm_2.MoreThan)(today) },
            cache: 5 * 60 * 1000,
        });
        if (!todayResult) {
            await this.todayResultRepository.save({ userInfo, todayScore: 0 });
            await this.todayResultRepository.findOne({
                where: { userInfo, createdAt: (0, typeorm_2.MoreThan)(today) },
                cache: 5 * 60 * 1000,
            });
        }
    }
    async setPlayerReady(player) {
        let user;
        if (!player.isReady) {
            user = { userInfo: player.userInfo, isReady: true };
        }
        else {
            user = { userInfo: player.userInfo, isReady: false };
        }
        return await this.updatePlayerStatusByUserId(user);
    }
};
PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __param(1, (0, typeorm_1.InjectRepository)(socketIdMap_entity_1.SocketIdMap)),
    __param(2, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(3, (0, typeorm_1.InjectRepository)(todayResult_entity_1.TodayResult)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object])
], PlayersService);
exports.PlayersService = PlayersService;


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.eventUserInfoConstructor = void 0;
function eventUserInfoConstructor(requestUser) {
    return {
        socketId: requestUser.socketId,
        userId: requestUser.userInfo,
        nickname: requestUser.user.nickname,
        profileImg: requestUser.user.profileImg,
    };
}
exports.eventUserInfoConstructor = eventUserInfoConstructor;


/***/ }),
/* 44 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatService = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(13);
const gameResult_entity_1 = __webpack_require__(18);
const room_entity_1 = __webpack_require__(33);
const turn_entity_1 = __webpack_require__(36);
const turnResult_entity_1 = __webpack_require__(19);
let ChatService = class ChatService {
    constructor(roomRepository, turnRepository, turnResultRepository, gameResultRepository) {
        this.roomRepository = roomRepository;
        this.turnRepository = turnRepository;
        this.turnResultRepository = turnResultRepository;
        this.gameResultRepository = gameResultRepository;
    }
    checkAnswer(message, room) {
        const currentTurn = room.turns.at(-1);
        if (message != currentTurn.keyword) {
            return false;
        }
        return true;
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(turn_entity_1.Turn)),
    __param(2, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __param(3, (0, typeorm_1.InjectRepository)(gameResult_entity_1.GameResult)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object])
], ChatService);
exports.ChatService = ChatService;


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateRoomInfoConstructor = void 0;
function updateRoomInfoConstructor(room) {
    const { roomId, roomTitle, maxCount, readyTime, speechTime, discussionTime, isSecretRoom, isGameOn, isGameReadyToStart, players, } = room;
    const participants = players.map((player) => {
        const { user, socketInfo, isReady, isHost } = player;
        const { userId, nickname, profileImg } = user;
        return { socketId: socketInfo, userId, nickname, profileImg, isReady, isHost };
    });
    const roomInfo = {
        roomId,
        roomTitle,
        maxCount,
        readyTime,
        speechTime,
        discussionTime,
        isSecretRoom,
        isGameOn,
        isGameReadyToStart,
        participants,
    };
    return roomInfo;
}
exports.updateRoomInfoConstructor = updateRoomInfoConstructor;


/***/ }),
/* 46 */
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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamesService = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const ws_exception_filter_1 = __webpack_require__(37);
const typeorm_2 = __webpack_require__(13);
const gameResult_entity_1 = __webpack_require__(18);
const todayResult_entity_1 = __webpack_require__(16);
const turn_entity_1 = __webpack_require__(36);
const turnResult_entity_1 = __webpack_require__(19);
const players_service_1 = __webpack_require__(42);
const room_service_1 = __webpack_require__(32);
const score_map_1 = __webpack_require__(41);
const today_date_constructor_1 = __webpack_require__(21);
const keywords = ['MVC패턴', 'OOP', 'STACK', 'QUEUE', '함수형 프로그래밍', '메모리 계층'];
let GamesService = class GamesService {
    constructor(roomService, playersService, turnRepository, turnResultRepository, gameResultRepository, todayResultRepository) {
        this.roomService = roomService;
        this.playersService = playersService;
        this.turnRepository = turnRepository;
        this.turnResultRepository = turnResultRepository;
        this.gameResultRepository = gameResultRepository;
        this.todayResultRepository = todayResultRepository;
    }
    async deleteTurnByRoomId(roomInfo) {
        await this.turnRepository.delete({ roomInfo });
    }
    async createTurnResult(turnResult) {
        return await this.turnResultRepository.save(turnResult);
    }
    async sumTurnScorePerPlayerByUserId(roomId, userId) {
        const { sum } = await this.turnResultRepository
            .createQueryBuilder('turnResult')
            .select('SUM(turnResult.score)', 'sum')
            .where('turnResult.roomId = :roomId', { roomId })
            .andWhere('turnResult.userId = :userId', { userId })
            .getRawOne();
        return Number(sum);
    }
    async updateGameResult(gameResultId, gameScore) {
        return await this.gameResultRepository.save({ gameResultId, gameScore });
    }
    async softDeleteGameResult(gameResultId) {
        return await this.gameResultRepository.softDelete(gameResultId);
    }
    async updateTodayResultByIncrement(todayResultId, gameScore) {
        return await this.todayResultRepository.increment({ todayResultId }, 'todayScore', gameScore);
    }
    async createGameResultPerPlayer(roomId) {
        const playersUserId = await this.playersService.getAllPlayersUserIdByRoomID(roomId);
        const today = (0, today_date_constructor_1.getTodayDate)();
        let data = [];
        for (let userId of playersUserId) {
            const todayResult = await this.todayResultRepository.findOne({
                where: { userInfo: userId.userInfo, createdAt: (0, typeorm_2.MoreThan)(today) },
            });
            data.push({
                roomId,
                userInfo: userId.userInfo,
                todayResultInfo: todayResult.todayResultId,
            });
        }
        await this.gameResultRepository.save(data);
    }
    async createTurn(roomId) {
        const room = await this.roomService.getOneRoomByRoomId(roomId);
        let index = room.turns.length;
        const newTurnData = {
            roomInfo: room.roomId,
            turn: index + 1,
            currentEvent: 'start',
            speechPlayer: room.players[index].userInfo,
            speechPlayerNickname: room.players[index].user.nickname,
            keyword: keywords[index],
            hint: null,
        };
        const turn = await this.turnRepository.save(newTurnData);
        score_map_1.scoreMap[roomId][turn.turn] = [];
        return turn;
    }
    async updateTurn(turn, timer) {
        turn.currentEvent = timer;
        return await this.turnRepository.save(turn);
    }
    async recordPlayerScore(user, roomId) {
        const room = await this.roomService.getOneRoomByRoomId(roomId);
        const currentTurn = room.turns.at(-1);
        const turnResults = await this.turnResultRepository.find({
            where: { roomId, turn: currentTurn.turn },
        });
        for (let result of turnResults) {
            if (user.nickname === result.nickname) {
                throw new ws_exception_filter_1.SocketException('정답을 이미 맞추셨습니다!', 400, 'send-chat');
            }
        }
        const myRank = turnResults.length;
        const score = 100 - myRank * 20;
        const gameResult = await this.gameResultRepository.findOne({
            where: {
                userInfo: user.userId,
                roomId: room.roomId,
            },
        });
        const turnResult = {
            gameResultInfo: gameResult.gameResultId,
            roomId: room.roomId,
            turn: currentTurn.turn,
            userId: user.userId,
            nickname: user.nickname,
            score,
            keyword: currentTurn.keyword,
            isSpeech: false,
        };
        return await this.createTurnResult(turnResult);
    }
    async saveEvaluationScore(roomId, data) {
        const { score, turn } = data;
        score_map_1.scoreMap[roomId][turn].push(score);
    }
    async recordSpeechPlayerScore(roomId, turn, userId, nickname) {
        const room = await this.roomService.getOneRoomByRoomIdWithTurnKeyword(roomId);
        const gameResult = await this.gameResultRepository.findOne({
            where: { userInfo: userId, roomId },
            select: { gameResultId: true },
        });
        const unevaluatedNum = room.players.length - 1 - score_map_1.scoreMap[roomId][turn].length;
        let sum = 0;
        for (let score of score_map_1.scoreMap[roomId][turn]) {
            sum += score;
        }
        const score = ((unevaluatedNum * 5 + sum) * 20) / (room.players.length - 1);
        const turnResult = {
            gameResultInfo: gameResult.gameResultId,
            roomId,
            turn,
            userId,
            nickname,
            score,
            keyword: room.turns[turn - 1].keyword,
            isSpeech: true,
        };
        return await this.createTurnResult(turnResult);
    }
    async handleGameEndEvent(room) {
        const playerUserIds = await this.gameResultRepository.find({
            where: { roomId: room.roomId },
            select: { gameResultId: true, userInfo: true, todayResultInfo: true },
        });
        for (let user of playerUserIds) {
            const sum = await this.sumTurnScorePerPlayerByUserId(room.roomId, user.userInfo);
            await this.updateGameResult(user.gameResultId, sum);
            await this.softDeleteGameResult(user.gameResultId);
            await this.updateTodayResultByIncrement(user.todayResultInfo, sum);
        }
        await this.deleteTurnByRoomId(room.roomId);
        let users = [];
        for (let player of room.players) {
            users.push({ userInfo: player.userInfo, isReady: false });
        }
        await this.playersService.updateAllPlayerStatusByUserId(users);
        await this.roomService.updateRoomStatusByRoomId({
            roomId: room.roomId,
            isGameReadyToStart: false,
            isGameOn: false,
        });
        return await this.roomService.getOneRoomByRoomId(room.roomId);
    }
};
GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(turn_entity_1.Turn)),
    __param(3, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __param(4, (0, typeorm_1.InjectRepository)(gameResult_entity_1.GameResult)),
    __param(5, (0, typeorm_1.InjectRepository)(todayResult_entity_1.TodayResult)),
    __metadata("design:paramtypes", [typeof (_a = typeof room_service_1.RoomService !== "undefined" && room_service_1.RoomService) === "function" ? _a : Object, typeof (_b = typeof players_service_1.PlayersService !== "undefined" && players_service_1.PlayersService) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _f : Object])
], GamesService);
exports.GamesService = GamesService;


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerMiddleware = void 0;
const common_1 = __webpack_require__(7);
let LoggerMiddleware = class LoggerMiddleware {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    use(request, response, next) {
        const { ip, method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';
        response.on('finish', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
        });
        next();
    }
};
LoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggerMiddleware);
exports.LoggerMiddleware = LoggerMiddleware;


/***/ }),
/* 48 */
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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(13);
const resultToData_interceptor_1 = __webpack_require__(49);
const gameResult_entity_1 = __webpack_require__(18);
const room_entity_1 = __webpack_require__(33);
const todayResult_entity_1 = __webpack_require__(16);
const turn_entity_1 = __webpack_require__(36);
const turnResult_entity_1 = __webpack_require__(19);
const token_map_entity_1 = __webpack_require__(20);
const user_entity_1 = __webpack_require__(15);
let AppController = class AppController {
    constructor(usersRepository, tokenMapRepository, todayResultRepository, gameResultRepository, turnResultRepository, turnRepository, roomRepository) {
        this.usersRepository = usersRepository;
        this.tokenMapRepository = tokenMapRepository;
        this.todayResultRepository = todayResultRepository;
        this.gameResultRepository = gameResultRepository;
        this.turnResultRepository = turnResultRepository;
        this.turnRepository = turnRepository;
        this.roomRepository = roomRepository;
    }
    greetings() {
        return `welcome to gachimind project nest server!`;
    }
    async createTestUser() {
        const users = [];
        for (let num = 1; num <= 6; num++) {
            users.push({
                email: `test${num}@email.com`,
                nickname: `테스트닉네임${num}`,
                profileImg: 'white-red',
                isFirstLogin: true,
            });
        }
        return await this.usersRepository.save(users);
    }
    async createTestToken() {
        const users = [];
        for (let num = 1; num <= 6; num++) {
            users.push({
                userInfo: num,
                token: `token${num}`,
            });
        }
        return await this.tokenMapRepository.save(users);
    }
    async createTodayResult() {
        const results = [];
        for (let num = 1; num <= 6; num++) {
            results.push({
                userInfo: num,
                todayScore: num * 1000,
            });
        }
        return await this.todayResultRepository.save(results);
    }
    async createGameResult() {
        const results = [];
        for (let num = 1; num <= 6; num++) {
            for (let userInfo = 1; userInfo <= 6; userInfo++) {
                results.push({
                    roomId: 1000 + num,
                    userInfo,
                    todayResultInfo: userInfo,
                });
            }
        }
        return await this.gameResultRepository.save(results);
    }
    async createTurnResult() {
        const keywords = ['MVC패턴', 'OOP', 'STACKE', 'QUEUE', '함수형 프로그래밍', '메모리 계층'];
        const results = [];
        for (let userId = 1; userId <= 6; userId++) {
            const gameResults = await this.gameResultRepository.find({
                where: { userInfo: userId },
                select: { gameResultId: true, roomId: true },
            });
            const user = await this.usersRepository.findOneBy({ userId });
            for (let gameResult of gameResults) {
                let turn = 1;
                while (turn <= 6) {
                    results.push({
                        gameResultInfo: gameResult.gameResultId,
                        roomId: gameResult.roomId,
                        userId,
                        turn,
                        nickname: user.nickname,
                        score: 20 * (userId - 1),
                        keyword: keywords[turn - 1],
                        isSpeech: turn === userId ? true : false,
                    });
                    turn++;
                }
            }
        }
        return await this.turnResultRepository.save(results);
    }
    async test() {
        const today = new Date();
        const date = today.toISOString().split('T')[0];
        return await this.turnResultRepository.countBy({
            createdAt: (0, typeorm_2.Raw)((dateTime) => `${dateTime} > :date`, { date }),
        });
        return this.gameResultRepository
            .createQueryBuilder('gameResult')
            .select('SUM(turnResults.score)', 'sum')
            .where('userInfo = :id', { id: 8 })
            .getRawMany();
    }
    async addUser({ nickname }) {
        const users = await this.usersRepository.findBy({
            nickname: (0, typeorm_2.Like)(`${nickname}%`),
        });
        if (users.length) {
            nickname = nickname + (users.length + 1);
        }
        return nickname;
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "greetings", null);
__decorate([
    (0, common_1.Get)('seed/user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createTestUser", null);
__decorate([
    (0, common_1.Get)('seed/token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createTestToken", null);
__decorate([
    (0, common_1.Get)('seed/result/today'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createTodayResult", null);
__decorate([
    (0, common_1.Get)('seed/result/game'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createGameResult", null);
__decorate([
    (0, common_1.Get)('seed/result/turn'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createTurnResult", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('test/user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addUser", null);
AppController = __decorate([
    (0, common_1.UseInterceptors)(resultToData_interceptor_1.ResultToDataInterceptor),
    (0, common_1.Controller)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __param(2, (0, typeorm_1.InjectRepository)(todayResult_entity_1.TodayResult)),
    __param(3, (0, typeorm_1.InjectRepository)(gameResult_entity_1.GameResult)),
    __param(4, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __param(5, (0, typeorm_1.InjectRepository)(turn_entity_1.Turn)),
    __param(6, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _f : Object, typeof (_g = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _g : Object])
], AppController);
exports.AppController = AppController;


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResultToDataInterceptor = void 0;
const common_1 = __webpack_require__(7);
const rxjs_1 = __webpack_require__(50);
let ResultToDataInterceptor = class ResultToDataInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => ({ data })));
    }
};
ResultToDataInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResultToDataInterceptor);
exports.ResultToDataInterceptor = ResultToDataInterceptor;


/***/ }),
/* 50 */
/***/ ((module) => {

"use strict";
module.exports = require("rxjs");

/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeywordModule = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const keyword_entities_1 = __webpack_require__(52);
const keyword_service_1 = __webpack_require__(53);
const keyword_controller_1 = __webpack_require__(56);
let KeywordModule = class KeywordModule {
};
KeywordModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([keyword_entities_1.Keyword])],
        controllers: [keyword_controller_1.KeywordController],
        providers: [keyword_service_1.KeywordService],
        exports: [typeorm_1.TypeOrmModule],
    })
], KeywordModule);
exports.KeywordModule = KeywordModule;


/***/ }),
/* 52 */
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Keyword = void 0;
const typeorm_1 = __webpack_require__(13);
let Keyword = class Keyword {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Keyword.prototype, "keywordId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Keyword.prototype, "keywordKor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Keyword.prototype, "keywordEng", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Keyword.prototype, "hint", void 0);
Keyword = __decorate([
    (0, typeorm_1.Entity)()
], Keyword);
exports.Keyword = Keyword;


/***/ }),
/* 53 */
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
exports.KeywordService = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(13);
const keyword_entities_1 = __webpack_require__(52);
const puppeteer = __webpack_require__(54);
const cheerio = __webpack_require__(55);
let KeywordService = class KeywordService {
    constructor(keywordRepository) {
        this.keywordRepository = keywordRepository;
    }
    async getData() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const urlList = [];
        const pageNumberToNumber = 200;
        for (let i = 1; i <= pageNumberToNumber; i++) {
            urlList.push(`https://terms.naver.com/list.naver?cid=42344&categoryId=42344&page=${i}`);
        }
        for (let i = 0; i < urlList.length; i++) {
            const tempPage = await browser.newPage();
            const URL = urlList[i];
            await page.goto(`${URL}`, {
                waitUntil: 'networkidle2',
            });
            await tempPage.waitForNetworkIdle;
            const content = await page.content();
            const $ = cheerio.load(content);
            const target = '//*[@id="content"]/div[4]';
            await page.waitForXPath(target);
            const lists = $('#content > div.list_wrap > ul > ');
            const data = lists.each((index, list) => {
                const word = $(list).find('div > div.subject > strong> a:nth-child(1)').html();
                const keywordKor = word.replace(/[^ㄱ-ㅎ|가-힣|'']/g, '');
                const wordExpEng = word.replace(/[^a-z|A-Z|0-9|'']/g, '');
                const saveData = this.keywordRepository.save({
                    keywordKor: keywordKor,
                    keywordEng: wordExpEng,
                });
            });
        }
        await browser.close();
    }
};
KeywordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(keyword_entities_1.Keyword)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], KeywordService);
exports.KeywordService = KeywordService;


/***/ }),
/* 54 */
/***/ ((module) => {

"use strict";
module.exports = require("puppeteer");

/***/ }),
/* 55 */
/***/ ((module) => {

"use strict";
module.exports = require("cheerio");

/***/ }),
/* 56 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeywordController = void 0;
const common_1 = __webpack_require__(7);
const keyword_service_1 = __webpack_require__(53);
let KeywordController = class KeywordController {
    constructor(keywordService) {
        this.keywordService = keywordService;
    }
    KeywordController() {
        return this.keywordService.getData();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeywordController.prototype, "KeywordController", null);
KeywordController = __decorate([
    (0, common_1.Controller)('keyword'),
    __metadata("design:paramtypes", [typeof (_a = typeof keyword_service_1.KeywordService !== "undefined" && keyword_service_1.KeywordService) === "function" ? _a : Object])
], KeywordController);
exports.KeywordController = KeywordController;


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(7);
const cron_service_1 = __webpack_require__(58);
const notion_service_1 = __webpack_require__(60);
const schedule_1 = __webpack_require__(59);
const player_entity_1 = __webpack_require__(34);
const room_entity_1 = __webpack_require__(33);
const typeorm_1 = __webpack_require__(9);
const games_module_1 = __webpack_require__(28);
const admin_controller_1 = __webpack_require__(62);
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [schedule_1.ScheduleModule.forRoot(), games_module_1.GamesModule, typeorm_1.TypeOrmModule.forFeature([player_entity_1.Player, room_entity_1.Room])],
        controllers: [admin_controller_1.AdminController],
        providers: [cron_service_1.CronService, notion_service_1.NotionService],
    })
], AdminModule);
exports.AdminModule = AdminModule;


/***/ }),
/* 58 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronService = void 0;
const common_1 = __webpack_require__(7);
const schedule_1 = __webpack_require__(59);
const notion_service_1 = __webpack_require__(60);
let CronService = class CronService {
    constructor(notionService) {
        this.notionService = notionService;
    }
    async actionPerMin() {
        await this.notionService.updateCurrentStat();
        await this.notionService.updateAccumulatedStat();
    }
    async actionPerHour() {
        await this.notionService.createCurrentStat();
        await this.notionService.createAccumulatedStat();
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "actionPerMin", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "actionPerHour", null);
CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof notion_service_1.NotionService !== "undefined" && notion_service_1.NotionService) === "function" ? _a : Object])
], CronService);
exports.CronService = CronService;


/***/ }),
/* 59 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/schedule");

/***/ }),
/* 60 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotionService = void 0;
const common_1 = __webpack_require__(7);
const client_1 = __webpack_require__(61);
const typeorm_1 = __webpack_require__(13);
const typeorm_2 = __webpack_require__(9);
const player_entity_1 = __webpack_require__(34);
const room_entity_1 = __webpack_require__(33);
const gameResult_entity_1 = __webpack_require__(18);
let NotionService = class NotionService {
    constructor(roomRepository, playerRepository, gameResultRepository) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
        this.gameResultRepository = gameResultRepository;
        this.notion = new client_1.Client({ auth: process.env.NOTION });
    }
    async createCurrentStat() {
        const KDate = new Date();
        KDate.setHours(KDate.getHours() + 9);
        const userCnt = (await this.playerRepository.find()).length;
        const gameCnt = (await this.roomRepository.find()).length;
        await this.notion.pages.create({
            parent: { database_id: '8dbda62147ca4990a401f23f9758879b' },
            properties: {
                '접속자 수': {
                    type: 'title',
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: `${userCnt}`,
                            },
                        },
                    ],
                },
                '게임 진행 수': {
                    type: 'rich_text',
                    rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: `${gameCnt}`,
                            },
                        },
                    ],
                },
                일시: {
                    type: 'date',
                    date: {
                        start: KDate.toISOString(),
                    },
                },
            },
        });
    }
    async updateCurrentStat() {
        const userCnt = (await this.playerRepository.find()).length;
        const gameCnt = (await this.roomRepository.find()).length;
        await this.notion.blocks.update({
            block_id: '93d362c6c9ec46f0a2724166d08cd6d2',
            callout: {
                icon: {
                    emoji: '🎮',
                },
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: `현재 진행 게임 수: ${gameCnt}개\n`,
                        },
                    },
                    {
                        type: 'text',
                        text: {
                            content: `현재 참여 유저 수: ${userCnt}명`,
                        },
                    },
                ],
            },
        });
    }
    async createAccumulatedStat() {
        const KDate = new Date();
        KDate.setHours(KDate.getHours() + 9);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 12);
        const userCnt = (await this.gameResultRepository.find({
            where: { createdAt: (0, typeorm_1.Between)(startDate, endDate) },
            withDeleted: true,
        })).length;
        const gameCnt = (await this.roomRepository.find({ withDeleted: true })).length;
        await this.notion.pages.create({
            parent: { database_id: 'e5eecf2093d04f2e9664d89fae0f6654' },
            properties: {
                '접속자 수': {
                    type: 'title',
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: `${userCnt}`,
                            },
                        },
                    ],
                },
                '게임 진행 수': {
                    type: 'rich_text',
                    rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: `${gameCnt}`,
                            },
                        },
                    ],
                },
                일시: {
                    type: 'date',
                    date: {
                        start: KDate.toISOString(),
                    },
                },
            },
        });
    }
    async updateAccumulatedStat() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 12);
        const userCnt = (await this.gameResultRepository.find({
            where: { createdAt: (0, typeorm_1.Between)(startDate, endDate) },
        })).length;
        const gameCnt = (await this.roomRepository.find({ withDeleted: true })).length;
        await this.notion.blocks.update({
            block_id: '5350b7cc90224f6e82eabc01d0f415d1',
            callout: {
                icon: {
                    emoji: '🎮',
                },
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: `누적 진행 게임 수: ${gameCnt}개\n`,
                        },
                    },
                    {
                        type: 'text',
                        text: {
                            content: `누적 참여 유저 수: ${userCnt}명`,
                        },
                    },
                ],
            },
        });
    }
    async updateBugReport(bugDate) {
        const KDate = new Date();
        KDate.setHours(KDate.getHours() + 9);
        await this.notion.pages.create({
            parent: { database_id: '1aaff6788711488fb640f20b9cae9e36' },
            properties: {
                제목: {
                    type: 'title',
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: `${bugDate.title}`,
                            },
                        },
                    ],
                },
                내용: {
                    type: 'rich_text',
                    rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: `${bugDate.content}`,
                            },
                        },
                    ],
                },
                일시: {
                    type: 'date',
                    date: {
                        start: KDate.toISOString(),
                    },
                },
            },
        });
    }
};
NotionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_2.InjectRepository)(player_entity_1.Player)),
    __param(2, (0, typeorm_2.InjectRepository)(gameResult_entity_1.GameResult)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _c : Object])
], NotionService);
exports.NotionService = NotionService;


/***/ }),
/* 61 */
/***/ ((module) => {

"use strict";
module.exports = require("@notionhq/client");

/***/ }),
/* 62 */
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
exports.AdminController = void 0;
const common_1 = __webpack_require__(7);
const create_bug_dto_1 = __webpack_require__(63);
const notion_service_1 = __webpack_require__(60);
let AdminController = class AdminController {
    constructor(notionService) {
        this.notionService = notionService;
    }
    async bugReport(Body) {
        if (!Body) {
            throw new common_1.HttpException('전송 실패.', 400);
        }
        await this.notionService.updateBugReport(Body);
        const message = '리포트가 전송되었습니다.';
        return { data: message };
    }
};
__decorate([
    (0, common_1.Post)('report'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_bug_dto_1.BugDto !== "undefined" && create_bug_dto_1.BugDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "bugReport", null);
AdminController = __decorate([
    (0, common_1.Controller)('api/admin'),
    __metadata("design:paramtypes", [typeof (_a = typeof notion_service_1.NotionService !== "undefined" && notion_service_1.NotionService) === "function" ? _a : Object])
], AdminController);
exports.AdminController = AdminController;


/***/ }),
/* 63 */
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BugDto = void 0;
const class_validator_1 = __webpack_require__(64);
class BugDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BugDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BugDto.prototype, "content", void 0);
exports.BugDto = BugDto;


/***/ }),
/* 64 */
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpExceptionFilter = void 0;
const common_1 = __webpack_require__(7);
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const errorMessage = exception.message;
        console.error(exception);
        response.status(status).json({
            errorMessage,
        });
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;


/***/ }),
/* 66 */
/***/ ((module) => {

"use strict";
module.exports = require("passport");

/***/ }),
/* 67 */
/***/ ((module) => {

"use strict";
module.exports = require("cookie-parser");

/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.winstonLogger = void 0;
const nest_winston_1 = __webpack_require__(69);
const winstonDaily = __webpack_require__(70);
const winston = __webpack_require__(71);
const logDir = __dirname + '/../../logs';
const dailyOptions = (level) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + `/${level}`,
        filename: `%DATE%.${level}.log`,
        maxFiles: 30,
        zippedArchive: true,
    };
};
exports.winstonLogger = nest_winston_1.WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'silly',
            format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), nest_winston_1.utilities.format.nestLike('가치마인드', {
                prettyPrint: true,
            })),
        }),
        new winstonDaily(dailyOptions('info')),
        new winstonDaily(dailyOptions('warn')),
        new winstonDaily(dailyOptions('error')),
    ],
});


/***/ }),
/* 69 */
/***/ ((module) => {

"use strict";
module.exports = require("nest-winston");

/***/ }),
/* 70 */
/***/ ((module) => {

"use strict";
module.exports = require("winston-daily-rotate-file");

/***/ }),
/* 71 */
/***/ ((module) => {

"use strict";
module.exports = require("winston");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("bd1bd2a8d19bdf242935")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			0: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			})['catch'](function(err) { if(err.code !== 'MODULE_NOT_FOUND') throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(0);
/******/ 	var __webpack_exports__ = __webpack_require__(3);
/******/ 	
/******/ })()
;