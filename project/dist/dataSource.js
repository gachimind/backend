"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./src/users/user.entity");
require("dotenv/config");
const dataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [user_entity_1.User],
    migrations: [__dirname + '/src/migrations/*.ts'],
    synchronize: true,
    logging: true,
});
exports.default = dataSource;
//# sourceMappingURL=dataSource.js.map