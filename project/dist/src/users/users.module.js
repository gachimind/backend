"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const kakao_serializer_1 = require("./auth/kakao.serializer");
const user_entity_1 = require("./entities/user.entity");
const kakao_strategy_1 = require("./auth/kakao.strategy");
const token_map_entity_1 = require("./entities/token-map.entity");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const jwt_guard_1 = require("./auth/jwt.guard");
const todayResult_entity_1 = require("../games/entities/todayResult.entity");
const gameResult_entity_1 = require("../games/entities/gameResult.entity");
const turnResult_entity_1 = require("../games/entities/turnResult.entity");
const github_strategy_1 = require("./auth/github.strategy");
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
        providers: [users_service_1.UsersService, kakao_strategy_1.KakaoStrategy, kakao_serializer_1.SessionSerializer, github_strategy_1.GithubStrategy, jwt_guard_1.JwtAuthGuard],
        exports: [typeorm_1.TypeOrmModule],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map