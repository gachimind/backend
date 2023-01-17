import * as dotenv from "dotenv";
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { NaverAuthGuard } from '../auth/guard/naver-auth.guard';
import {
  Controller,
  Get,
  Req,
  Request,
  Res,
  HttpCode,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { JwtRefreshGuard } from '../auth/guard/jwt-refreshToken-auth.guard';
import { Post, Param, Body } from '@nestjs/common';
import { createHash } from 'crypto';

dotenv.config();

@Controller('api/users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    ) {}

  // naver login
  @Get('/auth/naver')
  @HttpCode(200)
  @UseGuards(NaverAuthGuard)
  async NaverLogin() {
    return HttpStatus.OK;
  }

  // naver callback
  @Get('auth/naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(@Req() req, @Res() res: Response): Promise<any>{
    try {
      const user = await this.userService.findUserByEmail(req.user.email);
      if (user === null) {
      // 유저가 없을때 회원가입 -> 로그인
        const createUser = await this.userService.oauthCreateUser(req.user);
        const accessToken = await this.authService.createAccessToken(createUser);
        const refreshToken = await this.authService.createRefreshToken(createUser);
        return res
          .status(201)
          .json({ accessToken: "Bearer "+ accessToken,
                  refreshToken,
                  message: "로그인 성공" });
      }
      // 유저가 있을때
      const accessToken = await this.authService.createAccessToken(user);
      const refreshToken = await this.authService.createRefreshToken(user);
      return res
          .status(201)
          .json({ accessToken: "Bearer "+ accessToken,
                  refreshToken, 
                  message: "로그인 성공" });
    }catch(error){
      console.log(error);
      return res
        .status(412)
        .json({ errorMessage: "로그인 실패"});
    }
  }

  @Post(':userId/pinCode')
  @UseGuards(JwtAuthGuard)
  async registerPinCode(@Param('userId') userId: number,
  @Body('pinCode') pinCode: string,@Req() req, @Res() res: Response){
    try{
      if(userId != req.res.userId){
        throw new HttpException('허가되지 않은 접근입니다', 400);
      }
      const cryptoPinCode: string = createHash(process.env.ALGORITHM)
      .update(pinCode)
      .digest('base64');
      await this.userService.registerPinCode(userId, cryptoPinCode);
      return res
        .status(201)
        .json({ message: "핀 코드 등록 완료"});
    }catch(error){
      console.log(error);
      return res
        .status(400)
        .json({ errorMessage: "핀 코드 등록 실패"});
    }
  }
  
  
  // 리프레쉬 토큰을 이용한 엑세스 토큰 재발급하기
  @UseGuards(JwtRefreshGuard)
  @Post('pinCode')
  async accessTokenReissue(@Body('pinCode') pinCode: string,
  @Req() req, @Res() res: Response) {
    try {
      const cryptoPinCode: string = createHash(process.env.ALGORITHM)
      .update(pinCode)
      .digest('base64');
      const findUser = await this.userService.findUserByPinAndRefresh(req.headers.refreshToken, cryptoPinCode);
      if(findUser === null){
        throw new HttpException('pinCode가 잘못입력되었습니다', 401);
      }
      const accessToken = await this.authService.createAccessToken(findUser);
      return res
            .status(201)
            .json({ accessToken: "Bearer "+ accessToken,
                    message: "accessToken 재발급" });
    }catch(error){
      console.log(error);
    }
  }
}