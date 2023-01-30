import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    private configService;
    constructor(usersService: UsersService, configService: ConfigService);
    handleLogin(): {
        msg: string;
    };
    kakaoLoginRedirect(code: string, req: {
        user: CreateUserDto;
    }, res: Response): Promise<{
        url: string;
    }>;
    logout(headers: any): Promise<{
        data: string;
    }>;
    getUserDetailsByToken(headers: any): Promise<{
        data: {
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
        };
    }>;
    userKeyword(headers: any): Promise<{
        data: {
            userId: number;
            todaySpeechKeyword: any[];
            todayQuizKeyword: any[];
            totalSpeechKeyword: any[];
            totalQuizKeyword: any[];
        };
    }>;
    overlapCheck(nickname: string): Promise<{
        message: string;
    }>;
}
