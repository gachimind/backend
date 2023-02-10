import { createClient, RedisClientOptions } from 'redis';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.registerAsync<RedisClientOptions | any>({
            imports: [ConfigModule],
            isGlobal: true,
            useFactory: async (configService: ConfigService) => {
                const store = await redisStore({
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
            inject: [ConfigService],
        }),
    ],
})
export class RedisModule {}
