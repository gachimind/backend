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
exports.RoomParticipantsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RoomParticipantsDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: '1nkYPrJVfR06HoiDAAAB',
        required: true,
        description: 'socket id',
    }),
    __metadata("design:type", String)
], RoomParticipantsDto.prototype, "socketId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: true,
        description: 'user id PK',
    }),
    __metadata("design:type", Number)
], RoomParticipantsDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: true,
        description: '닉네임',
    }),
    __metadata("design:type", String)
], RoomParticipantsDto.prototype, "nickname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: true,
        description: '프로필 이미지 - 고양이 사진',
    }),
    __metadata("design:type", String)
], RoomParticipantsDto.prototype, "profileImg", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: true,
        required: true,
        description: '게임 READY 상태인지? - 방장은 항상 false',
    }),
    __metadata("design:type", Boolean)
], RoomParticipantsDto.prototype, "isReady", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: false,
        required: true,
        description: '방방인지? - 방장만 true',
    }),
    __metadata("design:type", Boolean)
], RoomParticipantsDto.prototype, "isHost", void 0);
exports.RoomParticipantsDto = RoomParticipantsDto;
//# sourceMappingURL=room.participants.dto.js.map