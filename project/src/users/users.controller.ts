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
        if (request.user) {
            return { msg: 'Authenticated' };
        } else {
            return { msg: 'Not Authenticated' };
        }
    }

    @Get('/me')
    findByUserId(@Param('userId') userId: number) {
        return this.usersService.findByUserId(userId);
    }
}
