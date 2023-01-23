import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { TurnResult } from './turnResult.entity';
import { User } from '../../users/entities/user.entity';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => TurnResult, (turnResult) => turnResult.gameResult, { eager: true })
    turnResults: TurnResult[];
}
