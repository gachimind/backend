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
exports.CreateRoomRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateRoomRequestDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: '같이 가치마인드 하실 초보 모집합니다!!',
        required: false,
        description: '게임방 제목, 유저가 입력하지 않으면, 서버에서 랜덤 방제로 자동생성',
    }),
    __metadata("design:type", String)
], CreateRoomRequestDto.prototype, "roomTitle", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 6,
        required: true,
        description: '게임 정원',
    }),
    __metadata("design:type", Number)
], CreateRoomRequestDto.prototype, "maxCount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 30000,
        required: true,
        description: '발표 준비 타이머, milliseconds 단위',
    }),
    __metadata("design:type", Number)
], CreateRoomRequestDto.prototype, "readyTime", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 30000,
        required: true,
        description: '발표 타이머, milliseconds 단위',
    }),
    __metadata("design:type", Number)
], CreateRoomRequestDto.prototype, "speechTime", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 60000,
        required: true,
        description: '토론 타이머, milliseconds 단위',
    }),
    __metadata("design:type", Number)
], CreateRoomRequestDto.prototype, "discussionTime", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: true,
        required: true,
        description: '비밀방 여부',
    }),
    __metadata("design:type", Boolean)
], CreateRoomRequestDto.prototype, "isSecretRoom", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 8282,
        required: false,
        description: '비밀방 비밀번호 - 숫자 4자리',
    }),
    __metadata("design:type", Number)
], CreateRoomRequestDto.prototype, "roomPassword", void 0);
exports.CreateRoomRequestDto = CreateRoomRequestDto;
//# sourceMappingURL=create-room.request.dto.js.map