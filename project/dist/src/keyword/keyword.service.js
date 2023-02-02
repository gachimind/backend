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
exports.KeywordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const keyword_entities_1 = require("./entities/keyword.entities");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
let KeywordService = class KeywordService {
    constructor(keywordRepository) {
        this.keywordRepository = keywordRepository;
    }
    async getData() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const urlList = [];
        const pageNumberToNumber = 200;
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
};
KeywordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(keyword_entities_1.Keyword)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], KeywordService);
exports.KeywordService = KeywordService;
//# sourceMappingURL=keyword.service.js.map