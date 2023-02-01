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
exports.SocketIdMap = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
const player_entity_1 = require("./player.entity");
let SocketIdMap = class SocketIdMap {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SocketIdMap.prototype, "socketMapId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], SocketIdMap.prototype, "socketId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userInfo' }),
    __metadata("design:type", Number)
], SocketIdMap.prototype, "userInfo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { onDelete: 'CASCADE', eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userInfo' }),
    __metadata("design:type", user_entity_1.User)
], SocketIdMap.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => player_entity_1.Player, (player) => player.socket),
    __metadata("design:type", player_entity_1.Player)
], SocketIdMap.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ select: false }),
    __metadata("design:type", Date)
], SocketIdMap.prototype, "createdAt", void 0);
SocketIdMap = __decorate([
    (0, typeorm_1.Entity)()
], SocketIdMap);
exports.SocketIdMap = SocketIdMap;
//# sourceMappingURL=socketIdMap.entity.js.map