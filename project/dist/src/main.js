"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/exceptionFilters/http-exception.filter");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const winston_util_1 = require("./logger/winston.util");
const redis_adaptor_1 = require("./redis/redis.adaptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: winston_util_1.winstonLogger,
    });
    const redisIoAdapter = new redis_adaptor_1.RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    const port = process.env.PORT || 3001;
    app.useWebSocketAdapter(redisIoAdapter);
    app.enableCors({
        origin: '*',
    });
    app.use(cookieParser());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.use(passport.initialize());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('가치마인드 API 명세')
        .setDescription('가치마인드 HTTP API 명세서')
        .setVersion('1.0')
        .addCookieAuth('connect.sid')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(port);
    console.log(`listening on port ${port}`);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
//# sourceMappingURL=main.js.map