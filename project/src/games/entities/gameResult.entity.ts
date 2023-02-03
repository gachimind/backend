import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
    DeleteDateColumn,
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

    @Column({ type: 'int' })
    gameScore: number;

    @Column({ name: 'todayResultInfo', nullable: true, select: true })
    todayResultInfo: number;
    @ManyToOne(() => TodayResult, (todayResult) => todayResult.gameResults, {
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        //createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'todayResultInfo' })
    todayResult: TodayResult;

    @CreateDateColumn({ select: false })
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;

    @DeleteDateColumn({ select: false })
    deletedAt: Date;

    @OneToMany(() => TurnResult, (turnResult) => turnResult.gameResult)
    turnResults: TurnResult[];
}
