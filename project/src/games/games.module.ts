import { Module } from '@nestjs/common';
import { GamesGateway } from './games.gateway';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';

@Module({
    providers: [GamesGateway, RoomService, ChatService],
    exports: [],
})
export class GamesModule {}
