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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resultToData_interceptor_1 = require("./common/interceptors/resultToData.interceptor");
const gameResult_entity_1 = require("./games/entities/gameResult.entity");
const room_entity_1 = require("./games/entities/room.entity");
const todayResult_entity_1 = require("./games/entities/todayResult.entity");
const turn_entity_1 = require("./games/entities/turn.entity");
const turnResult_entity_1 = require("./games/entities/turnResult.entity");
const token_map_entity_1 = require("./users/entities/token-map.entity");
const user_entity_1 = require("./users/entities/user.entity");
let AppController = class AppController {
    constructor(usersRepository, tokenMapRepository, todayResultRepository, gameResultRepository, turnResultRepository, turnRepository, roomRepository) {
        this.usersRepository = usersRepository;
        this.tokenMapRepository = tokenMapRepository;
        this.todayResultRepository = todayResultRepository;
        this.gameResultRepository = gameResultRepository;
        this.turnResultRepository = turnResultRepository;
        this.turnRepository = turnRepository;
        this.roomRepository = roomRepository;
    }
    greetings() {
        return `welcome to gachimind project nest server!`;
    }
    async createTestUser() {
        const users = [];
        for (let num = 1; num <= 6; num++) {
            users.push({
                email: `test${num}@email.com`,
                nickname: `테스트닉네임${num}`,
                profileImg: 'https://ichef.bbci.co.uk/news/640/cpsprodpb/E172/production/_126241775_getty_cats.png',
            });
        }
        return await this.usersRepository.save(users);
    }
    async createTestToken() {
        const users = [];
        for (let num = 1; num <= 6; num++) {
            users.push({
                userInfo: num,
                token: `token${num}`,
            });
        }
        return await this.tokenMapRepository.save(users);
    }
    async createTodayResult() {
        const results = [];
        for (let num = 1; num <= 6; num++) {
            results.push({
                userInfo: num,
                todayScore: num * 1000,
            });
        }
        return await this.todayResultRepository.save(results);
    }
    async createGameResult() {
        const results = [];
        for (let num = 1; num <= 6; num++) {
            for (let userInfo = 1; userInfo <= 6; userInfo++) {
                results.push({
                    roomId: 1000 + num,
                    userInfo,
                    todayResultInfo: userInfo,
                });
            }
        }
        return await this.gameResultRepository.save(results);
    }
    async createTurnResult() {
        const keywords = ['MVC패턴', 'OOP', 'STACKE', 'QUEUE', '함수형 프로그래밍', '메모리 계층'];
        const results = [];
        for (let userId = 1; userId <= 6; userId++) {
            const gameResults = await this.gameResultRepository.find({
                where: { userInfo: userId },
                select: { gameResultId: true, roomId: true },
            });
            const user = await this.usersRepository.findOneBy({ userId });
            for (let gameResult of gameResults) {
                let turn = 1;
                while (turn <= 6) {
                    results.push({
                        gameResultInfo: gameResult.gameResultId,
                        roomId: gameResult.roomId,
                        userId,
                        turn,
                        nickname: user.nickname,
                        score: 20 * (userId - 1),
                        keyword: keywords[turn - 1],
                        isSpeech: turn === userId ? true : false,
                    });
                    turn++;
                }
            }
        }
        return await this.turnResultRepository.save(results);
    }
    async test() {
<<<<<<< HEAD
        const today = new Date();
        const date = today.toISOString().split('T')[0];
        return await this.turnResultRepository.countBy({
            createdAt: (0, typeorm_2.Raw)((dateTime) => `${dateTime} > :date`, { date }),
        });
=======
        return this.gameResultRepository
            .createQueryBuilder('gameResult')
            .select('SUM(turnResults.score)', 'sum')
            .where('userInfo = :id', { id: 8 })
            .getRawMany();
>>>>>>> 3ad62daa91bbfb825c0e34d6afa4dd8427a92130
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "greetings", null);
__decorate([
    (0, common_1.Get)('seed/user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createTestUser", null);
__decorate([
    (0, common_1.Get)('seed/token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createTestToken", null);
__decorate([
    (0, common_1.Get)('seed/result/today'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createTodayResult", null);
__decorate([
    (0, common_1.Get)('seed/result/game'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createGameResult", null);
__decorate([
    (0, common_1.Get)('seed/result/turn'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createTurnResult", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "test", null);
AppController = __decorate([
    (0, common_1.UseInterceptors)(resultToData_interceptor_1.ResultToDataInterceptor),
    (0, common_1.Controller)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(token_map_entity_1.TokenMap)),
    __param(2, (0, typeorm_1.InjectRepository)(todayResult_entity_1.TodayResult)),
    __param(3, (0, typeorm_1.InjectRepository)(gameResult_entity_1.GameResult)),
    __param(4, (0, typeorm_1.InjectRepository)(turnResult_entity_1.TurnResult)),
    __param(5, (0, typeorm_1.InjectRepository)(turn_entity_1.Turn)),
    __param(6, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map