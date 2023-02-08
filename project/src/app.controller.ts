import { CACHE_MANAGER, Controller, Inject, Get } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller('app')
export class AppController {
    constructor(@Inject(CACHE_MANAGER) private readonly redis: Cache) {}

    @Get('test')
    async test() {
        await this.redis.set('test', { key: [1, 2, 3] });
    }

    @Get('test/get')
    async testGet() {
        const cache = await this.redis.get('test');
        return [typeof cache, cache];
    }
}
