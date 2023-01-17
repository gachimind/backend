export const participantsListMapper = (playerInfo) => {
    return playerInfo.map((player) => {
        const { user, socketInfo, isReady, isHost } = player;
        const { userId, nickname, profileImg } = user;
        return { socketId: socketInfo, userId, nickname, profileImg, isReady, isHost };
    });
};
