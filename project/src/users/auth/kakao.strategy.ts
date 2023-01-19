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
            clientID: configService.get<string>('CLIENT_ID'), // restAPI key
            clientSecret: configService.get<string>('SECRET_KEY'), // client secret
            callbackURL: configService.get<string>('CALLBACK'), // redirect url
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        const user: CreateUserDto = {
            email: profile._json.kakao_account.email || null,
            nickname: profile._json.properties.nickname,
            profileImg: profile._json.properties.profile_image,
        };
        done(null, user);
    }
}
