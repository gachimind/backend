import { Repository } from 'typeorm';
import { Keyword } from './entities/keyword.entities';
export declare class KeywordService {
    private readonly keywordRepository;
    constructor(keywordRepository: Repository<Keyword>);
    getData(): Promise<void>;
}
