import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    handleLogin(): {
        msg: string;
    };
    kakaoLoginRedirect(code: string, req: {
        user: {
            user: User;
            isNewUser: boolean;
        };
    }, res: Response): Promise<any>;
    user(request: Request): boolean;
}
