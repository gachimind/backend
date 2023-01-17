import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDetails } from './auth/kakao.data';
import { TokenMap } from './entities/token-map.entity';
export declare class UsersService {
    private readonly usersRepository;
    private readonly tokenMapRepository;
    constructor(usersRepository: Repository<User>, tokenMapRepository: Repository<TokenMap>);
    validateUser(details: UserDetails): Promise<User>;
    findUserById(userId: number): Promise<User>;
    getUserDetailsByUserId(userId: number): Promise<User>;
}
