import { RoomParticipantsDto } from '../dto/room.participants.dto';
import { RoomInfoToRoomDto } from '../dto/roomInfoToRoom.dto';
import { Room } from '../entities/room.entity';

export function updateRoomInfoConstructor(room: Room): RoomInfoToRoomDto {
    const {
        roomId,
        roomTitle,
        maxCount,
        readyTime,
        speechTime,
        discussionTime,
        isSecretRoom,
        isGameOn,
        isGameReadyToStart,
        players,
    } = room;

    const participants: RoomParticipantsDto[] = players.map((player) => {
        const { user, socketInfo, isReady, isHost } = player;
        const { userId, nickname, profileImg } = user;
        return { socketId: socketInfo, userId, nickname, profileImg, isReady, isHost };
    });

    const roomInfo: RoomInfoToRoomDto = {
        roomId,
        roomTitle,
        maxCount,
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
