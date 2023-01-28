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
import { User } from '../../users/entities/user.entity';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { GameResult } from './gameResult.entity';

@Entity()
export class TodayResult {
    @PrimaryGeneratedColumn()
    todayResultId: number;

    @Column({ name: 'userInfo' })
    userInfo: number;
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userInfo' })
    user: User;

    @Column({ type: 'int' })
    todayScore: number;

<<<<<<< HEAD
    @CreateDateColumn()
=======
    @CreateDateColumn({ select: false })
>>>>>>> d2eb81175c84e1dd58b74aeb9756e95ed4c3839d
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

<<<<<<< HEAD
    @DeleteDateColumn()
=======
    @DeleteDateColumn({ select: false })
>>>>>>> d2eb81175c84e1dd58b74aeb9756e95ed4c3839d
    deletedAt: Date | null;

    @OneToMany(() => GameResult, (gameResult) => gameResult.todayResult, { eager: true })
    gameResults: GameResult[];
}
