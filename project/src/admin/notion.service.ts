import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../games/entities/player.entity';
import { Room } from '../games/entities/room.entity';
import { GameResult } from '../games/entities/gameResult.entity';
@Injectable()
export class NotionService {
    notion = new Client({ auth: process.env.NOTION });
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
        @InjectRepository(GameResult)
        private readonly gameResultRepository: Repository<GameResult>,
    ) {}

    //현재 데이터
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
    //누적 데이터
    async createAccumulatedStat() {
        const KDate = new Date();
        KDate.setHours(KDate.getHours() + 9);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 12);
        const userCnt = (
            await this.gameResultRepository.find({
                where: { createdAt: Between(startDate, endDate) },
                withDeleted: true,
            })
        ).length;
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
        const userCnt = (
            await this.gameResultRepository.find({
                where: { createdAt: Between(startDate, endDate) },
            })
        ).length;
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
}
