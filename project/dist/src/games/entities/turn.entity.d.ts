import { Room } from './room.entity';
export declare class Turn {
    turnId: number;
    roomInfo: number;
    room: Room;
    turn: number;
    speechPlayer: string;
    keyword: string;
    hint: string | null;
    createdAt: Date;
    updatedAt: Date;
}
