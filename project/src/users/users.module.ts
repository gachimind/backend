import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SessionSerializer } from './auth/kakao.serializer';
import { User } from './entities/user.entity';
import { KakaoAuthGuard } from './auth/kakao.guards';
import { KakaoStrategy } from './auth/kakao.strategy';
import { TokenMap } from './entities/token-map.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, TokenMap])],
    controllers: [UsersController],
    providers: [
        UsersService,
        SessionSerializer,
        KakaoAuthGuard,
        KakaoStrategy,
        {
            provide: 'USER_SERVICE',
            useClass: UsersService,
        },
    ],
    exports: [TypeOrmModule],
})
export class UsersModule {}
