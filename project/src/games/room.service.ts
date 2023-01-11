import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { RoomDataDto } from './dto/room.data.dto';
import { RoomInfoToRoomDto } from './dto/roomInfoToRoom.dto';

const roomList = []; // repository로 변경해야 함

@Injectable()
export class RoomService {
    getAllRoomList(): RoomInfoToMainDto[] {
        return roomList.map((room: RoomDataDto) => {
            return {
                roomId: room.roomId,
                roomTitle: room.roomTitle,
                maxCount: room.maxCount,
                round: room.round,
                participants: room.participants.length,
                isSecreteRoom: room.isSecreteRoom,
                isGameOn: room.isGameOn,
            };
        });
    }

    async getRoomInfo(roomId: number): Promise<RoomInfoToRoomDto> {
        const roomInfo: RoomDataDto = await roomList.find((room) => {
            room.roomId === roomId;
        });
        const { roomPassword, ...roomInfoExceptRoomPassword } = roomInfo;

        return roomInfoExceptRoomPassword;
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

        // retunr new roomId
        return newRoom.roomId;
    }

    /*
    // 유저가 방에 입장하는 동작만 처리
    enterRoom(socket: Socket, room: EnterRoomRequestDto) {
        // Set을 사용해서 검색 속도를 올릴 수는 없을까??
        // for of 사용 vs map을 사용?? callback 자리에 아래 처럼 긴 로직을 넣는 게 맞나??
        for (const existRoom of roomList) {
            if (existRoom.roomId !== room.roomId) {
                socket.emit('enter-room', {
                    errorMessage: '방을 찾을 수 없습니다.',
                    status: 404,
                });
                throw new SocketException('방을 찾을 수 없습니다.', 404);
            }
            if (existRoom.maxCount === existRoom.participants.length) {
                socket.emit('enter-room', {
                    errorMessage: '정원초과로 방 입장에 실패했습니다.',
                    status: 400,
                });
                throw new SocketException('정원초과로 방 입장에 실패했습니다.', 400);
            }
            if (existRoom.IsSecreteRoom) {
                if (existRoom.roomPassword !== room.roomPassword) {
                    socket.emit('enter-room', {
                        errorMessage: '비밀번호가 일치하지 않습니다.',
                        status: 403,
                    });
                    throw new SocketException('비밀번호가 일치하지 않습니다.', 403);
                }
            }

            const findUserInRoom = existRoom.participants.filter((user) => {
                return user.userId === requestedUser.userId;
            });
            if (findUserInRoom) {
                socket.emit('enter-room', {
                    errorMessage: '잘못된 요청입니다.',
                    status: 400,
                });
                throw new SocketException('비밀번호가 일치하지 않습니다.', 403);
            }
            //모든 검사 로직을 통과하면, 사용자를 방에 입장 처리
            // - roomList의 해당 room의 participants 정보를 갱신
            // -
            existRoom.participants.push({
                userId: requestedUser.userId,
                nickname: requestedUser.nickname,
                profileImg: requestedUser.profileImg,
                isHost: false,
                isReady: false,
            });

            // socketIdMap에서 해당 유저의 방 정보 갱신
            requestedUser.currentRoom = room.roomId;

            // 처리 된 데이터로 socket emit 처리 (모든 소켓에게 & 방 생성자를 방에 binding)
            await this.server.to(`${room.roomId}`).emit('update-room', { data: existRoom });
            socket.join(`${room.roomId}`);
            // 이렇게 하면, 다른 방에 있는 유저에게까지 정보가 넘어감....
            this.server.except(`${room.roomId}`).emit('update-room-list', {
                data: {
                    roomId: existRoom.roomId,
                    roomTitle: existRoom.roomTitle,
                    maxCount: existRoom.maxCount,
                    round: existRoom.round,
                    participants: existRoom.participants.length,
                    isSecreteRoom: existRoom.isSecreteRoom,
                    isGameOn: existRoom.isGameOn,
                },
            });
            console.log('enter room', existRoom);
        }
    }
    */
}
