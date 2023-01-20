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

    @Column({ name: 'turnInfo' })
    turnInfo: number;
    @ManyToOne(() => Turn, (turn) => turn.turnId)
    @JoinColumn({ name: 'turnInfo' })
    turn: Turn;

    @Column({ name: 'gameResult' })
    gameResultInfo: number;
    @ManyToOne(() => GameResult, (gameResult) => gameResult.turnResults)
    @JoinColumn({ name: 'gameResult' })
    gameResult: GameResult;

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
