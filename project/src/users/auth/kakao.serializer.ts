/* eslint-disable @typescript-eslint/ban-types */
import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(@Inject(UsersService) private readonly usersService: UsersService) {
        super();
    }

    serializeUser(user: User, done: Function) {
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        // payload가 토큰 payload를 의미하는지?? 확인 필요!!
        const user = await this.usersService.findUser(payload.kakaoUserId, payload.email);
        return user ? done(null, user) : done(null, null);
    }
}
