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
import { RoomService } from './room.service';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { EnterRoomRequestDto } from './dto/enter-room.request.dto';
import { RoomInfoToMainDto } from './dto/roomInfoToMain.dto';
import {
    SocketException,
    SocketExceptionFilter,
} from 'src/common/exceptionFilters/ws-exception.filter';
import { PlayersService } from './players.service';
import { RoomInfoToRoomDto } from './dto/roomInfoToRoom.dto';
import { AuthorizationRequestDto } from 'src/users/dto/authorization.dto';
import { SocketIdMap } from './entities/socketIdMap.entity';
import { eventUserInfoConstructor } from './util/event.user.info.constructor';
import { EventUserInfoDto } from './dto/evnet-user.info.dto';
import { ChatService } from './chat.service';
import { UseFilters } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { updateRoomInfoToRoomConstructor } from './util/update-room.info.to.room.constructor';

@UseFilters(SocketExceptionFilter)
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly roomService: RoomService,
        private readonly playersService: PlayersService,
        private readonly chatService: ChatService,
    ) {}

    @WebSocketServer()
    public server: Server;

    afterInit(server: Server): any {
        console.log('webSocketServer init');
    }

    async handleConnection(@ConnectedSocket() socket: Socket) {
        console.log('connected socket', socket.id);
        const data: RoomInfoToMainDto[] = await this.roomService.getAllRoomList();
        socket.emit('room-list', { data });
        await this.roomService.removeRoomByRoomId(8);
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        // socketIdMap에서 유저 정보 가져오기
        const requestUser: SocketIdMap = await this.playersService.getUserBySocketId(socket.id);

        // socketIdMap에 유저정보가 없다면 바로 disconnect
        if (!requestUser) return console.log('disconnected socket', socket.id);

        // socketIdMap에서 삭제 -> Player 테이블과 Room 테이블에서 cascade
        await this.playersService.removeSocketBySocketId(socket.id);

        // 유저가 마지막으로 게임 방 안에 있었던 경우 처리
        if (requestUser.player) {
            // request user가 마지막 사람이었는지 확인하고 방삭제 or 방장 변경
            const isRoomDeleted: boolean = await this.updateRoomStatus(
                requestUser,
                requestUser.player.roomInfo,
            );
            // update된 방의 정보를 공유
            await this.updateRoomAnnouncement(
                requestUser,
                requestUser.player.roomInfo,
                'leave',
                isRoomDeleted,
            );
        }
        console.log('disconnected socket', socket.id);
    }

    @SubscribeMessage('log-in')
    async socketIdMapToLoginUser(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: { data: AuthorizationRequestDto },
    ) {
        // 토큰 유무 검사
        const token = data.authorization;
        if (!token) {
            throw new SocketException('잘못된 접근입니다.', 401, 'log-in');
        }
        // 토큰을 가지고 유저 정보를 얻어서 SocketIdMap에 추가
        await this.playersService.socketIdMapToLoginUser(token, socket.id);
        console.log('로그인 성공!');
        socket.emit('log-in', { message: '로그인 성공!' });
    }

    @SubscribeMessage('log-out')
    async socketIdMapToLogOutUser(@ConnectedSocket() socket: Socket) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id);
        if (requestUser.player) await this.handleUserToLeaveRoom(requestUser, socket);
        // socketIdMap에서 삭제 -> Player 테이블과 Room 테이블에서 cascade
        await this.playersService.removeSocketBySocketId(socket.id);
        console.log('로그아웃 성공!');
        socket.emit('log-out', { message: '로그아웃 성공!' });
    }

    @SubscribeMessage('create-room')
    async handleCreateRoomRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: { data: CreateRoomRequestDto },
    ) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id);

        // 입장을 요청한 유저가 다른 방에 속해있지 않은지 확인
        if (requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, 'enter-room');
        }

        // 방을 생성한 유저에게 새로 생성된 roomId 전달
        const roomId: number = await this.roomService.createRoom(data);
        socket.emit('create-room', { data: { roomId } });

        // main space에 room list를 업데이트
        const updateRoomList: RoomInfoToMainDto[] = await this.roomService.getAllRoomList();
        // !!! namespce 설정해줘야 함!!!
        this.server.emit('room-list', { data: updateRoomList });
    }

    @SubscribeMessage('enter-room')
    async handleEnterRoomRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data: requestRoom }: { data: EnterRoomRequestDto },
    ) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id);

        // 1. 입장을 요청한 유저가 방에 속해있는지 확인 -> player 정보가 있으면 에러
        if (requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, 'enter-room');
        }

        // 2. 입장을 요청한 유저를 방에 입장 처리
        await this.roomService.enterRoom(requestUser, requestRoom);
        socket.join(`${requestRoom.roomId}`);

        await this.updateRoomAnnouncement(requestUser, requestRoom.roomId, 'enter');
    }

    @SubscribeMessage('ready')
    async handleReadyEvent(@ConnectedSocket() socket: Socket) {
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id);

        // 1. 입장을 요청한 유저가 방에 속해있는지 확인 -> player 정보가 없으면 에러
        if (!requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, 'enter-room');
        }

        // 2. ready event를 emit한 Player 정보를 업데이트
        await this.playersService.setPlayerReady(requestUser.player);

        // 3. db에서 room 정보를 조회해 player 모두 ready인지 확인
        const room: Room = await this.roomService.updateIsGameReadyToStart(
            requestUser.player.roomInfo,
        );

        // 방 안에 update room info announce
        const eventUserInfo = eventUserInfoConstructor(requestUser);
        const updateRoomInfo: RoomInfoToRoomDto = updateRoomInfoToRoomConstructor(room);
        this.server.to(`${updateRoomInfo.roomId}`).emit('update-room', {
            data: { room: updateRoomInfo, eventUserInfo, event: 'ready' },
        });
    }

    @SubscribeMessage('leave-room')
    async handleLeaveRoomEvent(@ConnectedSocket() socket: Socket) {
        // socketIdMap에 포함된 유저인지 검사 -> !!authGuard 만들어서 달기!!
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id);
        await this.handleUserToLeaveRoom(requestUser, socket);
    }

    @SubscribeMessage('send-chat')
    async sendChatRequest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { data }: { data: { message: string } },
    ) {
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id);
        const eventUserInfo = eventUserInfoConstructor(requestUser);
        this.server
            .to(`${requestUser.player.roomInfo}`)
            .emit('receive-chat', { data: { message: data.message, eventUserInfo } });
    }

    @SubscribeMessage('webrtc-ice')
    async handleIce(
        @ConnectedSocket() socket: Socket,
        @MessageBody()
        { data },
    ) {
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id);
        if (!requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, 'webrtc-ice');
        }
        const { candidateReceiveSocketId, ice } = data;
        socket.broadcast
            .to(candidateReceiveSocketId)
            .emit('webrtc-ice', { data: { ice, iceSendSocketId: socket.id } });
    }

    @SubscribeMessage('webrtc-offer')
    async handleOffer(@ConnectedSocket() socket: Socket, @MessageBody() { data }) {
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id);
        if (!requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, 'webrtc-ice');
        }
        const { sessionDescription, offerReceiveSocketId } = data;
        socket.broadcast
            .to(offerReceiveSocketId)
            .emit('webrtc-offer', { data: { sessionDescription, offerSendSocketId: socket.id } });
    }

    @SubscribeMessage('webrtc-answer')
    async handleAnswer(@ConnectedSocket() socket: Socket, @MessageBody() { data }) {
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id);
        if (!requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, 'webrtc-ice');
        }
        const { sessionDescription, answerReceiveSocketId } = data;
        socket.broadcast
            .to(answerReceiveSocketId)
            .emit('webrtc-answer', { data: { sessionDescription, answerSendSocketId: socket.id } });
    }

    @SubscribeMessage('webrtc-leave')
    async handler(@ConnectedSocket() socket: Socket) {
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id);
        if (!requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, 'webrtc-ice');
        }
        this.server
            .to(`${requestUser.player.roomInfo}`)
            .emit('webrtc-leave', { data: { leaverSocketId: socket.id } });
    }

    @SubscribeMessage('update-userstream')
    async handleChangeStream(@ConnectedSocket() socket: Socket, @MessageBody() { data }) {
        const requestUser: SocketIdMap = await this.socketAuthentication(socket.id);
        if (!requestUser.player) {
            throw new SocketException('잘못된 접근입니다.', 400, 'webrtc-ice');
        }
        this.server.to(`${requestUser.player.roomInfo}`).emit('update-userstream', {
            data: { socketId: socket.id, video: data.video, audio: data.audio },
        });
    }

    async socketAuthentication(socketId: string) {
        const requestUser: SocketIdMap = await this.playersService.getUserBySocketId(socketId);
        if (!requestUser) {
            throw new SocketException('로그인이 필요한 서비스입니다.', 403, 'create-room');
        }
        return requestUser;
    }

    async handleUserToLeaveRoom(requestUser: SocketIdMap, socket: Socket) {
        if (!requestUser.player) {
            throw new SocketException('잘못된 요청입니다.', 400, 'leave-room');
        }
        // request user를 방에서 삭제
        await this.RemovePlayerFormRoom(requestUser, socket);
        // request user가 마지막 사람이었는지 확인하고 방삭제 or 방장 변경
        const isRoomDeleted: boolean = await this.updateRoomStatus(
            requestUser,
            requestUser.player.roomInfo,
        );
        // update된 방의 정보를 공유
        await this.updateRoomAnnouncement(
            requestUser,
            requestUser.player.roomInfo,
            'leave',
            isRoomDeleted,
        );
    }

    async RemovePlayerFormRoom(requestUser: SocketIdMap, socket: Socket) {
        // request user를 leave처리
        socket.leave(`${requestUser.player.roomInfo}`);
        // request user를 player 테이블에서 삭제
        await this.playersService.removePlayerByUserId(requestUser.userInfo);
    }

    async updateRoomStatus(requestUser: SocketIdMap, roomId: number): Promise<boolean> {
        const updateRoom: Room = await this.roomService.getOneRoomByRoomId(roomId);

        // 방 안에 request user만 남아있었다면, 방 폭파
        if (!updateRoom.players.length) {
            await this.roomService.removeRoomByRoomId(updateRoom.roomId);
            return true;
        }
        // 방 안에 누가 남아있고, 나간 유저가 방장이었다면, playerInfo 배열의 0번째 index player를 방장으로 업데이트
        else if (requestUser.player.isHost) {
            const newHostUser = {
                userInfo: updateRoom.players[0].userInfo,
                isHost: true,
            };
            await this.playersService.updatePlayerStatusByUserId(newHostUser);
            return false;
        }
    }

    async updateRoomAnnouncement(
        requestUser: SocketIdMap,
        roomId: number,
        event: string,
        isRoomDeleted: boolean | void,
    ) {
        // eventUserInfo 생성
        const eventUserInfo: EventUserInfoDto = eventUserInfoConstructor(requestUser);

        // 방이 남아있다면, 방 안의 사람들에게 방 정보 업데이트 !!! namespace!!!
        if (!isRoomDeleted) {
            const updateRoomInfo: RoomInfoToRoomDto = updateRoomInfoToRoomConstructor(
                await this.roomService.getOneRoomByRoomId(roomId),
            );
            this.server.to(`${roomId}`).emit('update-room', {
                data: { room: updateRoomInfo, eventUserInfo, event },
            });
        }

        // main space에 room-list event emit -> !!!namespace 설정하기!!!
        const roomInfoList = await this.roomService.getAllRoomList();
        this.server.except(`${roomId}`).emit('room-list', { data: roomInfoList });
    }
}
