import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersService;
    private readonly configService;
    constructor(usersService: UsersService, configService: ConfigService);
    validate(payload: any): Promise<import("../entities/user.entity").User>;
}
export {};
