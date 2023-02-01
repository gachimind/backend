"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const games_gateway_1 = require("./games.gateway");
const room_service_1 = require("./room.service");
const chat_service_1 = require("./chat.service");
const users_module_1 = require("../users/users.module");
const players_service_1 = require("./players.service");
const room_entity_1 = require("./entities/room.entity");
const player_entity_1 = require("./entities/player.entity");
const socketIdMap_entity_1 = require("./entities/socketIdMap.entity");
const turn_entity_1 = require("./entities/turn.entity");
const turnResult_entity_1 = require("./entities/turnResult.entity");
const gameResult_entity_1 = require("./entities/gameResult.entity");
const games_service_1 = require("./games.service");
const todayResult_entity_1 = require("./entities/todayResult.entity");
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
//# sourceMappingURL=games.module.js.map