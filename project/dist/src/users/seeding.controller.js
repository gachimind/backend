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
exports.SeedingController = void 0;
const common_1 = require("@nestjs/common");
const undefinedToNull_interceptor_1 = require("../common/interceptors/undefinedToNull.interceptor");
const resultToData_interceptor_1 = require("../common/interceptors/resultToData.interceptor");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const token_map_entity_1 = require("./entities/token-map.entity");
let SeedingController = class SeedingController {
    constructor(usersRepository, tokenMapRepository) {
        this.usersRepository = usersRepository;
        this.tokenMapRepository = tokenMapRepository;
    }
    async createTestUser() {
        const user = [];
        for (let num = 1; num <= 6; num++) {
            user.push({
                email: `test${num}@email.com`,
                nickname: `테스트닉네임${num}`,
                profileImg: 'https://ichef.bbci.co.uk/news/640/cpsprodpb/E172/production/_126241775_getty_cats.png',
            });
        }
        return await this.usersRepository.insert(user);
    }
    async createTestToken() {
        const user = [];
        for (let num = 1; num <= 6; num++) {
            user.push({
                userInfo: num,
                token: `token${num}`,
            });
        }
        return await this.tokenMapRepository.insert(user);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedingController.prototype, "createTestUser", null);
__decorate([
    (0, common_1.Get)('token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedingController.prototype, "createTestToken", null);
SeedingController = __decorate([
    (0, common_1.UseInterceptors)(undefinedToNull_interceptor_1.UndefinedToNullInterceptor, resultToData_interceptor_1.ResultToDataInterceptor),
    (0, common_1.Controller)('api/users'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SeedingController);
exports.SeedingController = SeedingController;
//# sourceMappingURL=seeding.controller.js.map