import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Player } from './player.entity';
import { Turn } from './turn.entity';

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    roomId: number;

    @Column({ length: 100 })
    roomTitle: string;

    @Column('tinyint')
    maxCount: number;

    @Column()
    readyTime: number;

    @Column()
    speechTime: number;

    @Column()
    discussionTime: number;

    @Column()
    isSecreteRoom: boolean;

    @Column({ type: 'int', width: 4 })
    roomPassword: number;

    @Column()
    isGameOn: boolean;

    @Column()
    isGameReadyToStart: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Player, (player) => player.room, { eager: true })
    players: Player[];

    @OneToMany(() => Turn, (turn) => turn.room)
    turns: Turn[];
}
