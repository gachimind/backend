import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDetails } from './auth/kakao.data';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    validateUser(details: UserDetails): Promise<User>;
    findUserById(userId: number): Promise<User>;
    getUserDetailsByUserId(userId: number): Promise<User>;
}
