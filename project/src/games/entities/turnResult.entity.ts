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

@Entity()
export class TurnResult {
    @PrimaryGeneratedColumn()
    turnResultId: number;

    @Column({ type: 'tinyint' })
    turn: number;

    @Column()
    room: number;

    @Column({ type: 'tinyint' })
    score: number;

    @Column()
    keyword: string;

    @Column()
    isSpeech: boolean;

    @Column({ name: 'gameResultInfo' })
    gameResultInfo: number;
    @ManyToOne(() => GameResult, (gameResult) => gameResult.gameResultId)
    @JoinColumn({ name: 'gameResultInfo' })
    gameResult: GameResult;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
