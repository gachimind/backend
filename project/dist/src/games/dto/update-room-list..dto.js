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
exports.UpdateRoomListDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateRoomListDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: true,
        description: '방 생성시 서버에서 자동 생성하는 방의 고유번호',
    }),
    __metadata("design:type", Number)
], UpdateRoomListDto.prototype, "roomId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: '같이 가치마인드 하실 초보 모집합니다!!',
        required: true,
        description: '게임방 제목, 유저가 입력하지 않으면, 서버에서 랜덤 방제로 자동생성',
    }),
    __metadata("design:type", String)
], UpdateRoomListDto.prototype, "roomTitle", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 6,
        required: true,
        description: '게임 정원',
    }),
    __metadata("design:type", Number)
], UpdateRoomListDto.prototype, "maxCount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 3,
        required: true,
        description: '방정보 db에는 participants가 참여자 닉네임 배열로 되어 있고, client에 전단할때는 해당 배열의 length를 전달',
    }),
    __metadata("design:type", Number)
], UpdateRoomListDto.prototype, "participants", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: true,
        required: true,
        description: '비밀방 여부',
    }),
    __metadata("design:type", Boolean)
], UpdateRoomListDto.prototype, "isSecreteRoom", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: false,
        required: true,
        description: '방의 상태를 표시 - false: 대기 상태 or true: 게임 상태',
    }),
    __metadata("design:type", Boolean)
], UpdateRoomListDto.prototype, "isGameOn", void 0);
exports.UpdateRoomListDto = UpdateRoomListDto;
//# sourceMappingURL=update-room-list..dto.js.map