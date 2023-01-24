import { Room } from './room.entity';
export declare class Turn {
    turnId: number;
    roomInfo: number;
    room: Room;
    turn: number;
    currentEvent: string;
    speechPlayer: number;
    keyword: string;
    hint: string | null;
    createdAt: Date;
    updatedAt: Date;
}
