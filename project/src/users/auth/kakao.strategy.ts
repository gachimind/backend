import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao-oauth2';
import { UsersService } from '../users.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(
        @Inject('USER_SERVICE')
        private readonly usersService: UsersService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({
            clientID: process.env.CLIENT_ID, // restAPI key
            // clientSecret: process.env.SECRET_KEY, // client secret
            callbackURL: process.env.CALLBACK, // redirect url
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
        const user = await this.usersService.findUserById(userId);

        // 유저가 없을 때
        if (!user) {
            console.log('회원정보 저장 후 토큰 발급');
            const access_token = this.authService.createLoginToken(userId);
            const refresh_token = this.userService.makeRefreshToken(userId);
            const newUser = await this.userRepository.save({
                userId: userId,
                email: email,
                nickname: nickname,
                profileImg: profileImg,
                refresh_token: refreshToken,
            });
            await this.userService.CurrnetRefreshToken(refreshToken, user.userId);
            return { access_token, refresh_token };
        }

        // 유저가 있을 때
        console.log('로그인 토큰 발급');
        const access_token = await this.authService.createLoginToken(user);
        const refresh_token = await this.userService.makeRefreshToken(user);
        await this.userService.CurrnetRefreshToken(refreshToken, user.userId);
        return { access_token, refresh_token, nickname };
    }
}
