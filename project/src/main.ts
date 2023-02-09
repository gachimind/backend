import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptionFilters/http-exception.filter';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { winstonLogger } from './logger/winston.util';
import { RedisIoAdapter } from './redis/redis.adaptor';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: winstonLogger,
    });
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    const port = process.env.PORT || 3001;
    app.useWebSocketAdapter(redisIoAdapter);
    app.enableCors({
        origin: ['https://gachimind.com', 'http://localhost:3001'],
        methods: ['GET', 'POST', 'PATCH'],
        credentials: true,
    });
    app.use(cookieParser());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.use(passport.initialize());
    // swagger 설정(update할 때마다 버전 올려주기)
    const config = new DocumentBuilder()
        .setTitle('가치마인드 API 명세')
        .setDescription('가치마인드 HTTP API 명세서')
        .setVersion('1.0')
        .addCookieAuth('connect.sid')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(port);
    console.log(`listening on port ${port}`);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
