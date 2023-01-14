import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users.service';
import { HttpException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_KEY'),
            ignoreExpiration: false,
        });
    }

    async validate(payload) {
        try {
            const user = await this.usersService.findUserById(payload.email);
            if (user) {
                return user;
            } else {
                throw new HttpException('해당하는 유저가 존재하지 않습니다.', 402);
            }
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }
}
