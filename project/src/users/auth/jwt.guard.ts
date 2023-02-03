import { CanActivate, ExecutionContext, Injectable, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpException } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private userService: UsersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;

        if (!authorization) {
            throw new HttpException('확인되지 않는 유저입니다.', HttpStatus.UNAUTHORIZED);
        }
        const token = authorization.replace('Bearer ', '');

        await this.userService.tokenValidate(token);

        return true;
    }
}
