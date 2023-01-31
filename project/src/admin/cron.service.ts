import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotionService } from './notion.service';

@Injectable()
export class CronService {
    constructor(private readonly notionService: NotionService) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async actionPerMin() {
        await this.notionService.updateCurrentStat();
        await this.notionService.updateAccumulatedStat();
    }

    @Cron(CronExpression.EVERY_HOUR)
    async actionPerHour() {
        await this.notionService.createCurrentStat();
        await this.notionService.createAccumulatedStat();
    }
    // @Cron(CronExpression.EVERY_DAY_AT_1AM)
    // async actionPerDay() {
    //     await this.notionService.createAccumulatedStat();
    // }
}
