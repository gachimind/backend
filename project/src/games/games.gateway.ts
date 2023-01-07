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
import { UseFilters } from '@nestjs/common/decorators';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';

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
        throw new SocketException('test', 400);
    }

    handleDisconnect(@ConnectedSocket() socket: Socket): any {
        console.log('disconnected socket', socket.id);
    }

    // API 명세서대로 아래에 구현
    @SubscribeMessage('eventName')
    handleMessage(@ConnectedSocket() client: Socket, payload: any): string {
        return 'Hello world!';
    }
}
