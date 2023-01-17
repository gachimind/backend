import { UsersService } from './users.service';
import { Request, Response } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    handleLogin(): {
        msg: string;
    };
    kakaoLoginRedirect(code: string, req: any, res: Response): Promise<any>;
    user(request: Request): boolean;
}
