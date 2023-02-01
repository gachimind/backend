import { EventUserInfoDto } from '../dto/evnet-user.info.dto';
import { SocketIdMap } from '../entities/socketIdMap.entity';

export function eventUserInfoConstructor(requestUser: SocketIdMap | null): EventUserInfoDto | null {
    if (!requestUser) {
        return null;
    }
    return {
        socketId: requestUser.socketId,
        userId: requestUser.userInfo,
        nickname: requestUser.user.nickname,
        profileImg: requestUser.user.profileImg,
    };
}
