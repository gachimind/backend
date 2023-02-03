import { ConfigService } from '@nestjs/config';
declare const KakaoStrategy_base: new (...args: any[]) => any;
export declare class KakaoStrategy extends KakaoStrategy_base {
    constructor(configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<void>;
}
export {};
