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
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, TokenMap]),
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
    providers: [
        UsersService,
        SessionSerializer,
        KakaoAuthGuard,
        KakaoStrategy,
        JwtStrategy,
        {
            provide: 'USER_SERVICE',
            useClass: UsersService,
        },
    ],
    exports: [TypeOrmModule],
})
export class UsersModule {}
