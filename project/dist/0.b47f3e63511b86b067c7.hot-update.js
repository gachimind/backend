"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 14:
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const common_2 = __webpack_require__(7);
const typeorm_2 = __webpack_require__(15);
const user_entity_1 = __webpack_require__(16);
const config_1 = __webpack_require__(17);
const jwt_1 = __webpack_require__(18);
const bcrypt = __webpack_require__(19);
const axios_1 = __webpack_require__(20);
let UsersService = class UsersService {
    constructor(usersRepository, jwtService, configService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async findUserById(userId) {
        const user = await this.usersRepository.findOneBy({ userId });
        return user;
    }
    async kakaoLogin(authorization) {
        if (!authorization)
            throw new common_2.HttpException('토큰 정보가 없습니다.', 402);
        const kakaoAccessToken = authorization;
        const { data: kakaoUser } = await (0, axios_1.default)('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `${kakaoAccessToken}`,
            },
        });
        const profileImg = kakaoUser.properties.profile_image;
        const nickname = kakaoUser.properties.nickname;
        const email = kakaoUser.kakao_account.email;
        const exUser = await this.usersRepository.findOne({
            where: { email },
        });
        if (!exUser) {
            const newUser = await this.usersRepository.save({
                nickname,
                profileImg,
                email,
            });
            console.log('회원정보 저장 토큰 발급');
            const accessToken = await this.makeAccessToken(newUser.email);
            const refreshToken = await this.makeAccessToken(newUser.email);
            await this.CurrnetRefreshToken(refreshToken, newUser.userId);
            return { accessToken, refreshToken };
        }
        else {
            const { userId } = exUser;
            console.log('로그인 토큰 발급');
            const accessToken = await this.makeAccessToken(exUser.email);
            const refreshToken = await this.makeAccessToken(exUser.email);
            await this.CurrnetRefreshToken(refreshToken, userId);
            return { accessToken, refreshToken };
        }
    }
    async makeAccessToken(email) {
        const payload = { email };
        const accessToken = await this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '60m',
        });
        return accessToken;
    }
    async makeRefreshToken(email) {
        const payload = { email };
        const refreshToken = await this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '1d',
        });
        return refreshToken;
    }
    async CurrnetRefreshToken(refreshToken, userId) {
        const salt = await bcrypt.genSalt();
        const token = await bcrypt.hash(refreshToken, salt);
        await this.usersRepository.update(userId, { token });
    }
    async getUserDetailsByUserId(userId) {
        const user = await this.usersRepository.findOne({
            select: { userId: true, email: true, nickname: true, profileImg: true },
            where: { userId },
        });
        if (!user) {
            throw new common_2.HttpException('회원 인증에 실패했습니다.', 402);
        }
        return user;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], UsersService);
exports.UsersService = UsersService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("a25e6c433a4c9f2349b3")
/******/ })();
/******/ 
/******/ }
;