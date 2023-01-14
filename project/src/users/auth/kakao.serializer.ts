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

// 클라이언트에 반환할 데이터를 변환하고 검사하기 위한 규칙 제공
// 즉 Serializer는 입력값을 검증하는 역할
// 유저가 가져온 payload 값을 검증
