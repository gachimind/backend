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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const common_2 = require("@nestjs/common");
const users_service_1 = require("../users.service");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(jwtService, userService) {
        super();
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { authorization } = request.headers;
        if (authorization === undefined) {
            throw new common_2.HttpException('토큰 전송 실패', common_1.HttpStatus.UNAUTHORIZED);
        }
        const tokenValue = authorization.replace('Bearer ', '');
        const kakaoUserId = await this.validate(tokenValue);
        response.kakaoUserId = kakaoUserId;
        return true;
    }
    async validate(token) {
        try {
            const { kakaoUserId } = await this.userService.tokenValidate(token);
            return kakaoUserId;
        }
        catch (error) {
            switch (error.message) {
                case 'invalid accessToken':
                    throw new common_2.HttpException('유효하지 않은 토큰입니다.', 401);
                case 'jwt expired':
                    throw new common_2.HttpException('토큰이 만료되었습니다.', 410);
                default:
                    throw new common_2.HttpException('서버 오류입니다.', 500);
            }
        }
    }
};
JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, users_service_1.UsersService])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=jwt.guard.js.map