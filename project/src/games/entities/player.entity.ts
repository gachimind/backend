import { User } from '../../users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { SocketIdMap } from './socketIdMap.entity';

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    playerId: number;

    @Column()
    userInfo: number;
    @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userInfo' })
    user: User;

    @Column({ name: 'socketInfo' })
    socketInfo: string;
    @OneToOne(() => SocketIdMap, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'socketInfo' })
    socket: SocketIdMap;

    @Column({ name: 'roomInfo' })
    roomInfo: number;
    @ManyToOne(() => Room, (room) => room.roomId, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'roomInfo' })
    room: Room;

    @Column()
    isReady: boolean;

    @Column()
    isHost: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
