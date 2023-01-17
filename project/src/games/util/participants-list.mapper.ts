export const participantsListMapper = (playerInfo) => {
    return playerInfo.map((player) => {
        const { user, socketInfo, isReady, isHost } = player;
        const { userId, nickname, profileImg } = user;
        const { socketId } = socketInfo;
        return { socketId, userId, nickname, profileImg, isReady, isHost };
    });
};
