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
        if (authorization === undefined) {
            throw new HttpException('토큰 전송 실패', HttpStatus.UNAUTHORIZED);
        }

        const tokenValue = authorization.replace('Bearer ', '');
        const userId: number = await this.validate(tokenValue);
        response.userId = userId;
        return true;
    }

    // 토큰 검증
    async validate(accessToken: string) {
        try {
            const { userId } = await this.userService.tokenValidate(accessToken);
            return userId;
        } catch (error) {
            switch (error.message) {
                // 토큰 오류 판단
                case 'invalid accessToken':
                    throw new HttpException('유효하지 않은 토큰입니다.', 401);

                case 'jwt expired':
                    throw new HttpException('토큰이 만료되었습니다.', 410);

                default:
                    throw new HttpException('서버 오류입니다.', 500);
            }
        }
    }
}
