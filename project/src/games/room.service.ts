import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.request.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { RoomDataInsertDto } from './dto/room.data.insert.dto';
import { LoginUserToSocketIdMapDto } from 'src/games/dto/socketId-map.request.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
    ) {}

    async getAllRoomList(): Promise<RoomInfoToMainDto[]> {
        const roomList: Room[] = await this.roomRepository.find({ order: { updatedAt: 'DESC' } });

        return roomList.map((room) => {
            const { roomId, roomTitle, maxCount, round, players, isSecretRoom, isGameOn } = room;
            return {
                roomId,
                roomTitle,
                maxCount,
                round,
                participants: players.length,
                isSecretRoom,
                isGameOn,
            };
        });
    }

    async getOneRoomByRoomId(roomId: number): Promise<Room> {
        return await this.roomRepository.findOne({
            where: { roomId },
            relations: { players: { socket: true } },
            order: { players: { createdAt: 'ASC' } },
        });
    }

    async removeRoomByRoomId(roomId: number): Promise<number | any> {
        return await this.roomRepository.delete(roomId);
    }

    async updateRoomStatusByRoomId(data: any): Promise<Room> {
        return this.roomRepository.save(data);
    }

    async createRoom(room: CreateRoomRequestDto): Promise<number> {
        if (!room.roomTitle) {
            room.roomTitle = '같이 가치마인드 한 판 해요!'; // 랜덤 방제 만들어서 넣기
        }
        // 비밀방에 true인데, 방 비밀번호가 없는 경우
        if (room.isSecretRoom && !room.roomPassword) {
            throw new SocketException('방 비밀번호를 입력해주세요.', 400, 'create-room');
        }
        // 비밀번호가 있다면, 비밀방 여부를 무조건 true로 만들기
        if (room.roomPassword) {
            room.isSecretRoom = true;
        }

        const newRoom: RoomDataInsertDto = {
            ...room,
            isGameOn: false,
            isGameReadyToStart: false,
        };

        const roomInsert = await this.roomRepository.insert(newRoom);
        return roomInsert.identifiers[0].roomId;
    }

    async enterRoom(
        requestUser: LoginUserToSocketIdMapDto,
        requestRoom: EnterRoomRequestDto,
    ): Promise<void> {
        // 1. 방이 존재하는지 확인, db에서 방 정보 조회
        const room: Room = await this.getOneRoomByRoomId(requestRoom.roomId);

        if (!room) {
            throw new SocketException('요청하신 방을 찾을 수 없습니다.', 404, 'enter-room');
        }

        // 2. 정원 초과 확인
        if (room.maxCount == room.players.length) {
            throw new SocketException('정원초과로 방 입장에 실패했습니다.', 400, 'enter-room');
        }

        // 3. 비밀방이라면 비밀번호 확인
        if (room.isSecretRoom) {
            if (!requestRoom.roomPassword || room.roomPassword !== requestRoom.roomPassword) {
                throw new SocketException('방 비밀번호가 올바르지 않습니다.', 400, 'enter-room');
            }
        }

        // 4. 검사를 모두 통과하면 유저를 방에 입장시킴
        let isHost;
        if (room.players.length === 0) isHost = true;
        else isHost = false;

        await this.playerRepository.insert({
            userInfo: requestUser.userInfo,
            socketInfo: requestUser.socketId,
            roomInfo: requestRoom.roomId,
            isReady: false,
            isHost,
        });
    }

    // 업데이트가 발생한 방의 정보를 받아, isGameReadyToStart 정보 갱신
    async updateIsGameReadyToStart(roomId: number): Promise<Room> {
        let room: Room = await this.getOneRoomByRoomId(roomId);
        // player가 2명 이상일때만 player의 isReady state을 검사
        if (room.players.length > 1) {
            const isAllPlayerReadyToStart = (() => {
                // host를 제외하고, 모든 player가 ready 상태이면, isAllPlayerReadyToStart를 true로 반환
                for (const player of room.players) {
                    if (!player.isHost && !player.isReady) return false;
                }
                return true;
            })();

            // 플레이어 준비 상태에 따라 room 정보 갱신
            if (isAllPlayerReadyToStart !== room.isGameReadyToStart) {
                await this.updateRoomStatusByRoomId({
                    roomId: room.roomId,
                    isGameReadyToStart: isAllPlayerReadyToStart,
                });
            }
            room = await this.getOneRoomByRoomId(room.roomId);
        }
        return room;
    }
}
