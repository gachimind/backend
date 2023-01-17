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
const undefinedToNull_interceptor_1 = require("../common/interceptors/undefinedToNull.interceptor");
const resultToData_interceptor_1 = require("../common/interceptors/resultToData.interceptor");
const users_service_1 = require("./users.service");
const kakao_guards_1 = require("./auth/kakao.guards");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    handleLogin() {
        return { msg: 'Kakao-Talk Authentication' };
    }
    async kakaoLoginRedirect(code, req, res) {
        const user = await this.usersService.findUserById(req.user.kakaoUserId);
        if (user === null) {
            const createUser = await this.usersService.validateUser(req.user);
            const token = await this.usersService.createToken(createUser);
            res.redirect('http://localhost:3000/login?token=' + token);
            return token;
        }
        else {
            const token = await this.usersService.createToken(user);
            res.redirect('http://localhost:3000/login?token=' + token);
            return token;
        }
    }
    user(request) {
        if (!request.user)
            throw new common_1.HttpException('토큰 값이 일치하지 않습니다.', 401);
        return true;
    }
};
__decorate([
    (0, common_1.Get)('login/kakao'),
    (0, common_1.UseGuards)(kakao_guards_1.KakaoAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "handleLogin", null);
__decorate([
    (0, common_1.Get)('login/kakao/redirect'),
    (0, common_1.UseGuards)(kakao_guards_1.KakaoAuthGuard),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "kakaoLoginRedirect", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "user", null);
UsersController = __decorate([
    (0, common_1.UseInterceptors)(undefinedToNull_interceptor_1.UndefinedToNullInterceptor, resultToData_interceptor_1.ResultToDataInterceptor),
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map