import {
    Controller,
    Get,
    UseInterceptors,
    Req,
    Res,
    UseGuards,
    Param,
    HttpException,
    Headers,
    Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { ResultToDataInterceptor } from 'src/common/interceptors/resultToData.interceptor';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './auth/jwt.guard';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private configService: ConfigService,
        private jwtAuthGuard: JwtAuthGuard,
    ) {}
    // 카카로 로그인
    @Get('login/kakao')
    @UseGuards(AuthGuard('kakao'))
    handleLogin() {
        return { msg: 'Kakao-Talk Authentication' };
    }

    @Get('login/kakao/redirect')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLoginRedirect(
        @Param('code') code: string,
        @Req() req: { user: CreateUserDto },
        @Res({ passthrough: true }) res: Response,
    ) {
        if (!req.user) {
            throw new HttpException('회원 인증에 실패하였습니다.', 401);
        }
        const { user, isNewUser }: { user: User; isNewUser: boolean } =
            await this.usersService.validateUser(req.user);
        const token: string = await this.usersService.createToken(user, isNewUser);
        return res
            .cookie('jwt', `Bearer ${token}`, { maxAge: 24 * 60 * 60 * 1000 /**1day*/ })
            .status(301)
            .redirect(this.configService.get('REDIRECT'));
    }

    @UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
    @Get('status')
    user(@Req() request: Request) {
        if (!request.user) throw new HttpException('토큰 값이 일치하지 않습니다.', 401);
        return true;
    }

    // // 회원 정보 상세 조회
    @UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
    @UseGuards(JwtAuthGuard)
    @Get('/me')
    async getUserDetailsByToken(@Req() req, @Res() res: Response) {
        const tokenParsing = req.headers.authorization;
        const token = tokenParsing.replace('Bearer ', '');
        const data = await this.usersService.getUserDetailsByToken(token);

        return res.status(200).json({ data });
    }
}
