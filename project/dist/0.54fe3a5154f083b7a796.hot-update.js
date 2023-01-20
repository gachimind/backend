"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 15:
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(16);
const jwt_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(18);
const token_map_entity_1 = __webpack_require__(19);
const config_1 = __webpack_require__(11);
let UsersService = class UsersService {
    constructor(usersRepository, tokenMapRepository, jwtService, configService) {
        this.usersRepository = usersRepository;
        this.tokenMapRepository = tokenMapRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async createUser(details) {
        return await this.usersRepository.save(details);
    }
    async findUserByNickNameOrEmail(kakaoUserId, nickname, email) {
        console.log('findUserByNicknameOrEmail', { kakaoUserId, nickname, email });
        return await this.usersRepository.find({
            where: [{ kakaoUserId }, { nickname }, { email }],
        });
    }
    async validateUser(userData) {
        const users = await this.findUserByNickNameOrEmail(userData.kakaoUserId, userData.nickname, userData.email);
        if (!users || !users.length) {
            const user = await this.createUser(userData);
            const isNewUser = true;
            return { user, isNewUser };
        }
        return { user: users[0], isNewUser: false };
    }
    async createToken(user, isNewUSer) {
        const payload = {};
        const token = this.jwtService.sign({
            payload,
        });
        if (isNewUSer) {
            await this.tokenMapRepository.save({
                userInfo: user.userId,
                token: token,
            });
        }
        else {
            await this.tokenMapRepository.update({ user }, { token: token });
        }
        return token;
    }
    async tokenValidate(token) {
        return await this.jwtService.verify(token, {
            secret: this.configService.get('TOKEN_SECRETE_KEY'),
        });
    }
    async getUserDetailsByToken(token) {
        const getUserInfoByToken = await this.tokenMapRepository.findOneBy({ token });
        console.log(getUserInfoByToken, '000000000000000000');
        const modifyingUser = getUserInfoByToken.user;
        console.log(modifyingUser, '111111111111111111');
        const { kakaoUserId, email, nickname, profileImg } = await modifyingUser;
        getUserInfoByToken.user.kakaoUserId = kakaoUserId;
        getUserInfoByToken.user.email = email;
        getUserInfoByToken.user.nickname = nickname;
        getUserInfoByToken.user.profileImg = profileImg;
        const userDetail = { kakaoUserId, email, nickname, profileImg };
        console.log(userDetail, '2222222222222222');
        return userDetail;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _c : Object, typeof (_d = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _d : Object])
], UsersService);
exports.UsersService = UsersService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("055afc5bd233173ced96")
/******/ })();
/******/ 
/******/ }
;