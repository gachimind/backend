import { PassportSerializer } from '@nestjs/passport';
import { User } from '../user.entity';
import { UsersService } from '../users.service';
export declare class SessionSerializer extends PassportSerializer {
    private readonly usersService;
    constructor(usersService: UsersService);
    serializeUser(user: User, done: Function): void;
    deserializeUser(payload: any, done: Function): Promise<any>;
}
