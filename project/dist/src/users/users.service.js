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
const user_entity_1 = require("./entities/user.entity");
const token_map_entity_1 = require("./entities/token-map.entity");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let UsersService = class UsersService {
    constructor(usersRepository, tokenMapRepository, jwtService, configService) {
        this.usersRepository = usersRepository;
        this.tokenMapRepository = tokenMapRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(details) {
        const user = await this.usersRepository.findOneBy({
            kakaoUserId: details.kakaoUserId,
        });
        if (user)
            return user;
        const newUser = this.usersRepository.save(details);
        return newUser;
    }
    async findUserById(kakaoUserId) {
        const user = await this.usersRepository.findOneBy({ kakaoUserId });
        return user;
    }
    async tokenValidate(token) {
        return await this.jwtService.verify(token, {
            secret: process.env.TOKEN_SECRETE_KEY,
        });
    }
    async createToken(user) {
        const token = this.jwtService.sign({
            secret: process.env.TOKEN_SECRETE_KEY,
            expiresIn: '24h',
        });
        await this.tokenMapRepository.save({ userInfo: user.userId, token: token });
        return token;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map