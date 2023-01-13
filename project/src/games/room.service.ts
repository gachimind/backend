import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import {
    SocketException,
    SocketExceptionStatus,
} from 'src/common/exceptionFilters/ws-exception.filter';
import { RoomDataDto } from './dto/room.data.dto';
import { RoomInfoToRoomDto } from './dto/roomInfoToRoom.dto';
import { LoginUserToSocketDto } from 'src/users/dto/login-user.dto';
import { RoomParticipantsDto } from './dto/room.participants.dto';

const roomList = []; // repository로 변경해야 함

@Injectable()
export class RoomService {
    async getAllRoomList(): Promise<RoomInfoToMainDto[]> {
        return await roomList.map((room) => {
            const { roomId, roomTitle, maxCount, round, participants, isSecreteRoom, isGameOn } =
                room;
            return {
                roomId,
                roomTitle,
                maxCount,
                round,
                participants: participants.length,
                isSecreteRoom,
                isGameOn,
            };
        });
    }

    createRoom(room: CreateRoomRequestDto): number {
        const newRoom: RoomDataDto = {
            roomId: roomList.length + 1,
            ...room,
            isGameOn: false,
            participants: [],
            isGameReadyToStart: false,
        };
        if (!room.roomTitle) {
            newRoom.roomTitle = '같이 가치마인드 한 판 해요!'; // 랜덤 방제 만들어서 넣기
        }
        // roomList에 생성된 방 정보 추가 -> db로 옮길 예정
        roomList.push(newRoom);
        return newRoom.roomId;
    }

    async isRoomAvailable(requestUser: LoginUserToSocketDto, requestRoom: EnterRoomRequestDto) {
        // 1. 방이 존재하는지 확인, db에서 방 정보 조회
        const room = await roomList.find((data) => {
            return data.roomId === requestRoom.roomId;
        });
        let status: SocketExceptionStatus;
        if (!room) {
            status = 404;
            return { availability: false, message: '요청하신 방을 찾을 수 없습니다.', status };
        }

        // 2. 정원 초과 확인
        if (room.maxCount == room.participants.length) {
            status = 400;
            return {
                availability: false,
                message: '정원초과로 방 입장에 실패했습니다.',
                status,
            };
        }

        // 3. 비밀방이라면 비밀번호 확인
        if (room.IsSecreteRoom) {
            if (!requestRoom.roomPassword || room.roomPassword !== requestRoom.roomPassword) {
                status = 404;
                return {
                    availability: false,
                    message: '비밀번호가 일치하지 않습니다.',
                    status,
                };
            }
        }

        // 4. 입장을 요청한 유저가 이미 방 안에 있는지 검사
        const userInRoom = room.participants.find((user) => {
            return user.userId === requestUser.userId;
        });
        if (userInRoom) {
            status = 400;
            return {
                availability: false,
                message: '같은 방에 중복 입장할 수 없습니다.',
                status,
            };
        }
        return { availability: true, message: '방 입장에 성공하였습니다.', room };
    }

    async updateRoomParticipants(
        socketId: string,
        requestUser: LoginUserToSocketDto,
        roomInfo: RoomDataDto,
    ): Promise<RoomInfoToRoomDto | any> {
        let isHost: boolean;
        if (!roomInfo.participants.length) isHost = true;

        const { currentRoom, ...userInfo } = requestUser;
        roomInfo.participants.push({
            socketId,
            ...userInfo,
            isReady: false,
            isHost,
        });

        roomList.map((room: RoomDataDto, index: number) => {
            if (room.roomId === roomInfo.roomId) {
                return (roomList[index] = roomInfo);
            }
        });

        return roomInfo;
    }

    async leaveRoom(requestUser: LoginUserToSocketDto) {
        // roomList에서 방 정보 가져오기
        const targetRoom = await roomList.find((room) => {
            return room.roomId === requestUser.currentRoom;
        });

        if (!targetRoom) throw new SocketException('bad request', 400, 'leave-room');
        // targetRoom participants 정보 업데이트
        // 방에 남은 인원이 2명 이상이면, 방 정보 업데이트
        if (targetRoom.participants.length > 1) {
            targetRoom.participants.map((user: RoomParticipantsDto, index) => {
                if (user.userId === requestUser.userId) {
                    // requestUser가 방장이라면, 배열의 1번째 유저를 방장으로 변경하고, requestUser 정보 삭제
                    if (user.isHost) {
                        targetRoom.participants[1].isHost = true;
                    }
                    return targetRoom.participants.splice(index, 1);
                }
            });

            roomList.map((room: RoomDataDto, index: number) => {
                if (room.roomId === targetRoom.roomId) {
                    return (roomList[index] = targetRoom);
                }
            });
            return targetRoom;
        } // 요청한 유저가 방에 남은 마지막 사람이면, 방 삭제
        else {
            const roomIndex = roomList.findIndex((room) => room.roomId === targetRoom.roomId);

            roomList.splice(roomIndex, 1);
            return null;
        }
    }
}
