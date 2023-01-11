import {
    Controller,
    Get,
    Post,
    Delete,
    UseInterceptors,
    Body,
    Query,
    Req,
    UseGuards,
    Param,
} from '@nestjs/common';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { HttpException } from '@nestjs/common';
import { ResultToDataInterceptor } from 'src/common/interceptors/resultToData.interceptor';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { IsEmail } from 'class-validator';
import { Request } from 'express';
import { KakaoAuthGuard } from './auth/kakao.guards';

@UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    // 에러핸들링 -> throw new HttpException(message, status)

    @Get('login/kakao')
    @UseGuards(KakaoAuthGuard)
    handleLogin() {
        return { msg: 'Kakao-Talk Authentication' };
    }

    @Get('/login/kakao/redirect')
    @UseGuards(KakaoAuthGuard)
    handleRedirect(@Param('code') code: string) {
        return { msg: 'OK' };
    }

    @Get('status')
    user(@Req() request: Request) {
        if (!request.user) throw new HttpException('토큰값이 일치하지 않습니다.', 401);
        return { message: '토큰 인증이 완료되었습니다.', status: 202 };
    }
    // 에러 문구, status 어떻게 할지 혜연님과 상의

    @Get('/me')
    getUserDetailsByUserId(@Param('userId') userId: number) {
        return this.usersService.getUserDetailsByUserId(userId);
    }
}
