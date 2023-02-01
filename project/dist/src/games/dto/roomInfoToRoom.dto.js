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
exports.RoomInfoToRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const room_data_insert_dto_1 = require("./room.data.insert.dto");
class RoomInfoToRoomDto extends (0, swagger_1.OmitType)(room_data_insert_dto_1.RoomDataInsertDto, ['roomPassword']) {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: true,
        description: 'roomId : PK for Room table',
    }),
    __metadata("design:type", Number)
], RoomInfoToRoomDto.prototype, "roomId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, swagger_1.ApiProperty)({
        example: [],
        required: true,
        description: 'player info in the room',
    }),
    __metadata("design:type", Array)
], RoomInfoToRoomDto.prototype, "participants", void 0);
exports.RoomInfoToRoomDto = RoomInfoToRoomDto;
//# sourceMappingURL=roomInfoToRoom.dto.js.map