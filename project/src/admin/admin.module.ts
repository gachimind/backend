import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { NotionService } from './notion.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Player } from '../games/entities/player.entity';
import { Room } from '../games/entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { CoreModule } from 'src/core/core.module';
//import { GameResultModule } from '../gameResult/gameResult.module';
@Module({
    imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Player, Room])],
    providers: [CronService, NotionService],
})
export class AdminModule {}
