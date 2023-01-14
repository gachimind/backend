"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 152:
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KakaoStrategy = void 0;
const common_1 = __webpack_require__(7);
const passport_1 = __webpack_require__(150);
const passport_kakao_oauth2_1 = __webpack_require__(153);
const users_service_1 = __webpack_require__(14);
let KakaoStrategy = class KakaoStrategy extends (0, passport_1.PassportStrategy)(passport_kakao_oauth2_1.Strategy, 'kakao') {
    constructor(usersService) {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.SECRET_KEY,
            callbackURL: process.env.CALLBACK,
        });
        this.usersService = usersService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const userId = profile._json.id;
        const email = profile._json.kakao_account.email;
        const nickname = profile._json.properties.nickname;
        const profileImg = profile._json.properties.profile_image;
        const user = await this.usersService.validateUser({
            userId,
            email,
            nickname,
            profileImg,
        });
        return user || null;
    }
};
KakaoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], KakaoStrategy);
exports.KakaoStrategy = KakaoStrategy;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("c1c2e97429e9d45892e4")
/******/ })();
/******/ 
/******/ }
;