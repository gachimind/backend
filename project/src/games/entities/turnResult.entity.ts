import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { GameResult } from './gmaeResult.entity';
import { Turn } from './turn.entity';

@Entity()
export class TurnResult {
    @PrimaryGeneratedColumn()
    turnResultId: number;

    @Column({ name: 'gameResultInfo' })
    gameResultInfo: number;
    @ManyToOne(() => GameResult, (gameResult) => gameResult.gameResultId)
    @JoinColumn({ name: 'gameResultInfo' })
    gameResult: GameResult;

    @Column()
    roomId: number;

    @Column({ type: 'tinyint' })
    turn: number;

    @Column()
    nickname: string;

    @Column({ type: 'tinyint' })
    score: number;

    @Column()
    keyword: string;

    @Column()
    isSpeech: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
