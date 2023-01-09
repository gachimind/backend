import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findByUserId(userId: number): Promise<User>;
    findByEmail(email: string): Promise<User>;
    createUser({ email, nickname, profileImg }: CreateUserDto): Promise<User>;
    remove(userId: string): Promise<void>;
}
