import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesGateway } from './games.gateway';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';
import { UsersModule } from 'src/users/users.module';
import { PlayersService } from './players.service';
import { Room } from './entities/room.entity';
import { Player } from './entities/player.entity';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';
import { GameResult } from './entities/gameResult.entity';
import { GamesService } from './games.service';
import { TodayResult } from './entities/todayResult.entity';
import { KeywordModule } from 'src/keyword/keyword.module';
import { GamesRepository } from './games.repository';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([
            Room,
            Player,
            SocketIdMap,
            Turn,
            TurnResult,
            GameResult,
            TodayResult,
        ]),
        KeywordModule,
    ],
    providers: [
        GamesGateway,
        RoomService,
        ChatService,
        PlayersService,
        GamesService,
        GamesRepository,
    ],
    exports: [GamesGateway, TypeOrmModule],
})
export class GamesModule {}
