import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDetails } from './auth/kakao.data';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    validateUser(details: UserDetails): Promise<User>;
    findUserById(id: number): Promise<User>;
    getUserDetailsByUserId(id: number): Promise<User>;
}
