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
exports.TurnResult = void 0;
const typeorm_1 = require("typeorm");
const gmaeResult_entity_1 = require("./gmaeResult.entity");
let TurnResult = class TurnResult {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TurnResult.prototype, "turnResultId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint' }),
    __metadata("design:type", Number)
], TurnResult.prototype, "turn", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TurnResult.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint' }),
    __metadata("design:type", Number)
], TurnResult.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TurnResult.prototype, "keyword", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], TurnResult.prototype, "isSpeech", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gameResultInfo' }),
    __metadata("design:type", Number)
], TurnResult.prototype, "gameResultInfo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gmaeResult_entity_1.GameResult),
    (0, typeorm_1.JoinColumn)({ name: 'gameResultInfo' }),
    __metadata("design:type", gmaeResult_entity_1.GameResult)
], TurnResult.prototype, "gameResult", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TurnResult.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TurnResult.prototype, "updatedAt", void 0);
TurnResult = __decorate([
    (0, typeorm_1.Entity)()
], TurnResult);
exports.TurnResult = TurnResult;
//# sourceMappingURL=turnResult.entity.js.map