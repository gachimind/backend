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
exports.TokenMapRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TokenMapRequestDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 8,
        description: '기존에 매핑 되어 있더 유저 토큰맵의 PK',
    }),
    __metadata("design:type", Number)
], TokenMapRequestDto.prototype, "tokenMapId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 8,
        description: 'user entity의 PK',
    }),
    __metadata("design:type", Number)
], TokenMapRequestDto.prototype, "userInfo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7fSwiaWF0IjoxNjc1MTcyMTExLCJleHAiOjE2NzUyNTg1MTF9.FIZtNKlz288H5L_HQo8QIBACzW7Hr54sXPWh8SgSAkI',
        description: '새로 발급받은 JWT 값',
    }),
    __metadata("design:type", String)
], TokenMapRequestDto.prototype, "token", void 0);
exports.TokenMapRequestDto = TokenMapRequestDto;
//# sourceMappingURL=token.map.request.dto.js.map