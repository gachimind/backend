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
exports.RoomDataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_room_request_dto_1 = require("./create-room.request.dto");
class RoomDataDto extends (0, swagger_1.OmitType)(create_room_request_dto_1.CreateRoomRequestDto, ['roomTitle']) {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: true,
        description: '게임방 PK, 서버에서 자동 부여',
    }),
    __metadata("design:type", Number)
], RoomDataDto.prototype, "roomId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: '같이 가치마인드 하실 초보 모집합니다!!',
        required: false,
        description: '게임방 제목, 유저가 입력하지 않으면, 서버에서 랜덤 방제로 자동생성',
    }),
    __metadata("design:type", String)
], RoomDataDto.prototype, "roomTitle", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: false,
        required: true,
        description: '방의 게임 상태, false: 대기 중  / true: 게임 중',
    }),
    __metadata("design:type", Boolean)
], RoomDataDto.prototype, "isGameOn", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: false,
        required: true,
        description: '방의 게임 READY 상태, false: READY하지 않은 플레이어 가 있음  / true: 모든 플레이어가 READY 함',
    }),
    __metadata("design:type", Boolean)
], RoomDataDto.prototype, "isGameReadyToStart", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, swagger_1.ApiProperty)({
        example: [
            { userId: 1, nickname: '동석1', profileImg: '이미지url', isReady: false },
            { userId: 2, nickname: '세현1', profileImg: '이미지url', isReady: true },
            { userId: 3, nickname: '혜연1', profileImg: '이미지url', isReady: false },
        ],
        required: true,
        description: '방의 게임 상태, false: 대기 중  / true: 게임 중',
    }),
    __metadata("design:type", Array)
], RoomDataDto.prototype, "participants", void 0);
exports.RoomDataDto = RoomDataDto;
//# sourceMappingURL=room.data.dto.js.map