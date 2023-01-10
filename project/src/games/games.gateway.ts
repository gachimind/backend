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
import { UpdateRoomListDto } from './dto/update-room-list..dto';
import { LoginUserToSocketDto } from '../users/dto/login-user.dto';
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

// @UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
@WebSocketGateway({ cors: true })
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
        const data: UpdateRoomListDto[] = roomList.map((room: CreateRoomDto) => {
            return {
                roomId: room.roomId,
                roomTitle: room.roomTitle,
                maxCount: room.maxCount,
                participants: room.participants.length,
                isSecreteRoom: room.isSecreteRoom,
                isGameOn: room.isGameOn,
            };
        });
        socket.emit('room-list', { data });
    }

    handleDisconnect(@ConnectedSocket() socket: Socket): any {
        // 접속이 종료된 회원의 정보를 socketIdMap에서 삭제
        socketIdMap[socket.id] = null;
        console.log('disconnected socket', socket.id);
    }
    @SubscribeMessage('log-in')
    socketIdMapToLoginUser(@ConnectedSocket() socket: Socket, @MessageBody() { data }: any) {
        // 넘겨 받은 jwt token을 검사하고 parsing 해서 socketIdMap 테이블에 추가하는 작업
        // 1. token 담긴 토큰값으로, authentication db table 에서 userId를 받아옴
        // 2. 받아온 userId 값을 이용해서, db에 있는 회원의 정보를 받아옴
        // 3. 받아온 정보를 socketIdMap table에 맵핑
        // - 이미 다른 socketId로 같은 회원이 맵핑되지 않았는지 확인
        // - 매핑 정보가 없다면 새롭게 매핑
        const token: string = data.authorization;

        // !!회원 인증 미들웨어 만들어서 붙여야 함!!!
        const userId = authentication[token];

        if (!userId) throw new SocketException('잘못된 접근입니다.', 401);

        // socketIdMap에서 동일 socketId가 있는지 확인 (로그인한 페이지에서 )
        if (socketIdMap[socket.id]) {
            socket.emit('log-in', { errorMessage: '이미 로그인된 회원입니다.', status: 403 });
            throw new SocketException('이미 로그인된 회원입니다.', 403);
        }

        // socketIdMap에서 value에 회원의 userId가 있으면, 이중 로그인을 간주하고, 에러 처리
        const connectedUsers: LoginUserToSocketDto[] = Object.values(socketIdMap);
        for (const user of connectedUsers) {
            if (user && user.userId === userId) {
                socket.emit('log-in', { errorMessage: '이미 로그인된 회원입니다.', status: 403 });
                throw new SocketException('이미 로그인된 회원입니다.', 403);
            }
        }

        // 위의 검사를 통과했다면, 회원 정보를 socket.id와 맵핑
        for (const user of fakeDBUserTable) {
            if (user.userId === userId) {
                socketIdMap[socket.id] = {
                    userId,
                    nickname: user.nickname,
                    profileImg: user.profileImg,
                };
            }
        }
        console.log('로그인 성공!');
        socket.emit('log-in', { message: '로그인 성공!' });
    }

    @SubscribeMessage('log-out')
    async socketIdMapToLogOutUser(@ConnectedSocket() socket: Socket) {
        socketIdMap[socket.id] = null;
    }

    @SubscribeMessage('create-room')
    async createRoomRequest(@ConnectedSocket() socket: Socket, @MessageBody() { data }: any) {
        // !!! 회원 인증 미들웨어 추가해야 함!!!!

        // 1. 새로 생성된 방의 정보를 서버 db (roomList)에 저장
        //      - 방 정보에, roomId, participants 정보를 추가
        //      - participants 정보에는 방에 입장한 순서대로, {userId, nickname, profileImg, isHost, isReady}
        const room: CreateRoomDto = data;
        const requestedUser = socketIdMap[socket.id];
        if (!requestedUser) {
            socket.emit('create-room', {
                errorMessage: '로그인이 필요한 서비스입니다.',
                status: 401,
            });
            throw new SocketException('로그인이 필요한 서비스입니다.', 403);
        }

        // roomList에 저장할 새로운 room 정보 추가
        room.roomId = roomList.length + 1;
        room.isGameOn = false;
        room.participants = [
            {
                userId: requestedUser.userId,
                nickname: requestedUser.nickname,
                profileImg: requestedUser.profileImg,
                isHost: true,
                isReady: false,
            },
        ];
        roomList.push(room);

        // socketId Map에 유저 정보 갱신
        requestedUser.currentRoom = room.roomId;
        console.log(requestedUser);

        // UpdateRoomList 처리
        const newRoom: UpdateRoomListDto = {
            roomId: room.roomId,
            roomTitle: room.roomTitle,
            maxCount: room.maxCount,
            participants: room.participants.length,
            isSecreteRoom: room.isSecreteRoom,
            isGameOn: room.isGameOn,
        };

        // 처리 된 데이터로 socket emit 처리 (모든 소켓에게 & 방 생성자를 방에 binding)
        await this.server.emit('create-room', { data: newRoom });
        return socket.join(`${room.roomId}`);
    }

    @SubscribeMessage('enter-room')
    async enterRoomRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: any,
    ): Promise<any> {
        const requestedUser = socketIdMap[socket.id];
        const room: EnterRoomDto = data;

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

    @SubscribeMessage('send-chat')
    sendChatRequest(@ConnectedSocket() socket: Socket, @MessageBody() { data }: any): any {
        const message: string = data.message;
        const { nickname, currentRoom } = socketIdMap[socket.id];
        this.server.to(`${currentRoom}`).emit('receive-chat', { data: { nickname, message } });
    }
}
