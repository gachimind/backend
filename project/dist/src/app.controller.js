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
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "greetings", null);
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