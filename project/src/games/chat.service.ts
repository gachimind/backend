import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { User } from 'src/users/entities/user.entity';
import { createSecurePair } from 'tls';
import { Repository } from 'typeorm';
import { TurnResultDataInsertDto } from './dto/turn-result.data.insert.dto';
import { GameResult } from './entities/gameResult.entity';
import { Room } from './entities/room.entity';
import { Turn } from './entities/turn.entity';
import { TurnResult } from './entities/turnResult.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        @InjectRepository(Turn)
        private readonly turnRepository: Repository<Turn>,
        @InjectRepository(TurnResult)
        private readonly turnResultRepository: Repository<TurnResult>,
        @InjectRepository(GameResult)
        private readonly gameResultRepository: Repository<GameResult>,
    ) {}

    checkAnswer(message: string, room: Room): boolean {
        const currentTurn = room.turns.at(-1);
        if (message != currentTurn.keyword) {
            return false;
        }
        return true;
    }

    async recordScore(user: User, roomId: number): Promise<TurnResult> {
        const room: Room = await this.roomRepository.findOneBy({ roomId });
        const currentTurn = room.turns.at(-1);
        console.log('요청 유저 닉네임', user.nickname);
        console.log('현재 턴 발표자 닉네임', currentTurn.speechPlayer);

        if (user.userId === currentTurn.speechPlayer) {
            throw new SocketException('발표자는 정답을 맞출 수 없습니다.', 400, 'send-chat');
        }
        const turnResults: TurnResult[] = await this.turnResultRepository.find({
            where: { roomId, turn: currentTurn.turn },
        });
        for (let result of turnResults) {
            if (user.nickname === result.nickname) {
                throw new SocketException('정답을 이미 맞추셨습니다!', 400, 'send-chat');
            }
        }
        const myRank = turnResults.length;
        const score = 100 - myRank * 20;
        const gameResult = await this.gameResultRepository.findOne({
            where: {
                userInfo: user.userId,
                roomId: room.roomId,
            },
        });
        const turnResult: TurnResultDataInsertDto = {
            gameResultInfo: gameResult.gameResultId,
            roomId: room.roomId,
            turn: currentTurn.turn,
            nickname: user.nickname,
            score,
            keyword: currentTurn.keyword,
            isSpeech: false,
        };
        return await this.turnResultRepository.save(turnResult);
    }
}
