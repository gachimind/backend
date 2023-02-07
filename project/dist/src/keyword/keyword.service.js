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
let KeywordService = class KeywordService {
    constructor(keywordRepository) {
        this.keywordRepository = keywordRepository;
    }
    async cachingKeywords() {
        const allKeywords = await this.keywordRepository.find({
            select: { keyword: true, hint: true, link: true },
            cache: 1000 * 60 * 60 * 24 * 7,
        });
        return allKeywords;
    }
    async cachingKeywordsCount() {
        const keywordsCount = await this.keywordRepository.count({
            cache: 1000 * 60 * 60 * 24 * 7,
        });
        return keywordsCount;
    }
    async generateRandomKeyword(selectNumber) {
        const allKeywords = await this.cachingKeywords();
        const count = await this.cachingKeywordsCount();
        const randomKeywordArray = [];
        const randomNumberArray = [];
        for (let i = 0; i < selectNumber; i++) {
            let randomNum = Math.floor(Math.random() * count);
            if (!randomNumberArray.includes(randomNum)) {
                randomNumberArray.push(randomNum);
                randomKeywordArray.push(allKeywords[randomNum]);
            }
        }
        return randomKeywordArray;
    }
    async getData() {
    }
};
KeywordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(keyword_entities_1.Keyword)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], KeywordService);
exports.KeywordService = KeywordService;
//# sourceMappingURL=keyword.service.js.map