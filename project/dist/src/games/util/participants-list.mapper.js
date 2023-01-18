"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.participantsListMapper = void 0;
const participantsListMapper = (playerInfo) => {
    return playerInfo.map((player) => {
        const { user, socketInfo, isReady, isHost } = player;
        const { userId, nickname, profileImg } = user;
        return { socketId: socketInfo, userId, nickname, profileImg, isReady, isHost };
    });
};
exports.participantsListMapper = participantsListMapper;
//# sourceMappingURL=participants-list.mapper.js.map