import { Injectable } from '@nestjs/common';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { Keyword } from 'src/keyword/entities/keyword.entities';
import { Turn } from './entities/turn.entity';
import { gameMap } from './util/game.map';
import { turnMap } from './util/turn.map';

@Injectable()
export class ChatService {
    checkAnswer(turn: Turn, message: string): boolean {
        const answer: Keyword = turnMap[turn.roomInfo].keyword;
        let answerEng: string;
        answer.keywordEng
            ? (answerEng = answer.keywordEng.toLocaleLowerCase().replace(/ /g, ''))
            : null;

        const answerKor = answer.keywordKor.replace(/ /g, '');
        const englishCheckReg = /^[a-zA-Z]+$/;
        if (englishCheckReg.test(message)) {
            message = message.toLocaleLowerCase().replace(/ /g, '');
        }
        message = message.replace(/ /g, '');

        if (message != answerKor || (answerEng && message != answerEng)) {
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
