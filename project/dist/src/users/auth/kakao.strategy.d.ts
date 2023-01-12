import { AuthService } from './auth.service';
declare const KakaoStrategy_base: new (...args: any[]) => any;
export declare class KakaoStrategy extends KakaoStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any>;
}
export {};
