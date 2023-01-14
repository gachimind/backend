/* eslint-disable @typescript-eslint/ban-types */
import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(@Inject('USER_SERVICE') private readonly usersService: UsersService) {
        super();
    }

    serializeUser(user: User, done: Function) {
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await this.usersService.findUserById(payload.id);
        return user ? done(null, user) : done(null, null);
    }
}
