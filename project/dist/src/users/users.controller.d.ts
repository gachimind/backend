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
    }, res: Response): Promise<void>;
    handleLoginGithub(): {
        msg: string;
    };
    githubLoginRedirect(code: string, req: {
        user: CreateUserDto;
    }, res: Response): Promise<void>;
    logout(headers: any): Promise<{
        data: string;
    }>;
    getUserDetailsByToken(headers: any): Promise<{
        data: any;
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
        data: {
            Message: string;
        };
    }>;
    userInfoChange(headers: any, body: any): Promise<{
        data: {
            message: string;
        };
    }>;
}
