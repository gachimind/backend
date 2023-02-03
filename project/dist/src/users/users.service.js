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
const turnResult_entity_1 = require("../games/entities/turnResult.entity");
const today_date_constructor_1 = require("../games/util/today.date.constructor");
let UsersService = class UsersService {
    constructor(usersRepository, tokenMapRepository, todayResultRepository, TurnResultRepository, jwtService, configService) {
        this.usersRepository = usersRepository;
        this.tokenMapRepository = tokenMapRepository;
        this.todayResultRepository = todayResultRepository;
        this.TurnResultRepository = TurnResultRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async createUser(details) {
        return await this.usersRepository.save(details);
    }
    async findUserByNickname(nickname) {
        return await this.usersRepository.findBy({ nickname: (0, typeorm_2.Like)(`${nickname}%`) });
    }
    async findUser(kakaoUserId, email) {
        let user = await this.usersRepository.findOne({ where: { kakaoUserId } });
        if (!user && email) {
            user = await this.usersRepository.findOne({ where: { email } });
        }
        return user;
    }
    async validateUser(userData) {
        let user = await this.findUser(userData.kakaoUserId, userData.email);
        if (!user) {
            const sameNickname = await this.findUserByNickname(userData.nickname);
            if (sameNickname.length) {
                userData.nickname = userData.nickname + (sameNickname.length + 1);
            }
            userData.isFirstLogin = true;
            user = await this.createUser(userData);
        }
        return user;
    }
    async createToken(user) {
        const payload = {};
        const token = this.jwtService.sign({
            payload,
        });
        const newToken = { userInfo: user.userId, token: token };
        const existToken = await this.tokenMapRepository.findOne({
            where: { userInfo: user.userId },
            select: { tokenMapId: true },
        });
        if (existToken) {
            newToken['tokenMapId'] = existToken.tokenMapId;
        }
        await this.tokenMapRepository.save(newToken);
        return token;
    }
    async tokenValidate(token) {
        return await this.jwtService.verify(token, {
            secret: this.configService.get('TOKEN_SECRETE_KEY'),
        });
    }
    async logout(token) {
        const findUser = await this.tokenMapRepository.delete({ token });
        if (!findUser)
            throw new common_1.HttpException('정상적인 접근이 아닙니다.', 401);
        return findUser;
    }
    async getUserDetailsByToken(token) {
        const getUserInfoByToken = await this.tokenMapRepository.findOne({
            where: { token },
            select: {
                user: { userId: true, nickname: true, profileImg: true, isFirstLogin: true },
            },
        });
        if (!getUserInfoByToken)
            throw new common_1.HttpException('해당하는 사용자를 찾을 수 없습니다.', 401);
        const { userId, nickname, profileImg, isFirstLogin } = getUserInfoByToken.user;
        if (isFirstLogin) {
            await this.usersRepository.save({ userId, isFirstLogin: false });
        }
        const todayScore = await this.getTodayScoreByUserId(userId);
        const todayRank = await this.getAllUserScore(userId);
        const totalScore = await this.getUserTotalScore(userId);
        return {
            userId,
            nickname,
            profileImg,
            isFirstLogin,
            today: { todayScore, todayRank },
            total: { totalScore },
        };
    }
    async getTodayScoreByUserId(userInfo) {
        const today = (0, today_date_constructor_1.getDate)();
        const findTodayScore = await this.todayResultRepository.findOne({
            where: {
                userInfo,
                createdAt: (0, typeorm_2.MoreThan)(today),
            },
        });
        let todayScore = 0;
        if (findTodayScore)
            todayScore = findTodayScore.todayScore;
        return todayScore;
    }
    async getAllUserScore(userInfo) {
        const today = (0, today_date_constructor_1.getDate)();
        const getAllUserScore = await this.todayResultRepository.find({
            where: { createdAt: (0, typeorm_2.MoreThan)(today) },
            select: {
                userInfo: true,
                todayScore: true,
            },
            order: {
                todayScore: 'DESC',
            },
        });
        const todayRank = getAllUserScore.findIndex((i) => i.userInfo == userInfo) + 1;
        return todayRank;
    }
    async getUserTotalScore(userInfo) {
        const { sum } = await this.todayResultRepository
            .createQueryBuilder('todayResult')
            .select('SUM(todayResult.todayScore)', 'sum')
            .where('todayResult.userInfo = :userInfo', { userInfo })
            .cache(60 * 60 * 1000)
            .getRawOne();
        return Number(sum);
    }
    async userKeyword(token) {
        const user = await this.tokenMapRepository.findOneBy({
            token,
        });
        if (!user)
            throw new common_1.HttpException('정상적인 접근이 아닙니다.', 401);
        const findTotalkeyword = await this.TurnResultRepository.find({
            where: { userId: user.userInfo },
            select: { keyword: true, isSpeech: true, createdAt: true },
        });
        const speechKeywordArray = [];
        const quizKeywordArray = [];
        for (const result of findTotalkeyword) {
            if (result.isSpeech) {
                speechKeywordArray.push(result.keyword);
            }
            else {
                quizKeywordArray.push(result.keyword);
            }
        }
        const totalSpeechKeyword = [...new Set(speechKeywordArray)];
        const totalQuizKeyword = [...new Set(quizKeywordArray)];
        const today = (0, today_date_constructor_1.getDate)();
        const findTodaykeyword = await this.TurnResultRepository.find({
            where: {
                userId: user.userInfo,
                createdAt: (0, typeorm_2.MoreThan)(today),
            },
            select: { keyword: true, isSpeech: true },
        });
        const todaySpeechKeywordArray = [];
        const todayQuizKeywordArray = [];
        for (const result of findTodaykeyword) {
            if (result.isSpeech) {
                todaySpeechKeywordArray.push(result.keyword);
            }
            else {
                todayQuizKeywordArray.push(result.keyword);
            }
        }
        const todaySpeechKeyword = [...new Set(todaySpeechKeywordArray)];
        const todayQuizKeyword = [...new Set(todayQuizKeywordArray)];
        const data = {
            userId: user.userInfo,
            todaySpeechKeyword,
            todayQuizKeyword,
            totalSpeechKeyword,
            totalQuizKeyword,
        };
        return data;
    }
    async overlapCheck(nickname) {
        if (nickname.length > 10 || nickname.includes(' ') || !nickname) {
            throw new common_1.HttpException('닉네임 규칙을 확인해주세요.', 400);
        }
        const overlapCheck = await this.usersRepository.findOne({
            where: { nickname },
        });
        if (overlapCheck) {
            throw new common_1.HttpException('이미 사용 중인 닉네임입니다.', 412);
        }
        return true;
    }
    async updateUser(token, body) {
        const userInfoChange = await this.tokenMapRepository.findOne({
            where: { token },
        });
        if (!userInfoChange) {
            throw new common_1.HttpException('해당하는 사용자를 찾을 수 없습니다.', 401);
        }
        const { nickname, profileImg } = body;
        if (nickname.length > 10 || nickname.includes(' ') || !nickname) {
            throw new common_1.HttpException('닉네임 규칙을 확인해주세요.', 400);
        }
        const updateUser = await this.usersRepository.save({
            userId: userInfoChange.userInfo,
            nickname,
            profileImg,
        });
        if (!updateUser) {
            throw new common_1.HttpException('Internal Sever Error', 500);
        }
        return updateUser;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __param(2, (0, typeorm_1.InjectRepository)(todayResult_entity_1.TodayResult)),
    __param(3, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map