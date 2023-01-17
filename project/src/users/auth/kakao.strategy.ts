import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao-oauth2';
import { User } from '../entities/user.entity';
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
    ): Promise<{ user: User; isNewUser: boolean } | null> {
        return (
            (await this.usersService.validateUser({
                email: profile._json.kakao_account.email,
                nickname: profile._json.properties.nickname,
                profileImg: profile._json.properties.profile_image,
            })) || null
        );
    }
}
