import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao-oauth2';
import { UsersService } from '../users.service';

// kakao-strategy
@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject('USER_SERVICE') private readonly usersService: UsersService) {
        super({
            clientID: process.env.CLIENT_ID, // restAPI key
            clientSecret: process.env.SECRET_KEY, // client secret
            callbackURL: process.env.CALLBACK, // redirect url
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any,
    ): Promise<any> {
        const kakaoUserId = profile._json.id;
        const email = profile._json.kakao_account.email;
        const nickname = profile._json.properties.nickname;
        const profileImg = profile._json.properties.profile_image;
        const user = await this.usersService.validateUser({
            kakaoUserId,
            email,
            nickname,
            profileImg,
        });
        return user || null;
    }
}
