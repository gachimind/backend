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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameResult = void 0;
const typeorm_1 = require("typeorm");
const turnResult_entity_1 = require("./turnResult.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const ManyToOne_1 = require("typeorm/decorator/relations/ManyToOne");
const todayResult_entity_1 = require("./todayResult.entity");
let GameResult = class GameResult {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GameResult.prototype, "gameResultId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GameResult.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userInfo' }),
    __metadata("design:type", Number)
], GameResult.prototype, "userInfo", void 0);
__decorate([
    (0, ManyToOne_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userInfo' }),
    __metadata("design:type", user_entity_1.User)
], GameResult.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], GameResult.prototype, "gameScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'todayResultInfo', nullable: true, select: true }),
    __metadata("design:type", Number)
], GameResult.prototype, "todayResultInfo", void 0);
__decorate([
    (0, ManyToOne_1.ManyToOne)(() => todayResult_entity_1.TodayResult, (todayResult) => todayResult.gameResults, {
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'todayResultInfo' }),
    __metadata("design:type", todayResult_entity_1.TodayResult)
], GameResult.prototype, "todayResult", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ select: false }),
    __metadata("design:type", Date)
], GameResult.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ select: false }),
    __metadata("design:type", Date)
], GameResult.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ select: false }),
    __metadata("design:type", Date)
], GameResult.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => turnResult_entity_1.TurnResult, (turnResult) => turnResult.gameResult),
    __metadata("design:type", Array)
], GameResult.prototype, "turnResults", void 0);
GameResult = __decorate([
    (0, typeorm_1.Entity)()
], GameResult);
exports.GameResult = GameResult;
//# sourceMappingURL=gameResult.entity.js.map