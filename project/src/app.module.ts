import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/logger.middleware';

// .env를 루트에 저장하지 않고 db에 저장해서 불러올때 사용
// const getEnv = () => {
//   //const response = await axios.get('/비밀키요청')
//   //return response.data
// };
// ConfigModule.forRoot({ isGlobal: true, load: [getEnv] })

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, GamesModule],
    controllers: [],
    providers: [ConfigService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
