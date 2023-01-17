import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Users } from '../models/users';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    ) {}
  
  async validateUser(user_email: string): Promise<any> {
    const user = await this.userService.findUserByEmail(user_email);
    if (!user) {
      return null;
    }
    return user;
  }

  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: process.env.TOKEN_SECRETE_KEY,
    });
  }

  async createAccessToken(user: Users) {
    const payload = {
      userId: user.userId,
      tokenType: 'accessToken',
    };
    const accessToken: string = this.jwtService.sign(payload, {
      secret: process.env.TOKEN_SECRETE_KEY,
      expiresIn: '1h',
    });
    return accessToken;
  }

  async createRefreshToken(user: Users): Promise<string>{
    const payload = {
      userId: null,
      tokenType: 'refreshToken',
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.TOKEN_SECRETE_KEY,
      expiresIn: '7D',
    }).toString();

    const findUser: Users = await this.userService.findUserById(user.userId);
    if (!findUser) {
      return null;
    }
    this.userService.createRefreshToken(findUser.userId, refreshToken);
    return refreshToken;
  }
}
