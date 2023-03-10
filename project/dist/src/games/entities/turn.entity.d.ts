import { Room } from './room.entity';
export declare class Turn {
    turnId: number;
    roomInfo: number;
    room: Room;
    turn: number;
    currentEvent: string;
    speechPlayer: number;
    speechPlayerNickname: string;
    keyword: string;
    hint: string;
    link: string;
    createdAt: Date;
    updatedAt: Date;
}
