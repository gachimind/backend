import { ExecutionContext, Injectable, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService, private userService: UsersService) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { authorization } = request.headers;
        // const authorization = request.headers.authorization;
        if (authorization === undefined) {
            throw new HttpException('확인되지 않는 유저입니다.', HttpStatus.UNAUTHORIZED);
            // 토큰 전송 실패
        }

        const token = authorization.replace('Bearer ', '');
        const kakaoUserId: number = await this.validate(token);
        response.kakaoUserId = kakaoUserId;
        return true;
    }

    // 토큰 검증
    async validate(token: string) {
        try {
            const { kakaoUserId } = await this.userService.tokenValidate(token);
            return kakaoUserId;
        } catch (error) {
            switch (error.message) {
                // 토큰 오류 판단
                case 'invalid accessToken':
                    throw new HttpException('정상적인 접근이 아닙니다.', 401);
                // 유효하지 않은 토큰

                case 'jwt expired':
                    throw new HttpException('정상적인 접근이 아닙니다.', 410);
                // 토큰 만료

                // default:
                // throw new HttpException('서버 오류입니다.', 500);
            }
        }
    }
}
