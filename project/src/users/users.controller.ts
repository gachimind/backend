import { Controller, Get, UseInterceptors, Req, UseGuards, Param } from '@nestjs/common';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { HttpException } from '@nestjs/common';
import { ResultToDataInterceptor } from 'src/common/interceptors/resultToData.interceptor';
import { UsersService } from './users.service';
import { Request } from 'express';
import { KakaoAuthGuard } from './auth/kakao.guards';

@UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    // 에러핸들링 -> throw new HttpException(message, status)

    // 카카오 로그인
    @Get('login/kakao')
    @UseGuards(KakaoAuthGuard)
    handleLogin() {
        return { msg: 'Kakao-Talk Authentication' };
    }

    // 카카오 로그인 리다이렉트
    @Get('login/kakao/redirect')
    @UseGuards(KakaoAuthGuard)
    handleRedirect(@Param('code') code: string) {
        return { msg: 'OK' };
    }

    @Get('status')
    user(@Req() request: Request) {
        if (!request.user) throw new HttpException('토큰값이 일치하지 않습니다.', 401);
        return { message: '토큰 인증이 완료되었습니다.', status: 202 };
    }

    // 유저 정보 조회
    @Get(':userId')
    getUserDetailsByUserId(@Param('userId') userId: number) {
        return this.usersService.getUserDetailsByUserId(userId);
    }
}
