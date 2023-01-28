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

<<<<<<< HEAD
    @Column({ name: 'todayResultInfo', nullable: true })
=======
    @Column({ type: 'int' })
    gameScore: number;

    @Column({ name: 'todayResultInfo', nullable: true, select: true })
>>>>>>> d2eb81175c84e1dd58b74aeb9756e95ed4c3839d
    todayResultInfo: number;
    @ManyToOne(() => TodayResult, (todayResult) => todayResult.gameResults, {
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
<<<<<<< HEAD
        createForeignKeyConstraints: false,
=======
        //createForeignKeyConstraints: false,
>>>>>>> d2eb81175c84e1dd58b74aeb9756e95ed4c3839d
    })
    @JoinColumn({ name: 'todayResultInfo' })
    todayResult: TodayResult;

<<<<<<< HEAD
    @CreateDateColumn()
=======
    @CreateDateColumn({ select: false })
>>>>>>> d2eb81175c84e1dd58b74aeb9756e95ed4c3839d
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;

    @OneToMany(() => TurnResult, (turnResult) => turnResult.gameResult)
    turnResults: TurnResult[];
}
