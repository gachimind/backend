import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.request.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { RoomDataInsertDto } from './dto/room.data.insert.dto';
import { RoomInfoToRoomDto } from './dto/roomInfoToRoom.dto';
import { LoginUserToSocketIdMapDto } from 'src/games/dto/socketId-map.request.dto';
import { Player } from './entities/player.entity';
import { participantsListMapper } from './util/participants-list.mapper';

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
            const { roomId, roomTitle, maxCount, round, players, isSecreteRoom, isGameOn } = room;
            return {
                roomId,
                roomTitle,
                maxCount,
                round,
                participants: players.length,
                isSecreteRoom,
                isGameOn,
            };
        });
    }

    async getOneRoomByRoomId(roomId: number): Promise<Room> {
        return await this.roomRepository.findOne({
            where: { roomId },
            relations: { players: { socket: true } },
        });
    }

    async removeRoomByRoomId(roomId: number): Promise<number | any> {
        return await this.roomRepository.delete(roomId);
    }

    async updateRoomInfoToRoom(roomId: number): Promise<RoomInfoToRoomDto> {
        const room: Room = await this.getOneRoomByRoomId(roomId);

        const {
            roomTitle,
            maxCount,
            round,
            readyTime,
            speechTime,
            discussionTime,
            isSecreteRoom,
            isGameOn,
            isGameReadyToStart,
            players,
        } = room;
        const participants = participantsListMapper(players);
        const roomInfo: RoomInfoToRoomDto = {
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

    async createRoom(room: CreateRoomRequestDto): Promise<number> {
        if (!room.roomTitle) {
            room.roomTitle = '같이 가치마인드 한 판 해요!'; // 랜덤 방제 만들어서 넣기
        }
        if (room.isSecreteRoom && !room.roomPassword) {
            throw new SocketException('잘못된 요청입니다.', 400, 'create-room');
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
        if (room.isSecreteRoom) {
            if (!requestRoom.roomPassword || room.roomPassword !== requestRoom.roomPassword) {
                throw new SocketException('요청하신 방을 찾을 수 없습니다.', 404, 'enter-room');
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
}
