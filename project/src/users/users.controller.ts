import { Controller, Get, Post, UseInterceptors, Req, Res, UseGuards, Param } from '@nestjs/common';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { HttpException } from '@nestjs/common';
import { ResultToDataInterceptor } from 'src/common/interceptors/resultToData.interceptor';
import { UsersService } from './users.service';
import { query, Request, Response } from 'express';
import { KakaoAuthGuard } from './auth/kakao.guards';

@UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    // 에러핸들링 -> throw new HttpException(message, status)

    // 카카오 로그인
    // @Get('login/kakao')
    // @UseGuards(KakaoAuthGuard)
    // handleLogin() {
    //     return { msg: 'Kakao-Talk Authentication' };
    // }

    // @Get('login/kakao')
    // @UseGuards(KakaoAuthGuard)
    // handleRedirect(@Param('code') code: string) {
    //     return { msg: 'OK' }; // 여기는 토큰값(바디값)
    // }

    // 코드 받아서 검증해서 토큰을 넘겨주는 API
    @Post('login/kakao')
    @UseGuards(KakaoAuthGuard)
    async kakaoLogin(@Param('code') code: string, @Req() req: Request, @Res() res: Response) {
        const { accessToken, refreshToken } = await this.usersService.kakaoLogin(
            req.headers.authorization,
        );
        res.cookie('accessToken', accessToken);
        res.cookie('refreshToken', refreshToken);
        res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }

    @Get('status')
    user(@Req() request: Request) {
        if (!request.user) throw new HttpException('토큰값이 일치하지 않습니다.', 401);
        return { message: '토큰 인증이 완료되었습니다.', status: 202 };
    }

    // 회원 정보 상세 조회
    @Get(':userId')
    getUserDetailsByUserId(@Param('userId') userId: number) {
        return this.usersService.getUserDetailsByUserId(userId);
    }
}
