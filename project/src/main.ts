import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

declare const module: any;

// CORS 설정 추가해야 함!!
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    const port = process.env.PORT || 3000;
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

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
