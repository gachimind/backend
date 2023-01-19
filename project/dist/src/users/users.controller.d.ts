import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
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
    user(request: Request): boolean;
    getUserDetailsByToken(req: any, res: Response, headers: string): Promise<import("./entities/token-map.entity").TokenMap>;
}
