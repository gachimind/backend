import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../games/entities/player.entity';
import { Room } from '../games/entities/room.entity';
@Injectable()
export class NotionService {
    notion = new Client({ auth: 'secret_Hwk7RlWNfSnZDxfiulsHx7oexMPLwaDXdhKt1DwibwS' });
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
    ) {}

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
}
