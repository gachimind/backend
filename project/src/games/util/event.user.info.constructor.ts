import { EventUserInfoDto } from '../dto/evnet-user.info.dto';

export function eventUserInfoConstructor(requestUser): EventUserInfoDto {
    return {
        socketId: requestUser.socketId,
        userId: requestUser.userInfo.userId,
        nickname: requestUser.userInfo.nickname,
        profileImg: requestUser.userInfo.profileImg,
    };
}
