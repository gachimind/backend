import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { CreateUserDto } from '../dto/create-user.dto';

// kakao-strategy
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>('CLIENT_ID_GITHUB'), // restAPI key
            clientSecret: configService.get<string>('SECRET_KEY_GITHUB'), // client secret
            callbackURL: configService.get<string>('CALLBACK_GITHUB'), // redirect url
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        const user: CreateUserDto = {
            githubUserId: profile._json.id,
            kakaoUserId: null,
            email: profile._json.email || `email${profile._json.id}@gachimind.com`,
            nickname: profile.username.toString().replace(/ /g, '').substr(0, 9),
            profileImg: 'white-red',
        };
        done(null, user);
    }
}
