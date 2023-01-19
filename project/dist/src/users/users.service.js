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
let UsersService = class UsersService {
    constructor(usersRepository, tokenMapRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.tokenMapRepository = tokenMapRepository;
        this.jwtService = jwtService;
    }
    async createUser(details) {
        return await this.usersRepository.save(details);
    }
    async findUserByNickNameOrEmail(nickname, email) {
        console.log('findUserByNicknameOrEmail', { nickname, email });
        return await this.usersRepository.find({ where: [{ nickname }, { email }] });
    }
    async validateUser(userData) {
        const users = await this.findUserByNickNameOrEmail(userData.nickname, userData.email);
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
        return await this.jwtService.verify(token);
    }
    async getUserInfoByToken(token) {
        const userFindByToken = await this.tokenMapRepository.findOne({
            where: { token },
            select: { userInfo: true },
        });
        return userFindByToken;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map