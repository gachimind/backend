import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseInterceptors } from '@nestjs/common';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { ResultToDataInterceptor } from 'src/common/interceptors/resultToData.interceptor';
import { RoomService } from './room.service';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { EnterRoomDto } from './dto/enter-room.dto';
import { RoomInfoDto } from './dto/room.info.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';

const roomList = [];
const socketIdMap = {}; // {socket.id : {nickname, profileImg, currentRoom}}
const authentication = { token1: 1, token2: 2, token3: 3 }; // {token : userId} in db
const fakeDBUserTable = [
    {
        userId: 1,
        email: 'test1@email.com',
        nickname: '세현1',
        profileImg:
            'https://t3.ftcdn.net/jpg/02/95/94/94/360_F_295949484_8BrlWkTrPXTYzgMn3UebDl1O13PcVNMU.jpg',
    },
    {
        userId: 2,
        email: 'test2@email.com',
        nickname: '예나1',
        profileImg:
            'https://t3.ftcdn.net/jpg/02/95/94/94/360_F_295949484_8BrlWkTrPXTYzgMn3UebDl1O13PcVNMU.jpg',
    },
    {
        userId: 3,
        email: 'test1@email.com',
        nickname: '도영1',
        profileImg:
            'https://t3.ftcdn.net/jpg/02/95/94/94/360_F_295949484_8BrlWkTrPXTYzgMn3UebDl1O13PcVNMU.jpg',
    },
];

@UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
@WebSocketGateway()
export class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly roomService: RoomService,
        private readonly chatService: ChatService,
    ) {}
    @WebSocketServer()
    public server: Server;

    afterInit(server: Server): any {
        console.log('webSocketServer init');
    }

    handleConnection(@ConnectedSocket() socket: Socket): any {
        console.log('connected socket', socket.id);
        const data: RoomInfoDto[] = roomList.map((room: CreateRoomDto) => {
            return {
                roomId: room.roomId,
                roomTitle: room.roomTitle,
                maxCount: room.maxCount,
                participants: room.participants.length,
                IsSecreteRoom: room.IsSecreteRoom,
            };
        });
        socket.emit('room-list', { data });
    }

    handleDisconnect(@ConnectedSocket() socket: Socket): any {
        console.log('disconnected socket', socket.id);
    }
    @SubscribeMessage('log-in')
    socketIdMapToLoginUser(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        console.log();
        // 넘겨 받은 jwt token을 검사하고 parsing 해서 socketIdMap 테이블에 추가하는 작업
        // 1. token 담긴 토큰값으로, authentication db table 에서 userId를 받아옴
        // 2. 받아온 userId 값을 이용해서, db에 있는 회원의 정보를 받아옴
        // 3. 받아온 정보를 socketIdMap talble에 맵핑
        const token: string = data.data.authentication;
        const userId = authentication[token];
        if (!userId) throw new SocketException('잘못된 접근입니다.', 401);
        for (const user of fakeDBUserTable) {
            if (user.userId === userId) {
                socketIdMap[socket.id] = {
                    nickname: user.nickname,
                    profileImg: user.profileImg,
                };
            }
        }
    }

    @SubscribeMessage('create-room')
    createRoomRequest(@ConnectedSocket() socket: Socket, @MessageBody() room: CreateRoomDto): any {
        room.roomId = roomList.length + 1;
        //socketId map 테이블에서 유저 정보를 꺼내와야함
        const nickname = socketIdMap[socket.id].nickname;
        socketIdMap[socket.id].currentRoom = room.roomId;
        room.participants = ['nickname'];
        roomList.push(room);
        const newRoom: RoomInfoDto = {
            roomId: room.roomId,
            roomTitle: room.roomTitle,
            maxCount: room.maxCount,
            participants: room.participants.length,
            IsSecreteRoom: room.IsSecreteRoom,
        };
        socket.join(`${room.roomId}`);
        return socket.broadcast.emit('create-room', { data: newRoom });
    }

    @SubscribeMessage('enter-room')
    enterRoomRequest(@ConnectedSocket() socket: Socket, @MessageBody() room: EnterRoomDto): any {
        for (const existRoom of roomList) {
            if (existRoom.roomId === room.roomId) {
                if (existRoom.maxCount > existRoom.participants.length) {
                    if (existRoom.IsSecreteRoom) {
                        if (existRoom.roomPassword === room.roomPassword) {
                            const nickname = socketIdMap[socket.id].nickname;
                            socketIdMap[socket.id].currentRoom = room.roomId;
                            existRoom.participants.push(nickname);
                            socket.join(`${room.roomId}`);
                            socket.to(`${room.roomId}`).emit('welcome');
                        } else {
                            throw new SocketException('비밀번호가 일치하지 않습니다.', 403);
                            socket.emit('enter-room', {
                                errorMessage: '비밀번호가 일치하지 않습니다.',
                                status: 403,
                            });
                        }
                    } else {
                        const nickname = socketIdMap[socket.id].nickname;
                        socketIdMap[socket.id].currentRoom = room.roomId;
                        existRoom.participants.push(nickname);
                        socket.join(`${room.roomId}`);
                        socket.to(`${room.roomId}`).emit('welcome');
                    }
                } else {
                    throw new SocketException('정원초과로 방 입장에 실패했습니다.', 400);
                    socket.emit('enter-room', {
                        errorMessage: '정원초과로 방 입장에 실패했습니다.',
                        status: 400,
                    });
                }
            }
        }
    }
    @SubscribeMessage('send-chat')
    sendChatRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() chat: string,
        server: Server,
    ): any {
        const { nickname, profileImg, currentRoom } = socketIdMap[socket.id];
        server.to(`${currentRoom}`).emit('receive-chat', { data: { nickname, profileImg, chat } });
    }
}
