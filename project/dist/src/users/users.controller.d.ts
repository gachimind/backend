import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { Response } from 'express';
import { JwtAuthGuard } from './auth/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    private configService;
    private jwtAuthGuard;
    constructor(usersService: UsersService, configService: ConfigService, jwtAuthGuard: JwtAuthGuard);
    handleLogin(): {
        msg: string;
    };
    kakaoLoginRedirect(code: string, req: {
        user: CreateUserDto;
    }, res: Response): Promise<void>;
    getUserDetailsByToken(req: any, res: Response): Promise<{
        userId: number;
        email: string;
        nickname: string;
        profileImg: string;
    }>;
}
