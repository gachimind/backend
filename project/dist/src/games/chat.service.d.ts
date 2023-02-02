import { Turn } from './entities/turn.entity';
export declare class ChatService {
    checkAnswer(turn: Turn, message: string): boolean;
    FilterAnswer(turn: Turn, userId: number, message: string): boolean;
}
