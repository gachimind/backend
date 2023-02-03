import { NotionService } from './notion.service';
export declare class CronService {
    private readonly notionService;
    constructor(notionService: NotionService);
    actionPerMin(): Promise<void>;
    actionPerHour(): Promise<void>;
}
