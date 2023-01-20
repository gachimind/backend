"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 53:
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeedingController = void 0;
const common_1 = __webpack_require__(7);
const undefinedToNull_interceptor_1 = __webpack_require__(12);
const resultToData_interceptor_1 = __webpack_require__(14);
const user_entity_1 = __webpack_require__(18);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(16);
const token_map_entity_1 = __webpack_require__(19);
let SeedingController = class SeedingController {
    constructor(usersRepository, tokenMapRepository) {
        this.usersRepository = usersRepository;
        this.tokenMapRepository = tokenMapRepository;
    }
    async createTestUser() {
        const user = [];
        for (let num = 1; num <= 6; num++) {
            user.push({
                email: `test${num}@email.com`,
                nickname: `테스트닉네임${num}`,
                profileImg: 'https://ichef.bbci.co.uk/news/640/cpsprodpb/E172/production/_126241775_getty_cats.png',
            });
        }
        return await this.usersRepository.insert(user);
    }
    async createTestToken() {
        const user = [];
        for (let num = 1; num <= 6; num++) {
            user.push({
                userInfo: num,
                token: `token${num}`,
            });
        }
        return await this.tokenMapRepository.insert(user);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedingController.prototype, "createTestUser", null);
__decorate([
    (0, common_1.Get)('token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedingController.prototype, "createTestToken", null);
SeedingController = __decorate([
    (0, common_1.UseInterceptors)(undefinedToNull_interceptor_1.UndefinedToNullInterceptor, resultToData_interceptor_1.ResultToDataInterceptor),
    (0, common_1.Controller)('api/users'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], SeedingController);
exports.SeedingController = SeedingController;


/***/ }),

/***/ 8:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
const users_service_1 = __webpack_require__(15);
const kakao_serializer_1 = __webpack_require__(23);
const user_entity_1 = __webpack_require__(18);
const kakao_strategy_1 = __webpack_require__(24);
const token_map_entity_1 = __webpack_require__(19);
const jwt_1 = __webpack_require__(17);
const passport_1 = __webpack_require__(22);
const config_1 = __webpack_require__(11);
const jwt_strategy_1 = __webpack_require__(26);
const jwt_guard_1 = __webpack_require__(21);
const seeding_controller_1 = __webpack_require__(53);
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, token_map_entity_1.TokenMap]),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('TOKEN_SECRETE_KEY'),
                    signOptions: { expiresIn: '24h' },
                }),
            }),
            passport_1.PassportModule,
        ],
        controllers: [users_controller_1.UsersController, seeding_controller_1.SeedingController],
        providers: [
            users_service_1.UsersService,
            kakao_serializer_1.SessionSerializer,
            kakao_strategy_1.KakaoStrategy,
            jwt_strategy_1.JwtStrategy,
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


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("2b27261b5cf62c4cbfe1")
/******/ })();
/******/ 
/******/ }
;