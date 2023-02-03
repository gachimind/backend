import { Repository } from 'typeorm';
import { Keyword } from './entities/keyword.entities';
export declare class KeywordService {
    private readonly keywordRepository;
    constructor(keywordRepository: Repository<Keyword>);
    cachingKeywords(): Promise<Keyword[]>;
    cachingKeywordsCount(): Promise<number>;
    generateRandomKeyword(selectNumber: number): Promise<Keyword[]>;
    getData(): Promise<void>;
}
