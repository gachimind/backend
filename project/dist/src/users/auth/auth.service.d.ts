import { Repository } from 'typeorm';
import { User } from '../user.entity';
export declare class AuthService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    validateUser(details: User): Promise<User>;
    findUserById(userId: number): Promise<User>;
}
