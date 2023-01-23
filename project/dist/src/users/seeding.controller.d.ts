import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { TokenMap } from './entities/token-map.entity';
export declare class SeedingController {
    private readonly usersRepository;
    private readonly tokenMapRepository;
    constructor(usersRepository: Repository<User>, tokenMapRepository: Repository<TokenMap>);
    createTestUser(): Promise<import("typeorm").InsertResult>;
    createTestToken(): Promise<import("typeorm").InsertResult>;
}
