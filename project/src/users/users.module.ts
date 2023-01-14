import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SessionSerializer } from './auth/kakao.serializer';
import { User } from './entities/user.entity';
import { KakaoAuthGuard } from './auth/kakao.guards';
import { KakaoStrategy } from './auth/kakao.strategy';
import { TokenMap } from './entities/token-map.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([User, TokenMap]), JwtModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        SessionSerializer,
        KakaoAuthGuard, // 유저가 가져온 payload 입력값이 맞는지 확인
        KakaoStrategy, // 여기서 카카오 토큰을 가져와서 검증
        {
            provide: 'USER_SERVICE',
            useClass: UsersService,
        },
    ],
    exports: [TypeOrmModule],
})
export class UsersModule {}
