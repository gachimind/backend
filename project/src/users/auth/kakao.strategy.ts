import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao-oauth2';
import { UsersService } from '../users.service';

// kakao-strategy
@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('USER_SERVICE') private readonly usersService: UsersService,
        configService: ConfigService,
    ) {
        super({
            clientID: configService.get<string>('CLIENT_ID'), // restAPI key
            clientSecret: configService.get<string>('SECRET_KEY'), // client secret
            callbackURL: configService.get<string>('CALLBACK'), // redirect url
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
        const user = await this.usersService.validateUserByUserId({
            userId,
            email,
            nickname,
            profileImg,
        });
        return user || null;
    }
}
