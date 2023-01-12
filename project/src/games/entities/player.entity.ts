import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { SocketIdMap } from './socketIdMap.entity';

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    playerId: number;

    @OneToOne(() => SocketIdMap)
    @JoinColumn()
    socket: SocketIdMap;

    @Column()
    isGameOn: boolean;

    @Column()
    isGameReadyToStart: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
