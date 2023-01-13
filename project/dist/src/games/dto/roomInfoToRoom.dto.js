"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomInfoToRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const room_data_dto_1 = require("./room.data.dto");
class RoomInfoToRoomDto extends (0, swagger_1.OmitType)(room_data_dto_1.RoomDataDto, ['roomPassword']) {
}
exports.RoomInfoToRoomDto = RoomInfoToRoomDto;
//# sourceMappingURL=roomInfoToRoom.dto.js.map