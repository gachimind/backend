import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
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
    user(request: Request): boolean;
    getUserDetailsByToken(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
