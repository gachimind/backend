import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { BugDto } from './create-bug.dto';
import { NotionService } from './notion.service';

@Controller('api/admin')
export class AdminController {
    constructor(private readonly notionService: NotionService) {}

    @Post('report')
    async bugReport(@Body() data: BugDto) {
        if (!data) {
            throw new HttpException('전송 실패.', 400);
        }
        await this.notionService.updateBugReport(data);
        const message = '리포트가 전송되었습니다.';
        return { data: message };
    }
}
