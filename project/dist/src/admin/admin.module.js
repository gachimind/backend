"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const cron_service_1 = require("./cron.service");
const notion_service_1 = require("./notion.service");
const schedule_1 = require("@nestjs/schedule");
const player_entity_1 = require("../games/entities/player.entity");
const room_entity_1 = require("../games/entities/room.entity");
const typeorm_1 = require("@nestjs/typeorm");
const games_module_1 = require("../games/games.module");
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [schedule_1.ScheduleModule.forRoot(), games_module_1.GamesModule, typeorm_1.TypeOrmModule.forFeature([player_entity_1.Player, room_entity_1.Room])],
        providers: [cron_service_1.CronService, notion_service_1.NotionService],
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map