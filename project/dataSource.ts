import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { TokenMap } from './src/users/entities/token-map.entity';
import { Room } from './src/games/entities/room.entity';
import { Player } from './src/games/entities/player.entity';
import { SocketIdMap } from './src/games/entities/socketIdMap.entity';
import { Turn } from './src/games/entities/turn.entity';
import { TurnResult } from './src/games/entities/turnResult.entity';
import { GameResult } from './src/games/entities/gmaeResult.entity';
import 'dotenv/config';

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [User, TokenMap, SocketIdMap, Room, Player, Turn, TurnResult, GameResult],
    //migrations: [__dirname + '/src/migrations/*.ts'],
    // 처음 db를 생성할 때만 synchronize:true로 생성하고, 이 후에는 false로 바꿔야 함
    synchronize: true,
    logging: true,
});

export default dataSource;
