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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateUserDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: '12345678',
        required: true,
        description: 'OAuth 서버에서 받아온 회원의 userId을 게임 서버 db에 저장',
    }),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "kakaoUserId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'test@email.com',
        required: true,
        description: 'OAuth 서버에서 받아온 회원의 email을 게임 서버 db에 저장',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: '혜연1',
        required: true,
        description: 'OAuth 서버에서 받아온 회원의 nickname을 게임 서버 db에 저장',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "nickname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: '혜연1',
        required: true,
        description: 'OAuth 서버에서 받아온 회원의 profile image를 게임 서버 db에 저장. profile image가 없을 경우, 게임 서버의 default 이미지를 사용하고, OAuth 서버에서 이미지 url을 제공하지 않고, base64로 제공할 경우, 해당 값을  S3 서버에 업로드하고, 이미지 url 값을 받아와 저장',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "profileImg", void 0);
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map