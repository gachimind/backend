import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao-oauth2';
import { UsersService } from '../users.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('USER_SERVICE')
        private readonly usersService: UsersService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.SECRET_KEY,
            callbackURL: process.env.CALLBACK,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any,
    ): Promise<any> {
        const userId = profile._json.id;
        const email = profile._json.kakao_account.email;
        const nickname = profile._json.properties.nickname;
        const profileImg = profile._json.properties.profile_image;
        const payload = {
            userId,
            email,
            nickname,
            profileImg,
        };
        done(null, payload);
    }
}
