import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao-oauth2';
import { CreateUserDto } from '../dto/create-user.dto';

// kakao-strategy
@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>('CLIENT_ID_KAKAO'), // restAPI key
            clientSecret: configService.get<string>('SECRET_KEY_KAKAO'), // client secret
            callbackURL: configService.get<string>('CALLBACK_KAKAO'), // redirect url
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        const user: CreateUserDto = {
            kakaoUserId: profile._json.id,
            githubUserId: null,
            email: profile._json.kakao_account.email || `email${profile._json.id}@gachimind.com`,
            nickname: profile._json.properties.nickname.substr(0, 9).replace(/ /g, ''),
            profileImg: 'white-red',
        };

        done(null, user);
    }
}
