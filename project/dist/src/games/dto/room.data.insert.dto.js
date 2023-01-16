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
exports.RoomDataInsertDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_room_request_dto_1 = require("./create-room.request.dto");
class RoomDataInsertDto extends (0, swagger_1.OmitType)(create_room_request_dto_1.CreateRoomRequestDto, ['roomTitle']) {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: '같이 가치마인드 하실 초보 모집합니다!!',
        required: false,
        description: '게임방 제목, 유저가 입력하지 않으면, 서버에서 랜덤 방제로 자동생성',
    }),
    __metadata("design:type", String)
], RoomDataInsertDto.prototype, "roomTitle", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: false,
        required: true,
        description: '방의 게임 상태, false: 대기 중  / true: 게임 중',
    }),
    __metadata("design:type", Boolean)
], RoomDataInsertDto.prototype, "isGameOn", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: false,
        required: true,
        description: '방의 게임 READY 상태, false: READY하지 않은 플레이어 가 있음  / true: 모든 플레이어가 READY 함',
    }),
    __metadata("design:type", Boolean)
], RoomDataInsertDto.prototype, "isGameReadyToStart", void 0);
exports.RoomDataInsertDto = RoomDataInsertDto;
//# sourceMappingURL=room.data.insert.dto.js.map