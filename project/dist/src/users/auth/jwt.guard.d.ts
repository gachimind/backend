import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users.service';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private jwtService;
    private userService;
    constructor(jwtService: JwtService, userService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    validate(token: string): Promise<any>;
}
export {};
