import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SessionSerializer } from './auth/kakao.serializer';
import { User } from './entities/user.entity';
import { KakaoStrategy } from './auth/kakao.strategy';
import { TokenMap } from './entities/token-map.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/jwt.guard';
import { TodayResult } from 'src/games/entities/todayResult.entity';
import { GameResult } from 'src/games/entities/gameResult.entity';
import { TurnResult } from 'src/games/entities/turnResult.entity';
import { GithubStrategy } from './auth/github.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, TokenMap, TodayResult, GameResult, TurnResult]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('TOKEN_SECRETE_KEY'),
                signOptions: { expiresIn: '24h' },
            }),
        }),
        PassportModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, KakaoStrategy, SessionSerializer, GithubStrategy, JwtAuthGuard],
    exports: [TypeOrmModule],
})
export class UsersModule {}
