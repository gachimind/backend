"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomInfoConstructor = void 0;
function updateRoomInfoConstructor(room) {
    const { roomId, roomTitle, maxCount, round, readyTime, speechTime, discussionTime, isSecretRoom, isGameOn, isGameReadyToStart, players, } = room;
    const participants = players.map((player) => {
        const { user, socketInfo, isReady, isHost } = player;
        const { userId, nickname, profileImg } = user;
        return { socketId: socketInfo, userId, nickname, profileImg, isReady, isHost };
    });
    const roomInfo = {
        roomId,
        roomTitle,
        maxCount,
        round,
        readyTime,
        speechTime,
        discussionTime,
        isSecretRoom,
        isGameOn,
        isGameReadyToStart,
        participants,
    };
    return roomInfo;
}
exports.updateRoomInfoConstructor = updateRoomInfoConstructor;
//# sourceMappingURL=update-room.info.constructor.js.map