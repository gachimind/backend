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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("./entities/user.entity");
const token_map_entity_1 = require("./entities/token-map.entity");
const config_1 = require("@nestjs/config");
const todayResult_entity_1 = require("../games/entities/todayResult.entity");
const gameResult_entity_1 = require("../games/entities/gameResult.entity");
const turnResult_entity_1 = require("../games/entities/turnResult.entity");
const today_date_constructor_1 = require("../games/util/today.date.constructor");
let UsersService = class UsersService {
    constructor(usersRepository, tokenMapRepository, todayResultRepository, gameResultRepository, TurnResultRepository, jwtService, configService) {
        this.usersRepository = usersRepository;
        this.tokenMapRepository = tokenMapRepository;
        this.todayResultRepository = todayResultRepository;
        this.gameResultRepository = gameResultRepository;
        this.TurnResultRepository = TurnResultRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async createUser(details) {
        return await this.usersRepository.save(details);
    }
    async findUser(kakaoUserId, email, nickname) {
        let user = await this.usersRepository.findOne({ where: { kakaoUserId } });
        if (!user && email) {
            user = await this.usersRepository.findOne({ where: { email } });
        }
        if (!user && nickname) {
            user = await this.usersRepository.findOne({ where: { nickname } });
        }
        return user;
    }
    async validateUser(userData) {
        let user = await this.findUser(userData.kakaoUserId, userData.email, userData.nickname);
        if (!user) {
            user = await this.createUser(userData);
            const isNewUser = true;
            return { user, isNewUser };
        }
        return { user, isNewUser: false };
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
        if (!getUserInfoByToken)
            throw new common_1.HttpException('정상적인 접근이 아닙니다.', 401);
        const { userId, email, nickname, profileImg } = getUserInfoByToken.user;
        return { userId, email, nickname, profileImg };
    }
    async getUserKeywordByToken(token) {
        const getUserKeywordByToken = await this.tokenMapRepository.findOneBy({
            token,
        });
        if (!getUserKeywordByToken)
            throw new common_1.HttpException('정상적인 접근이 아닙니다.', 401);
        const findUserTodayResult = await this.usersRepository.findOne({
            where: { userId: getUserKeywordByToken.userInfo },
            select: { todayResults: true },
        });
        const findTotalkeyword = await this.TurnResultRepository.find({
            where: { nickname: findUserTodayResult.nickname },
            select: { keyword: true, isSpeech: true },
        });
        const today = (0, today_date_constructor_1.getTodayDate)();
        await this.todayResultRepository.find({
            where: { userInfo: findUserTodayResult.userId, createdAt: today },
        });
        const findTodayKeyword = await this.TurnResultRepository.find({
            where: { userId: findUserTodayResult.userId, createdAt: today },
            select: { userId: true, keyword: true, isSpeech: true },
        });
        const todaySpeechKeyword1 = [];
        const todayQuizKeyword1 = [];
        for (const result of findTodayKeyword) {
            if (result.isSpeech === true) {
                todaySpeechKeyword1.push({
                    Keyword: result.keyword,
                });
            }
            else
                result.isSpeech === false;
            todayQuizKeyword1.push({
                Keyword: result.keyword,
            });
        }
        const todaySpeechKeyword = [];
        for (const result in todaySpeechKeyword1) {
            todaySpeechKeyword.push(todaySpeechKeyword1[result].Keyword);
        }
        const todayQuizKeyword2 = [];
        for (const result in todayQuizKeyword1) {
            todayQuizKeyword2.push(todayQuizKeyword1[result].Keyword);
        }
        const todayQuizKeyword = todayQuizKeyword2.filter((val, idx) => {
            return totalQuizKeyword2.indexOf(val) === idx;
        });
        const totalSpeechKeyword1 = [];
        const totalQuizKeyword1 = [];
        for (const result of findTotalkeyword) {
            if (result.isSpeech === true) {
                totalSpeechKeyword1.push({
                    Keyword: result.keyword,
                });
            }
            else
                result.isSpeech === false;
            totalQuizKeyword1.push({
                Keyword: result.keyword,
            });
        }
        const totalSpeechKeyword = [];
        for (const result in totalSpeechKeyword1) {
            totalSpeechKeyword.push(totalSpeechKeyword1[result].Keyword);
        }
        const totalQuizKeyword2 = [];
        for (const result in totalQuizKeyword1) {
            totalQuizKeyword2.push(totalQuizKeyword1[result].Keyword);
        }
        const totalQuizKeyword = totalQuizKeyword2.filter((val, idx) => {
            return totalQuizKeyword2.indexOf(val) === idx;
        });
        console.log(totalQuizKeyword);
        const usersKeyword = {
            userId: findUserTodayResult.userId,
            todaySpeechKeyword,
            todayQuizKeyword,
            totalSpeechKeyword,
            totalQuizKeyword,
        };
        console.log(usersKeyword);
        return usersKeyword;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __param(2, (0, typeorm_1.InjectRepository)(todayResult_entity_1.TodayResult)),
    __param(3, (0, typeorm_1.InjectRepository)(gameResult_entity_1.GameResult)),
    __param(4, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map