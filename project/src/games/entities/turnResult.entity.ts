import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { GameResult } from './gameResult.entity';

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

    @Column({ type: 'int' })
    turnId: number;

    @Column({ type: 'int' })
    userId: number;

    @Column({ type: 'tinyint' })
    score: number;

    @Column()
    keyword: string;

    @Column()
    isSpeech: boolean;

    @CreateDateColumn({ select: false })
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;
}
