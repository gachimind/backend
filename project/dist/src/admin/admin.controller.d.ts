import { BugDto } from './create-bug.dto';
import { NotionService } from './notion.service';
export declare class AdminController {
    private readonly notionService;
    constructor(notionService: NotionService);
    bugReport(Body: BugDto): Promise<{
        data: string;
    }>;
}
