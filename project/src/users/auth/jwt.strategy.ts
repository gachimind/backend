import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Req } from '@nestjs/common/decorators';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('TOKEN_SECRETE_KEY'),
            ignoreExpiration: false,
        });
    }

    async validate(@Req() req, payload) {
        // 원하는 로직 추가할 수 있음.
        console.log('jwt strategy, token 값 찾기', req.user);

        return { userId: payload.userId }; // useGuards()를 사용한 http method의 req.user 값으로 들어옴
    }
}
