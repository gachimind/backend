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
exports.RoomInfoToMainDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const room_data_insert_dto_1 = require("./room.data.insert.dto");
class RoomInfoToMainDto extends (0, swagger_1.OmitType)(room_data_insert_dto_1.RoomDataInsertDto, [
    'discussionTime',
    'speechTime',
    'readyTime',
    'roomPassword',
    'isGameReadyToStart',
]) {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: true,
        description: 'room 데이터 엔티티의 PK',
    }),
    __metadata("design:type", Number)
], RoomInfoToMainDto.prototype, "roomId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 3,
        required: true,
        description: '방정보 db에는 participants가 참여자 닉네임 배열로 되어 있고, client에 전단할때는 해당 배열의 length를 전달',
    }),
    __metadata("design:type", Number)
], RoomInfoToMainDto.prototype, "participants", void 0);
exports.RoomInfoToMainDto = RoomInfoToMainDto;
//# sourceMappingURL=roomInfoToMain.dto.js.map