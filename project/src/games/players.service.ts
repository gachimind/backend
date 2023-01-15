import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { LoginUserToSocketIdMapDto } from 'src/games/dto/socketId-map.request.dto';
import { TokenMap } from 'src/users/entities/token-map.entity';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
    constructor(
        @InjectRepository(TokenMap)
        private readonly tokenMapRepository: Repository<TokenMap>,
        @InjectRepository(SocketIdMap)
        private readonly socketIdMapRepository: Repository<SocketIdMap>,
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
    ) {}

    async getUserBySocketId(socketId: { socketId: string }): Promise<SocketIdMap> {
        const user: SocketIdMap = await this.socketIdMapRepository.findOne({
            where: socketId,
            relations: { playerInfo: { roomInfo: true } },
        });
        return user;
    }

    async getUserByUserID(userId: { userInfo: number }): Promise<SocketIdMap> {
        const user: SocketIdMap = await this.socketIdMapRepository.findOne({
            where: userId,
            relations: { playerInfo: { roomInfo: true } },
        });
        return user;
    }

    async removeSocketBySocketId(socketId: string) {
        return await this.socketIdMapRepository.delete(socketId);
    }

    async removePlayerByUserId(userId: number) {
        return await this.playerRepository.delete(userId);
    }

    async socketIdMapToLoginUser(token: string, socketId: string) {
        try {
            // 토큰을 이용해 userId를 찾기 // db에 없으면 fail
            const requestUser: TokenMap = await this.tokenMapRepository.findOneBy({
                token,
            });
            const userId: number = requestUser.userInfo.userId;
            console.log('userId from tokenMap: ', userId);

            if (!userId) {
                throw new SocketException('잘못된 접근입니다.', 401, 'log-in');
            }

            // socketIdMap에 scoketId 중복 체크 // db에 없어야 성공
            if (await this.getUserBySocketId({ socketId })) {
                console.log('socketId 중복!');
                throw new SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
            }

            // socketIdMap에서 userId로 등록된 정보가 있는지 조회 // db에 없어야 성공
            const userInfo = await this.getUserByUserID({ userInfo: userId });
            console.log(userInfo);

            if (userInfo) {
                console.log('userId 중복!');
                throw new SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
            }

            // 위의 검사를 통과했다면, socketIdMap에 매핑
            const user: LoginUserToSocketIdMapDto = { socketId, userInfo: userId };
            return await this.socketIdMapRepository.insert(user);
        } catch (err) {
            console.error(err);
            throw new SocketException(err.message, 400, 'log-in');
        }
    }
}
