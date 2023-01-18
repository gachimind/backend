"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomInfoToRoomConstructor = void 0;
function updateRoomInfoToRoomConstructor(room) {
    const { roomId, roomTitle, maxCount, round, readyTime, speechTime, discussionTime, isSecreteRoom, isGameOn, isGameReadyToStart, players, } = room;
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
        isSecreteRoom,
        isGameOn,
        isGameReadyToStart,
        participants,
    };
    return roomInfo;
}
exports.updateRoomInfoToRoomConstructor = updateRoomInfoToRoomConstructor;
//# sourceMappingURL=update-room.info.to.room.constructor.js.map