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

    @ManyToOne(() => GameResult, (game) => game.turnResults)
    gameResult: GameResult;
}
