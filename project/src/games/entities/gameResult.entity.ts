import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { TurnResult } from './turnResult.entity';
import { User } from '../../users/entities/user.entity';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { TodayResult } from './todayResult.entity';

@Entity()
export class GameResult {
    @PrimaryGeneratedColumn()
    gameResultId: number;

    @Column()
    roomId: number;

    @Column({ name: 'userInfo' })
    userInfo: number;
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userInfo' })
    user: User;

    @Column({ name: 'todayResultInfo' })
    todayResultInfo: number;
    @ManyToOne(() => TodayResult, (todayResult) => todayResult.gameResults)
    @JoinColumn({ name: 'todayResultInfo' })
    todayResult: TodayResult;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => TurnResult, (turnResult) => turnResult.gameResult)
    turnResults: TurnResult[];
}
