"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./users/users.module");
const games_module_1 = require("./games/games.module");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./users/entities/user.entity");
const token_map_entity_1 = require("./users/entities/token-map.entity");
const room_entity_1 = require("./games/entities/room.entity");
const player_entity_1 = require("./games/entities/player.entity");
const socketIdMap_entity_1 = require("./games/entities/socketIdMap.entity");
const keyword_module_1 = require("./keyword/keyword.module");
const keyword_entities_1 = require("./keyword/entities/keyword.entities");
const turn_entity_1 = require("./games/entities/turn.entity");
const turnResult_entity_1 = require("./games/entities/turnResult.entity");
const gameResult_entity_1 = require("./games/entities/gameResult.entity");
const admin_module_1 = require("./admin/admin.module");
const todayResult_entity_1 = require("./games/entities/todayResult.entity");
const logger_middleware_1 = require("./logger/logger.middleware");
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
                synchronize: true,
                logging: false,
                keepConnectionAlive: true,
                charset: 'utf8mb4_general_ci',
                timezone: 'Z',
                cache: false,
            }),
            users_module_1.UsersModule,
            games_module_1.GamesModule,
            keyword_module_1.KeywordModule,
            passport_1.PassportModule.register({ session: true }),
            admin_module_1.AdminModule,
        ],
        providers: [config_1.ConfigService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map