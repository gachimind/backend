import {
    Body,
    Controller,
    Get,
    Headers,
    Req,
    Res,
    UseGuards,
    Param,
    HttpException,
    Redirect,
    Patch,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { Response } from 'express';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt.guard';

@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private configService: ConfigService,
    ) {}
    // 카카오 로그인 API
    @UseGuards(AuthGuard('kakao'))
    @Get('login/kakao')
    handleLogin() {
        return { msg: 'Kakao-Talk Authentication' };
    }

    @UseGuards(AuthGuard('kakao'))
    @Get('login/kakao/redirect')
    @Redirect('redirectUrl', 302)
    async kakaoLoginRedirect(
        @Param('code') code: string,
        @Req() req: { user: CreateUserDto },
        @Res({ passthrough: true }) res: Response,
    ) {
        if (!req.user) {
            throw new HttpException('회원 인증에 실패하였습니다.', 401);
        }
        const user: User = await this.usersService.validateUser(req.user);
        const token: string = await this.usersService.createToken(user);

        return { url: this.configService.get('REDIRECT') + token };
        // res.cookie('jwt', `Bearer ${token}`, { maxAge: 24 * 60 * 60 * 1000 /**1day*/ })
        //     .status(301)
        //     .redirect(this.configService.get('REDIRECT'));
    }

    @UseGuards(AuthGuard('github'))
    @Get('login/github')
    handleLoginGithub() {
        return { msg: 'Github Authentication' };
    }

    @UseGuards(AuthGuard('github'))
    @Get('login/github/redirect')
    @Redirect('redirectUrl', 302)
    async githubLoginRedirect(
        @Param('code') code: string,
        @Req() req: { user: CreateUserDto },
        @Res({ passthrough: true }) res: Response,
    ) {
        if (!req.user) {
            throw new HttpException('회원 인증에 실패하였습니다.', 401);
        }
        const user: User = await this.usersService.validateUser(req.user);
        const token: string = await this.usersService.createToken(user);

        return { url: this.configService.get('REDIRECT') + token };
        // res.cookie('jwt', `Bearer ${token}`, { maxAge: 24 * 60 * 60 * 1000 /**1day*/ })
        //     .status(301)
        //     .redirect(this.configService.get('REDIRECT'));
    }

    // 로그아웃 API
    @UseGuards(JwtAuthGuard)
    @Get('/logout')
    async logout(@Headers() headers) {
        const token = headers.authorization.replace('Bearer ', '');
        await this.usersService.logout(token);
        const message = '로그아웃 되었습니다.';
        return { data: message };
    }

    // 회원 정보 상세 조회 API
    @UseGuards(JwtAuthGuard)
    @Get('/me')
    async getUserDetailsByToken(@Headers() headers) {
        const token = headers.authorization.replace('Bearer ', '');
        const data = await this.usersService.getUserDetailsByToken(token);
        return { data };
    }

    // 회원 키워드 조회 API
    @UseGuards(JwtAuthGuard)
    @Get('/me/keyword')
    async userKeyword(@Headers() headers) {
        const token = headers.authorization.replace('Bearer ', '');
        const data = await this.usersService.userKeyword(token);

        return { data };
    }

    // 닉네임 중복확인 API
    @Get('/:nickname')
    async overlapCheck(@Param('nickname') nickname: string) {
        await this.usersService.overlapCheck(nickname);
        return { data: { Message: '사용 가능한 닉네임입니다.' } };
    }

    // 닉네임/캐릭터 수정 API
    @UseGuards(JwtAuthGuard)
    @Patch('/me')
    async userInfoChange(@Headers() headers, @Body() body) {
        const token: string = headers.authorization.replace('Bearer ', '');
        await this.usersService.updateUser(token, body);
        return { data: { message: '사용자 정보 변경에 성공하셨습니다.' } };
    }
}
