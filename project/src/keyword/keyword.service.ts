import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrimaryGeneratedColumn, Repository } from 'typeorm';
import { Keyword } from 'src/keyword/entities/keyword.entities';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

@Injectable()
export class KeywordService {
    constructor(
        @InjectRepository(Keyword)
        private readonly keywordRepository: Repository<Keyword>,
    ) {}

    async getData() {
        const browser = await puppeteer.launch({ headless: false });
        // 작동 중인 화면 보고 싶지 않을 때는 headless true로 변경할 것
        const page = await browser.newPage();

        const urlList = [];

        const pageNumberToNumber = 200;
        // 어디까지 크롤링할건지 페이지 수 지정해줄 것
        for (let i = 1; i <= pageNumberToNumber; i++) {
            urlList.push(`https://terms.naver.com/list.naver?cid=42344&categoryId=42344&page=${i}`);
        }

        for (let i = 0; i < urlList.length; i++) {
            const tempPage = await browser.newPage();

            const URL = urlList[i];

            await page.goto(`${URL}`, {
                waitUntil: 'networkidle2',
            });

            await tempPage.waitForNetworkIdle;

            const content = await page.content();
            const $ = cheerio.load(content);

            const target = '//*[@id="content"]/div[4]';
            await page.waitForXPath(target);

            const lists = $('#content > div.list_wrap > ul > ');
            const data = lists.each((index, list) => {
                const word = $(list).find('div > div.subject > strong> a:nth-child(1)').html();
                const keywordKor = word.replace(/[^ㄱ-ㅎ|가-힣|'']/g, '');
                const wordExpEng = word.replace(/[^a-z|A-Z|0-9|'']/g, '');

                const saveData = this.keywordRepository.save({
                    keywordKor: keywordKor,
                    keywordEng: wordExpEng,
                });
            });
        }
        await browser.close();
    }
}
