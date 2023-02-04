"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const notion_service_1 = require("./notion.service");
let CronService = class CronService {
    constructor(notionService) {
        this.notionService = notionService;
    }
    async actionPerMin() {
        await this.notionService.updateCurrentStat();
        await this.notionService.updateAccumulatedStat();
    }
    async actionPerHour() {
        await this.notionService.createCurrentStat();
        await this.notionService.createAccumulatedStat();
    }
};
CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notion_service_1.NotionService])
], CronService);
exports.CronService = CronService;
//# sourceMappingURL=cron.service.js.map