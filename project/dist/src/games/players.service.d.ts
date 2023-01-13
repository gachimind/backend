import { Socket } from 'socket.io';
export declare const socketIdMap: {};
export declare class PlayersService {
    handleDisconnect(socket: Socket): void;
    socketIdMapToLoginUser(token: string, socket: Socket): Promise<void>;
    socketIdMapToLogOutUser(socket: Socket): void;
    handleLeaveRoom(socketId: any): void;
}
