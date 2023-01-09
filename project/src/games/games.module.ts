import { Module } from '@nestjs/common';
import { GamesGateway } from './games.gateway';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule],
    providers: [GamesGateway, RoomService, ChatService],
    exports: [],
})
export class GamesModule {}
