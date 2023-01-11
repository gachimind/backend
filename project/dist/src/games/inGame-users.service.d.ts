import { Socket } from 'socket.io';
export declare const socketIdMap: {};
export declare class InGameUsersService {
    handleDisconnect(socket: Socket): void;
    socketIdMapToLoginUser(token: string, socket: Socket): Promise<void>;
    socketIdMapToLogOutUser(socket: Socket): void;
}
