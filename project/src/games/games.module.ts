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

@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([Room, Player, SocketIdMap])],
    providers: [GamesGateway, RoomService, ChatService, PlayersService],
    exports: [GamesGateway, TypeOrmModule],
})
export class GamesModule {}
