import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';
declare const KakaoStrategy_base: new (...args: any[]) => any;
export declare class KakaoStrategy extends KakaoStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService, configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<{
        user: User;
        isNewUser: boolean;
    } | null>;
}
export {};
