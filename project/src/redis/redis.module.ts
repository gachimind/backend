import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.registerAsync<any>({
            imports: [ConfigModule],
            isGlobal: true,
            useFactory: async (configService: ConfigService) => {
                const store = await redisStore({
                    socket: {
                        host: configService.get('REDIS_HOST'),
                        port: Number(configService.get('REDIS_PORT')),
                    },
                    ttl: 60 * 60 * 24,
                });
                return { store: () => store };
            },
            inject: [ConfigService],
        }),
    ],
})
export class RedisModule {}
