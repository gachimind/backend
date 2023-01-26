import { Controller, Get } from '@nestjs/common';
import { KeywordService } from './keyword.service';

@Controller('keyword')
export class KeywordController {
    constructor(private keywordService: KeywordService) {}

    @Get()
    KeywordController() {
        return this.keywordService.getData();
    }
}
