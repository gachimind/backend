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
            clientSecret: process.env.SECRET_KEY, // client secret
            callbackURL: process.env.CALLBACK, // redirect url
        });
    }
    // 카카오에 요청할 때 필요한 cliendId / secret / callbackurl 등 입력

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
        // const user = await this.usersService.findUserById(userId);
        const payload = {
            userId,
            email,
            nickname,
            profileImg,
        };
        done(null, payload);
    }
    // 유저 검증을 kakao-oauth2를 통해서 한 다음
    // 카카오가 accessToken, refreshToken, profile을 서버에 전달
}
