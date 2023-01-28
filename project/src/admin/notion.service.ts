import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
//import { createAccumulatedStatContext, createCurrentStatContext } from './notion-context-factory';

@Injectable()
export class NotionService {
    notion = new Client({ auth: 'secret_Hwk7RlWNfSnZDxfiulsHx7oexMPLwaDXdhKt1DwibwS' });
    constructor() {}

    hourlyMaxUserCnt = 0;
    hourlyMaxGameCnt = 0;

    async createAccumulatedStat() {
        await this.notion.pages.create({
            parent: { database_id: '8dbda62147ca4990a401f23f9758879b' },
            properties: {
                최대접속자수: {
                    //이름 값
                    title: [
                        //속성 값
                        {
                            text: {
                                //text 형식
                                content: 'Hello World!', //text에 들어갈 값
                            },
                        },
                    ],
                },
            },
        });
        console.log('Success! Entry added.');
    }
    //https://www.notion.so/Admin-Page-9f3cf322da9141bc9505e158126939d8#
    async updateAccumulatedStat() {
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
                            content: `누적 진행 게임 수: 개\n`,
                        },
                    },
                    {
                        type: 'text',
                        text: {
                            content: `누적 참여 유저 수: 명`,
                        },
                    },
                ],
            },
        });
    }
}
