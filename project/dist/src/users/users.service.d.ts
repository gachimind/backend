import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { TokenMap } from './entities/token-map.entity';
export declare class UsersService {
    private usersRepository;
    private tokenMapRepository;
    constructor(usersRepository: Repository<User>, tokenMapRepository: Repository<TokenMap>);
    getUserDetailsByUserId(id: number): Promise<User>;
}
