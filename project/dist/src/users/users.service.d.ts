import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { TokenMap } from './entities/token-map.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    private readonly tokenMapRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, tokenMapRepository: Repository<TokenMap>, jwtService: JwtService);
    createUser(details: CreateUserDto): Promise<User>;
    findUserByNickNameOrEmail(nickname: string, email: string): Promise<User[]>;
    validateUser(userData: CreateUserDto): Promise<{
        user: User;
        isNewUser: boolean;
    }>;
    createToken(user: User, isNewUSer: boolean): Promise<string>;
    tokenValidate(token: string): Promise<any>;
    getUserInfoByToken(token: string): Promise<TokenMap>;
}
