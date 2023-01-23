import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class QuizService {
    async getData(pageNum: number) {
        const URL = `https://terms.naver.com/list.naver?cid=42344&categoryId=42344&page=${pageNum}`;
        const browser = await puppeteer.launch({
            // ignoreHTTPSErrors: true,
            // setRequestInterception 메소드 이용할 때 에러 방지
            headless: false,
            // 처음에는 false 설정해두고 브라우저를 직접 눈으로 보면서 실행되는 부분 확인 가능하고 나중에는 true로 바꿀 것
        });
        const page = await browser.newPage();
        await page.goto(URL, {
            waitUntil: 'networkidle2',
            // 페이지 렌더링을 완료하고 결과를 반환하는 방법과 시기 결정하는 옵션
            // 최소 500 ms 동안 2개 이상 네트워크 연결이 없을 때 탐색 완료된 것으로 간주
        });

        const results = await page.evaluate(() => {
            const propertyList = [];

            // document.querySelectorAll(
            //   'https://terms.naver.com/list.naver?cid=42344&categoryId=42344',
            // );

            const data = {
                word: document.querySelector(
                    '#content > div.list_wrap > ul > li:nth-child(1) > div > div.subject > strong > a:nth-child(1)',
                )?.textContent,
                hint: document.querySelector(
                    '#content > div.list_wrap > ul > li:nth-child(1) > div > p',
                )?.textContent,
            };

            const wordExp = data.word;
            const wordFinal = wordExp.replace(/[^ㄱ-ㅎ|가-힣|' ']/g, '');
            const hintExp = data.hint;
            const hintFinal = hintExp.replace(/[^a-z|A-Z|0-9|ㄱ-ㅎ|가-힣|' '|「」|()]/g, '');

            propertyList.push(wordFinal, hintFinal);
            return propertyList;
        });
        await browser.close();
        return results;
    }
}

// https://terms.naver.com/list.naver?cid=42344&categoryId=42344 >>> 컴퓨터인터넷IT용어대사전
// https://terms.naver.com/list.naver?cid=42344&categoryId=42344&page=2 >>> 컴퓨터인터넷IT용어대사전 (페이지 구분)
// https://terms.naver.com/entry.naver?docId=2038502&cid=42344&categoryId=42344 >>> 컴퓨터인터넷IT용어대사전 (단어 구분)

// 단어
// document.querySelector('#content > div.list_wrap > ul > li:nth-child(1) > div > div.subject > strong > a:nth-child(1)').innerHTML

// 설명
// document.querySelector('#size_ct > div:nth-child(1) > dl > dd:nth-child(2)').innerText
// document.querySelector('#content > div.list_wrap > ul > li:nth-child(1) > div > p').innerText
