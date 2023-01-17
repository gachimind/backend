"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KakaoStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_kakao_oauth2_1 = require("passport-kakao-oauth2");
const users_service_1 = require("../users.service");
let KakaoStrategy = class KakaoStrategy extends (0, passport_1.PassportStrategy)(passport_kakao_oauth2_1.Strategy) {
    constructor(usersService, configService) {
        super({
            clientID: configService.get('CLIENT_ID'),
            clientSecret: configService.get('SECRET_KEY'),
            callbackURL: configService.get('CALLBACK'),
        });
        this.usersService = usersService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        return ((await this.usersService.validateUser({
            email: profile._json.kakao_account.email,
            nickname: profile._json.properties.nickname,
            profileImg: profile._json.properties.profile_image,
        })) || null);
    }
};
KakaoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_SERVICE')),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService])
], KakaoStrategy);
exports.KakaoStrategy = KakaoStrategy;
//# sourceMappingURL=kakao.strategy.js.map