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
const logger_middleware_1 = require("./middlewares/logger.middleware");
const app_controller_1 = require("./app.controller");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./users/entities/user.entity");
const token_map_entity_1 = require("./users/entities/token-map.entity");
const room_entity_1 = require("./games/entities/room.entity");
const player_entity_1 = require("./games/entities/player.entity");
const socketIdMap_entity_1 = require("./games/entities/socketIdMap.entity");
const jwt_1 = require("@nestjs/jwt");
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
                entities: [user_entity_1.User, token_map_entity_1.TokenMap, room_entity_1.Room, player_entity_1.Player, socketIdMap_entity_1.SocketIdMap],
                synchronize: true,
                logging: true,
                keepConnectionAlive: true,
                charset: 'utf8mb4_general_ci',
            }),
            jwt_1.JwtModule,
            users_module_1.UsersModule,
            games_module_1.GamesModule,
            passport_1.PassportModule.register({ session: true }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [config_1.ConfigService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map