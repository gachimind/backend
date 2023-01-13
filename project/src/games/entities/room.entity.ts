import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { socketIdMap } from '../players.service';
import { Player } from './player.entity';
import { SocketIdMap } from './socketIdMap.entity';

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    roomId: number;

    @Column({ length: 100 })
    roomTitle: string;

    @Column('tinyint')
    maxCount: number;

    @Column('tinyint')
    round: number;

    @Column()
    readyTime: number;

    @Column()
    speechTime: number;

    @Column()
    discussionTime: number;

    @Column()
    isSecreteRoom: boolean;

    @Column({ type: 'tinyint', width: 4 })
    roomPassword: number;

    @Column()
    isGameOn: boolean;

    @Column()
    isGameReadyToStart: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => SocketIdMap, (socket) => socket.currentRoom)
    socketId: SocketIdMap[];

    @OneToMany(() => Player, (player) => player.roomId)
    playerId: Player[];
}
