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
exports.Player = void 0;
const typeorm_1 = require("typeorm");
const room_entity_1 = require("./room.entity");
const socketIdMap_entity_1 = require("./socketIdMap.entity");
let Player = class Player {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Player.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => socketIdMap_entity_1.SocketIdMap),
    (0, typeorm_1.JoinColumn)({ name: 'socketId' }),
    __metadata("design:type", socketIdMap_entity_1.SocketIdMap)
], Player.prototype, "socketId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, (room) => room.roomId, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'roomId' }),
    __metadata("design:type", room_entity_1.Room)
], Player.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Player.prototype, "isGameOn", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Player.prototype, "isGameReadyToStart", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Player.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Player.prototype, "updatedAt", void 0);
Player = __decorate([
    (0, typeorm_1.Entity)()
], Player);
exports.Player = Player;
//# sourceMappingURL=player.entity.js.map