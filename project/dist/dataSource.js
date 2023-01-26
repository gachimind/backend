"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./src/users/entities/user.entity");
const token_map_entity_1 = require("./src/users/entities/token-map.entity");
const room_entity_1 = require("./src/games/entities/room.entity");
const player_entity_1 = require("./src/games/entities/player.entity");
const socketIdMap_entity_1 = require("./src/games/entities/socketIdMap.entity");
const turn_entity_1 = require("./src/games/entities/turn.entity");
const turnResult_entity_1 = require("./src/games/entities/turnResult.entity");
const gameResult_entity_1 = require("./src/games/entities/gameResult.entity");
require("dotenv/config");
const keyword_entities_1 = require("./src/keyword/entities/keyword.entities");
const todayResult_entity_1 = require("./src/games/entities/todayResult.entity");
const dataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [
        user_entity_1.User,
        token_map_entity_1.TokenMap,
        socketIdMap_entity_1.SocketIdMap,
        room_entity_1.Room,
        player_entity_1.Player,
        keyword_entities_1.Keyword,
        turn_entity_1.Turn,
        turnResult_entity_1.TurnResult,
        gameResult_entity_1.GameResult,
        todayResult_entity_1.TodayResult,
    ],
    synchronize: true,
    logging: true,
});
exports.default = dataSource;
//# sourceMappingURL=dataSource.js.map