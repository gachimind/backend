import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotionService } from './notion.service';

@Injectable()
export class CronService {
    constructor(private readonly notionService: NotionService) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async actionPerMin() {
        await this.notionService.createAccumulatedStat();
        await this.notionService.updateAccumulatedStat();
    }
}
