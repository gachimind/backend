"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 21:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(7);
const passport_1 = __webpack_require__(22);
const jwt_1 = __webpack_require__(17);
const common_2 = __webpack_require__(7);
const users_service_1 = __webpack_require__(15);
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
            throw new common_2.HttpException('확인되지 않는 유저입니다.', common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = authorization.replace('Bearer ', '');
        const kakaoUserId = await this.validate(token);
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
                    throw new common_2.HttpException('정상적인 접근이 아닙니다.', 401);
                case 'jwt expired':
                    throw new common_2.HttpException('정상적인 접근이 아닙니다.', 410);
                default:
                    throw new common_2.HttpException('서버 오류입니다.', 500);
            }
        }
    }
};
JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _b : Object])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("b6d9e5ffcb36d4ae425a")
/******/ })();
/******/ 
/******/ }
;