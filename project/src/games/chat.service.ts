import { Injectable } from '@nestjs/common';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { Turn } from './entities/turn.entity';

@Injectable()
export class ChatService {
    checkAnswer(turn: Turn, message: string): boolean {
        // 대소문자 구분 없이
        // 한글+영어 있는 경우 처리?
        message = message.replace(/ /g, '').toLowerCase();
        const keyword = turn.keyword.replace(/ /g, '').toLowerCase();
        if (message != keyword) {
            return false;
        }
        return true;
    }

    FilterAnswer(turn: Turn, userId: number, message: string): boolean {
        // 발표자가 준비/발표 시간이 아니라면 정답을 알 수 없다
        if (turn.currentEvent === 'readyTime' || turn.currentEvent === 'speechTime') {
            // 참여자가 발표 시간이 아니라면 정답을 맞출 수 없다
            if (turn.speechPlayer !== userId && turn.currentEvent !== 'speechTime') return false;

            const isAnswer: boolean = this.checkAnswer(turn, message);
            // 정답을 맞췄는데, 발표자라면 에러 던지기
            if (isAnswer) {
                console.log('정답이다!');

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
