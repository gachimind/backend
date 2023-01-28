import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { NotionService } from './notion.service';
import { ScheduleModule } from '@nestjs/schedule';
//import { CoreModule } from 'src/core/core.module';
//import { GameResultModule } from '../gameResult/gameResult.module';
@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [CronService, NotionService],
})
export class AdminModule {}
