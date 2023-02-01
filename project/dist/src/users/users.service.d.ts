import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { TokenMap } from './entities/token-map.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { TodayResult } from '../games/entities/todayResult.entity';
import { TurnResult } from '../games/entities/turnResult.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    private readonly tokenMapRepository;
    private readonly todayResultRepository;
    private readonly TurnResultRepository;
    private jwtService;
    private configService;
    constructor(usersRepository: Repository<User>, tokenMapRepository: Repository<TokenMap>, todayResultRepository: Repository<TodayResult>, TurnResultRepository: Repository<TurnResult>, jwtService: JwtService, configService: ConfigService);
    createUser(details: CreateUserDto): Promise<User>;
    findUserByNickname(nickname: string): Promise<User[]>;
    findUser(kakaoUserId: number, email: string): Promise<User>;
    validateUser(userData: CreateUserDto): Promise<User>;
    createToken(user: User): Promise<string>;
    tokenValidate(token: string): Promise<any>;
    logout(token: string): Promise<import("typeorm").DeleteResult>;
    getUserDetailsByToken(token: string): Promise<{
        userId: number;
        nickname: string;
        profileImg: string;
        isFirstLogin: boolean;
        today: {
            todayScore: number;
            todayRank: number;
        };
        total: {
            totalScore: number;
        };
    }>;
    getTodayScoreByUserId(userInfo: number): Promise<number>;
    getAllUserScore(userInfo: number): Promise<number>;
    getUserTotalScore(userInfo: number): Promise<number>;
    userKeyword(token: string): Promise<{
        userId: number;
        todaySpeechKeyword: any[];
        todayQuizKeyword: any[];
        totalSpeechKeyword: any[];
        totalQuizKeyword: any[];
    }>;
    overlapCheck(nickname: string): Promise<{
        Message: string;
    }>;
    updateUser(token: string, body: UpdateUserDto): Promise<User>;
}
