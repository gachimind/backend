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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("./users.service");
const passport_1 = require("@nestjs/passport");
const jwt_guard_1 = require("./auth/jwt.guard");
let UsersController = class UsersController {
    constructor(usersService, configService) {
        this.usersService = usersService;
        this.configService = configService;
    }
    handleLogin() {
        return { msg: 'Kakao-Talk Authentication' };
    }
    async kakaoLoginRedirect(code, req, res) {
        if (!req.user) {
            throw new common_1.HttpException('회원 인증에 실패하였습니다.', 401);
        }
        const user = await this.usersService.validateUser(req.user);
        const token = await this.usersService.createToken(user);
        return { url: this.configService.get('REDIRECT') + token };
    }
    async logout(headers) {
        const token = headers.authorization.replace('Bearer ', '');
        await this.usersService.logout(token);
        const message = '로그아웃 되었습니다.';
        return { data: message };
    }
    async getUserDetailsByToken(headers) {
        const token = headers.authorization.replace('Bearer ', '');
        const data = await this.usersService.getUserDetailsByToken(token);
        return { data };
    }
    async userKeyword(headers) {
        const token = headers.authorization.replace('Bearer ', '');
        const data = await this.usersService.userKeyword(token);
        return { data };
    }
    async overlapCheck(nickname) {
        const overlapCheck = await this.usersService.overlapCheck(nickname);
        return overlapCheck;
    }
    async userInfoChange(headers, body) {
        const token = headers.authorization.replace('Bearer ', '');
        await this.usersService.updateUser(token, body);
        return { data: { message: '사용자 정보 변경에 성공하셨습니다.' } };
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    (0, common_1.Get)('login/kakao'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "handleLogin", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    (0, common_1.Get)('login/kakao/redirect'),
    (0, common_1.Redirect)('redirectUrl', 302),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "kakaoLoginRedirect", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/logout'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/me'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserDetailsByToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/me/keyword'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userKeyword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/:nickname'),
    __param(0, (0, common_1.Param)('nickname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "overlapCheck", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/me/update'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userInfoChange", null);
UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map