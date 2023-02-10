"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
let RedisModule = class RedisModule {
};
RedisModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                isGlobal: true,
                useFactory: async (configService) => {
                    const store = await (0, cache_manager_redis_store_1.redisStore)({
                        socket: {
                            host: configService.get('REDIS_HOST'),
                            port: Number(configService.get('REDIS_PORT')),
                        },
                        username: configService.get('REDIS_USERNAME'),
                        password: configService.get('REDIS_PASSWORD'),
                        ttl: 30 + 60 + 30 + 5,
                    });
                    return { store: () => store };
                },
                inject: [config_1.ConfigService],
            }),
        ],
    })
], RedisModule);
exports.RedisModule = RedisModule;
//# sourceMappingURL=redis.module.js.map