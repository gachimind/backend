import { UsersService } from './users.service';
import { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    handleLogin(): {
        msg: string;
    };
    handleRedirect(code: string): {
        msg: string;
    };
    user(request: Request): {
        message: string;
        status: number;
    };
    getUserDetailsByUserId(userId: number): Promise<import("./entities/user.entity").User>;
}
