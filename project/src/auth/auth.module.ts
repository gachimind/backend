import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { NaverStrategy } from './strategy/naver.strategy';
import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => UserModule)
  ],
  providers: [AuthService, NaverStrategy, JwtService],
})
export class AuthModule {}
