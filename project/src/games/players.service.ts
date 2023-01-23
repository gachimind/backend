import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { LoginUserToSocketIdMapDto } from 'src/games/dto/socketId-map.request.dto';
import { TokenMap } from 'src/users/entities/token-map.entity';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { Player } from './entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import { Socket } from 'socket.io';

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

    async getUserBySocketId(socketId: string): Promise<SocketIdMap> {
        const user: SocketIdMap = await this.socketIdMapRepository.findOne({
            where: { socketId },
            relations: {
                player: { room: true },
            },
        });
        return user;
    }

    async getUserByUserID(userId: number): Promise<SocketIdMap> {
        const user: SocketIdMap = await this.socketIdMapRepository.findOne({
            where: { userInfo: userId },
            relations: { player: { room: true } },
        });

        return user;
    }

    async getPlayerBySocketId(socketInfo: string): Promise<Player> {
        const player: Player = await this.playerRepository.findOne({
            where: { socketInfo },
            relations: { room: true },
            select: { roomInfo: true },
        });
        return player;
    }

    async updatePlayerStatusByUserId(user): Promise<Player> {
        return await this.playerRepository.save(user);
    }

    async removeSocketBySocketId(socketId: string): Promise<number | any> {
        return await this.socketIdMapRepository.delete(socketId);
    }

    async removePlayerByUserId(userId: number | User): Promise<number | any> {
        return await this.playerRepository.delete(userId);
    }

    async socketIdMapToLoginUser(token: string, socketId: string) {
        // 토큰을 이용해 userId를 찾기 // db에 없으면 fail
        const requestUser: TokenMap = await this.tokenMapRepository.findOneBy({ token });
        const userId: number = requestUser.userInfo;

        if (!userId) {
            throw new SocketException('사용자 정보를 찾을 수 없습니다', 404, 'log-in');
        }

        // socketIdMap에 scoketId 중복 체크 // db에 없어야 성공
        if (await this.getUserBySocketId(socketId)) {
            throw new SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
        }

        // socketIdMap에서 userId로 등록된 정보가 있는지 조회 -> 있다면 로그인 정보를 갱신하고, 기존 socket정보는 삭제
        const prevLoinInfo = await this.getUserByUserID(userId);
        if (prevLoinInfo) {
            await this.removeSocketBySocketId(prevLoinInfo.socketId);
            // TODO : socketIdMap에서 삭제된 소켓의 정보를 찾아서 disconnect -> how?
        }

        // 위의 검사를 통과했다면, socketIdMap에 매핑
        const user: LoginUserToSocketIdMapDto = { socketId, userInfo: userId };
        return await this.socketIdMapRepository.save(user);
    }

    async setPlayerReady(player: Player): Promise<Player> {
        let user;
        if (!player.isReady) {
            user = { userInfo: player.userInfo, isReady: true };
        } else {
            user = { userInfo: player.userInfo, isReady: false };
        }
        return await this.updatePlayerStatusByUserId(user);
    }
}
