import {
    Controller,
    Get,
    UseInterceptors,
    Req,
    Res,
    UseGuards,
    Param,
    Header,
    HttpException,
} from '@nestjs/common';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { ResultToDataInterceptor } from 'src/common/interceptors/resultToData.interceptor';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { KakaoAuthGuard } from './auth/kakao.guards';
import { JwtAuthGuard } from './auth/jwt.guard';
import { User } from './entities/user.entity';

@UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    // 카카로 로그인
    @Get('login/kakao')
    @UseGuards(KakaoAuthGuard)
    handleLogin() {
        return { msg: 'Kakao-Talk Authentication' };
    }

    @Get('login/kakao/redirect')
    @UseGuards(KakaoAuthGuard)
    async kakaoLoginRedirect(
        @Param('code') code: string,
        @Req() req: { user: { user: User; isNewUser: boolean } },
        @Res({ passthrough: true }) res: Response,
    ): Promise<any> {
        if (!req.user) {
            throw new HttpException('회원 인증에 실패하였습니다.', 401);
        }
        const { user, isNewUser } = req.user;
        const token: string = await this.usersService.createToken(user, isNewUser);
        res.cookie('jwt', `Bearer ${token}`, { maxAge: 24 * 60 * 60 * 1000 /**1day*/ });
        res.redirect('http://localhost:3000/api');
    }

    @Get('status')
    user(@Req() request: Request) {
        if (!request.user) throw new HttpException('토큰 값이 일치하지 않습니다.', 401);
        return true;
    }

    // // 회원 정보 상세 조회
    // @UseGuards(JwtAuthGuard)
    // @Get('/me')
    // getUserDetailsByToken(@Req() req) {
    //     const token = req.token;
    //     return this.usersService.getUserDetailsByToken(token);
    // }
}
