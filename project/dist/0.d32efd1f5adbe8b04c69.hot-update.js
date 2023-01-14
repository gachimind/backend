"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 25:
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KakaoStrategy = void 0;
const common_1 = __webpack_require__(7);
const passport_1 = __webpack_require__(23);
const passport_kakao_oauth2_1 = __webpack_require__(26);
const users_service_1 = __webpack_require__(14);
const typeorm_1 = __webpack_require__(15);
const typeorm_2 = __webpack_require__(9);
const user_entity_1 = __webpack_require__(16);
let KakaoStrategy = class KakaoStrategy extends (0, passport_1.PassportStrategy)(passport_kakao_oauth2_1.Strategy, 'kakao') {
    constructor(usersService, userRepository) {
        super({
            clientID: process.env.CLIENT_ID,
            callbackURL: process.env.CALLBACK,
        });
        this.usersService = usersService;
        this.userRepository = userRepository;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const userId = profile._json.id;
        const email = profile._json.kakao_account.email;
        const nickname = profile._json.properties.nickname;
        const profileImg = profile._json.properties.profile_image;
        const user = await this.usersService.findUserById(userId);
        if (!user) {
            console.log('회원정보 저장 후 토큰 발급');
            const access_token = this.authService.createLoginToken(userId);
            const refresh_token = this.userService.makeRefreshToken(userId);
            const newUser = await this.userRepository.save({
                userId: userId,
                email: email,
                nickname: nickname,
                profileImg: profileImg,
                refresh_token: refreshToken,
            });
            await this.userService.CurrnetRefreshToken(refreshToken, user.userId);
            return { access_token, refresh_token };
        }
        console.log('로그인 토큰 발급');
        const access_token = await this.authService.createLoginToken(user);
        const refresh_token = await this.userService.makeRefreshToken(user);
        await this.userService.CurrnetRefreshToken(refreshToken, user.userId);
        return { access_token, refresh_token, nickname };
    }
};
KakaoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_SERVICE')),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _b : Object])
], KakaoStrategy);
exports.KakaoStrategy = KakaoStrategy;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("b7639c3f9d79c4118e7b")
/******/ })();
/******/ 
/******/ }
;