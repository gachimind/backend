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
const gameResult_entity_1 = require("../games/entities/gameResult.entity");
let NotionService = class NotionService {
    constructor(roomRepository, playerRepository, gameResultRepository) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
        this.gameResultRepository = gameResultRepository;
        this.notion = new client_1.Client({ auth: process.env.NOTION });
    }
    async createCurrentStat() {
        const KDate = new Date();
        KDate.setHours(KDate.getHours() + 9);
        const userCnt = (await this.playerRepository.find()).length;
        const gameCnt = (await this.roomRepository.find()).length;
        await this.notion.pages.create({
            parent: { database_id: '8dbda62147ca4990a401f23f9758879b' },
            properties: {
                '접속자 수': {
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
                        start: KDate.toISOString(),
                    },
                },
            },
        });
    }
    async updateCurrentStat() {
        const userCnt = (await this.playerRepository.find()).length;
        const gameCnt = (await this.roomRepository.find()).length;
        await this.notion.blocks.update({
            block_id: '93d362c6c9ec46f0a2724166d08cd6d2',
            callout: {
                icon: {
                    emoji: '🎮',
                },
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: `현재 진행 게임 수: ${gameCnt}개\n`,
                        },
                    },
                    {
                        type: 'text',
                        text: {
                            content: `현재 참여 유저 수: ${userCnt}명`,
                        },
                    },
                ],
            },
        });
    }
    async createAccumulatedStat() {
        const KDate = new Date();
        KDate.setHours(KDate.getHours() + 9);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 12);
        const userCnt = (await this.gameResultRepository.find({
            where: { createdAt: (0, typeorm_1.Between)(startDate, endDate) },
            withDeleted: true,
        })).length;
        const gameCnt = (await this.roomRepository.find({ withDeleted: true })).length;
        await this.notion.pages.create({
            parent: { database_id: 'e5eecf2093d04f2e9664d89fae0f6654' },
            properties: {
                '접속자 수': {
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
                        start: KDate.toISOString(),
                    },
                },
            },
        });
    }
    async updateAccumulatedStat() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 12);
        const userCnt = (await this.gameResultRepository.find({
            where: { createdAt: (0, typeorm_1.Between)(startDate, endDate) },
        })).length;
        const gameCnt = (await this.roomRepository.find({ withDeleted: true })).length;
        await this.notion.blocks.update({
            block_id: '5350b7cc90224f6e82eabc01d0f415d1',
            callout: {
                icon: {
                    emoji: '🎮',
                },
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: `누적 진행 게임 수: ${gameCnt}개\n`,
                        },
                    },
                    {
                        type: 'text',
                        text: {
                            content: `누적 참여 유저 수: ${userCnt}명`,
                        },
                    },
                ],
            },
        });
    }
    async updateBugReport(bugDate) {
        const KDate = new Date();
        KDate.setHours(KDate.getHours() + 9);
        await this.notion.pages.create({
            parent: { database_id: '1aaff6788711488fb640f20b9cae9e36' },
            properties: {
                제목: {
                    type: 'title',
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: `${bugDate.title}`,
                            },
                        },
                    ],
                },
                내용: {
                    type: 'rich_text',
                    rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: `${bugDate.content}`,
                            },
                        },
                    ],
                },
                일시: {
                    type: 'date',
                    date: {
                        start: KDate.toISOString(),
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
    __param(2, (0, typeorm_2.InjectRepository)(gameResult_entity_1.GameResult)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], NotionService);
exports.NotionService = NotionService;
//# sourceMappingURL=notion.service.js.map