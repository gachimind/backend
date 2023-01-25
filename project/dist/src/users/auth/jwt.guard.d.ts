import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UsersService } from '../users.service';
export declare class JwtAuthGuard implements CanActivate {
    private userService;
    constructor(userService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
