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
        // 참여자가 발표 시간이 아니라면 정답을 맞출 수 없다
        // 발표자가 준비/발표 시간이 아니라면 정답을 알 수 없다
        if (turn.currentEvent === 'readyTime' || turn.currentEvent === 'speechTime') {
            if (turn.speechPlayer !== userId && turn.currentEvent === 'readyTime') return false;

            const isAnswer: boolean = this.checkAnswer(turn, message);
            // 정답을 맞췄는데, 발표자라면 에러 던지기
            if (isAnswer) {
                console.log('isAnswer block');

                if (userId === turn.speechPlayer) {
                    throw new SocketException(
                        '발표자는 정답을 채팅으로 알릴 수 없습니다.',
                        400,
                        'send-chat',
                    );
                }
                // 참여자가 맞추면 점수 올리기
                return true;
            }
        }

        return false;
    }
}
