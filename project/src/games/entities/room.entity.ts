import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    DeleteDateColumn,
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
    isSecretRoom: boolean;

    @Column({ type: 'varchar', width: 4 })
    roomPassword: string;

    @Column()
    isGameOn: boolean;

    @Column()
    isGameReadyToStart: boolean;

    @CreateDateColumn({ select: false })
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;

    @DeleteDateColumn({ select: false })
    deletedAt: Date | null;

    @OneToMany(() => Player, (player) => player.room, { eager: true })
    players: Player[];

    @OneToMany(() => Turn, (turn) => turn.room, { eager: true })
    turns: Turn[];
}
