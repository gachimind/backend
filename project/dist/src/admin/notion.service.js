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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@notionhq/client");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const player_entity_1 = require("../games/entities/player.entity");
const room_entity_1 = require("../games/entities/room.entity");
let NotionService = class NotionService {
    constructor(roomRepository, playerRepository) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
        this.notion = new client_1.Client({ auth: 'secret_Hwk7RlWNfSnZDxfiulsHx7oexMPLwaDXdhKt1DwibwS' });
    }
    async createAccumulatedStat() {
        const userCnt = (await this.playerRepository.find()).length;
        console.log(userCnt);
        const gameCnt = (await this.roomRepository.find()).length;
        console.log(gameCnt);
        await this.notion.pages.create({
            parent: { database_id: '8dbda62147ca4990a401f23f9758879b' },
            properties: {
                '접속자 수(최대)': {
                    type: 'title',
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: `${userCnt}`,
                            },
                        },
                    ],
                },
                '게임 진행 수': {
                    type: 'rich_text',
                    rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: `${gameCnt}`,
                            },
                        },
                    ],
                },
                일시: {
                    type: 'date',
                    date: {
                        start: new Date().toISOString(),
                    },
                },
            },
        });
    }
};
NotionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_2.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], NotionService);
exports.NotionService = NotionService;
//# sourceMappingURL=notion.service.js.map