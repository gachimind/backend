import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { Repository } from 'typeorm';
import { GameResult } from './entities/gameResult.entity';
import { Room } from './entities/room.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';
import { gameMap } from './util/game.map';

@Injectable()
export class ChatService {
    checkAnswer(turn: Turn, message: string): boolean {
        if (message != turn.keyword) {
            return false;
        }
        return true;
    }

    FilterAnswer(turn: Turn, userId: number, message: string): boolean {
        const isAnswer: boolean = this.checkAnswer(turn, message);
        if (!isAnswer) return false;

        if (userId === turn.speechPlayer && turn.currentEvent === ('readyTime' || 'speechTime')) {
            throw new SocketException(
                '발표자는 정답을 채팅으로 알릴 수 없습니다.',
                400,
                'send-chat',
            );
        }

        if (turn.currentEvent === 'speechTime') {
            return true;
        }
    }
}
