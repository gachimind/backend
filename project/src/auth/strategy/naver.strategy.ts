import { Strategy } from 'passport-naver';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const email = profile._json.email;
    const name = profile.displayName; //
    const nickname = profile._json.nickname;
    const image = profile._json.profile_image;  
    const loginCategory = profile.provider;  // "NAVER"
    const payload = {
      email,
      name,
      nickname,
      image,
      loginCategory,
    };
    done(null, payload);    // 실행 결과와 payload 리턴
  }
}