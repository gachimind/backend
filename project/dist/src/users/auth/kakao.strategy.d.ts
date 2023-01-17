import { UsersService } from '../users.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
declare const KakaoStrategy_base: new (...args: any[]) => any;
export declare class KakaoStrategy extends KakaoStrategy_base {
    private readonly usersService;
    private readonly userRepository;
    constructor(usersService: UsersService, userRepository: Repository<User>);
    validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any>;
}
export {};
