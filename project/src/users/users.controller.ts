import {
    Controller,
    Get,
    UseInterceptors,
    Req,
    Res,
    UseGuards,
    Param,
    HttpException,
} from '@nestjs/common';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { ResultToDataInterceptor } from 'src/common/interceptors/resultToData.interceptor';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { KakaoAuthGuard } from './auth/kakao.guards';

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
        @Req() req,
        @Res({ passthrough: true }) res: Response,
    ): Promise<any> {
        const user = await this.usersService.findUserById(req.user.userId);
        if (user === null) {
            // 유저가 없을때 회원가입 -> 로그인
            const createUser = await this.usersService.createUser(req.user);
            const accessToken = await this.usersService.createAccessToken(createUser);
            res.redirect('http://localhost:3000/login?accessToken=' + accessToken);
        } else {
            // 유저가 있을때
            const accessToken = await this.usersService.createAccessToken(user);
            res.redirect('http://localhost:3000/login?accessToken=' + accessToken);
        }
    }

    @Get('status')
    user(@Req() request: Request) {
        if (!request.user) throw new HttpException('토큰 값이 일치하지 않습니다.', 401);
        return true;
    }

    // 회원 정보 상세 조회
    @Get(':userId')
    getUserDetailsByUserId(@Param('userId') userId: number) {
        return this.usersService.getUserDetailsByUserId(userId);
    }
}
