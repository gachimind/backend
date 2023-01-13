import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AppController } from './app.controller';
import { PassportModule } from '@nestjs/passport';

// .env를 루트에 저장하지 않고 db에 저장해서 불러올때 사용
// const getEnv = () => {
//   //const response = await axios.get('/비밀키요청')
//   //return response.data
// };
// ConfigModule.forRoot({ isGlobal: true, load: [getEnv] })

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            port: 3306,
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            entities: [User],
            // migrations: [__dirname + '/migrations/*.ts'],
            // 처음 db를 생성할 때만 synchronize:true로 생성하고, 이 후에는 false로 바꿔야 함
            synchronize: false,
            logging: true,
            keepConnectionAlive: true,
            charset: 'utf8mb4_general_ci',
        }),
        UsersModule,
        GamesModule,
        PassportModule.register({ session: true }),
    ],
    controllers: [AppController],
    providers: [ConfigService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
