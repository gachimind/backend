"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventUserInfoConstructor = void 0;
function eventUserInfoConstructor(requestUser) {
    return {
        socketId: requestUser.socketId,
        userId: requestUser.userInfo,
        nickname: requestUser.user.nickname,
        profileImg: requestUser.user.profileImg,
    };
}
exports.eventUserInfoConstructor = eventUserInfoConstructor;
//# sourceMappingURL=event.user.info.constructor.js.map