import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { NotionService } from './notion.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Player } from '../games/entities/player.entity';
import { Room } from '../games/entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from 'src/games/games.module';
import { AdminController } from './admin.controller';

@Module({
    imports: [ScheduleModule.forRoot(), GamesModule, TypeOrmModule.forFeature([Player, Room])],
    controllers: [AdminController],
    providers: [CronService, NotionService],
})
export class AdminModule {}
