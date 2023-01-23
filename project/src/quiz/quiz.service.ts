import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

@Injectable()
export class QuizService {
    async getData(pageNum: number) {
        const URL = `https://terms.naver.com/list.naver?cid=42344&categoryId=42344&page=${pageNum}`;
        const browser = await puppeteer.launch({
            // ignoreHTTPSErrors: true,
            // setRequestInterception 메소드 이용할 때 에러 방지
            headless: true,
            // 처음에는 false 설정해두고 브라우저를 직접 눈으로 보면서 실행되는 부분 확인 가능하고 나중에는 true로 바꿀 것
        });
        const page = await browser.newPage();
        await page.goto(URL, {
            waitUntil: 'networkidle2',
            // 페이지 렌더링을 완료하고 결과를 반환하는 방법과 시기 결정하는 옵션
            // 최소 500 ms 동안 2개 이상 네트워크 연결이 없을 때 탐색 완료된 것으로 간주
        });

        const content = await page.content();
        const $ = cheerio.load(content);
        const lists = $('#content > div.list_wrap > ul > ');

        const data = lists.each((index, list) => {
            const word = $(list).find('div > div.subject > strong> a:nth-child(1)').html();
            const wordExp = word.replace(/[^a-z|A-Z|0-9|ㄱ-ㅎ|가-힣|'']/g, '');
            const hint = $(list).find('div > p').html();
            const hintExp = hint.replace(/[^a-z|A-Z|0-9|ㄱ-ㅎ|가-힣|' '|「」|()]/g, '');
            const dataSet = [index, wordExp, hintExp];
            console.log(dataSet);
        });
        await browser.close();

        //     return results;
    }
}

// ()기준으로 스플릿해서 한글, 영어 분리해서 저장
// 셀레니움으로 한글단어, 영어단어, 정의(페이지 들어가서)

// https://terms.naver.com/list.naver?cid=42344&categoryId=42344 >>> 컴퓨터인터넷IT용어대사전
// https://terms.naver.com/list.naver?cid=42344&categoryId=42344&page=2 >>> 컴퓨터인터넷IT용어대사전 (페이지 구분)
// https://terms.naver.com/entry.naver?docId=2038502&cid=42344&categoryId=42344 >>> 컴퓨터인터넷IT용어대사전 (단어 구분)

//////////////////////////////////////////////////

// #content > div.list_wrap > ul > li:nth-child(1)
// #content > div.list_wrap > ul > li:nth-child(2)

// #content > div.list_wrap > ul > li:nth-child(1) > div > div.subject > strong
// #content > div.list_wrap > ul > li:nth-child(1) > div > div.subject > strong > a:nth-child(1)
// #content > div.list_wrap > ul > li:nth-child(1) > div > p

// #paginate > strong
// #paginate > a:nth-child(3)
// #paginate > a:nth-child(4)

//////////////////////////////////////////////////
