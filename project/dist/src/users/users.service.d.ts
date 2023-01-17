import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDetails } from './auth/kakao.data';
import { TokenMap } from './entities/token-map.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private readonly usersRepository;
    private readonly tokenMapRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(usersRepository: Repository<User>, tokenMapRepository: Repository<TokenMap>, jwtService: JwtService, configService: ConfigService);
    validateUser(details: UserDetails): Promise<User>;
    findUserById(kakaoUserId: number): Promise<User>;
    tokenValidate(token: string): Promise<any>;
    createToken(user: User): Promise<string>;
}
