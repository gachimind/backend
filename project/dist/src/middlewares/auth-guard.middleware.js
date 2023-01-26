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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const players_service_1 = require("../games/players.service");
let AuthGuard = class AuthGuard {
    constructor(playersService) {
        this.playersService = playersService;
    }
    async canActivate(context) {
        const request = context.switchToWs().getClient();
        const requestUser = await this.playersService.getUserBySocketId(request.socket.id);
        if (!requestUser) {
            return false;
        }
        return true;
    }
};
AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [players_service_1.PlayersService])
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth-guard.middleware.js.map