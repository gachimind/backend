import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class AuthService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    validateUser(details: User): Promise<User>;
    findUserById(id: number): Promise<User>;
}
