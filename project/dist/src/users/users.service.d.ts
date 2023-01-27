import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { TokenMap } from './entities/token-map.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { TodayResult } from '../games/entities/todayResult.entity';
import { GameResult } from '../games/entities/gameResult.entity';
import { TurnResult } from '../games/entities/turnResult.entity';
export declare class UsersService {
    private readonly usersRepository;
    private readonly tokenMapRepository;
    private readonly todayResultRepository;
    private readonly gameResultRepository;
    private readonly TurnResultRepository;
    private jwtService;
    private configService;
    constructor(usersRepository: Repository<User>, tokenMapRepository: Repository<TokenMap>, todayResultRepository: Repository<TodayResult>, gameResultRepository: Repository<GameResult>, TurnResultRepository: Repository<TurnResult>, jwtService: JwtService, configService: ConfigService);
    createUser(details: CreateUserDto): Promise<User>;
    findUser(kakaoUserId: number, email: string, nickname: string): Promise<User>;
    validateUser(userData: CreateUserDto): Promise<{
        user: User;
        isNewUser: boolean;
    }>;
    createToken(user: User, isNewUSer: boolean): Promise<string>;
    tokenValidate(token: string): Promise<any>;
    getUserDetailsByToken(token: string): Promise<{
        userId: number;
        email: string;
        nickname: string;
        profileImg: string;
    }>;
    getUserKeywordByToken(token: string): Promise<{
        userId: number;
        todaySpeechKeyword: string[];
        todayQuizKeyword: string[];
        totalSpeechKeyword: string[];
        totalQuizKeyword: string[];
    }>;
}
