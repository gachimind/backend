import { Cache } from 'cache-manager';
export declare class AppController {
    private readonly redis;
    constructor(redis: Cache);
    test(): Promise<void>;
    testGet(): Promise<unknown[]>;
}
