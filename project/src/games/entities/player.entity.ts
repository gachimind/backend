import { User } from '../../users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { SocketIdMap } from './socketIdMap.entity';

@Entity()
export class Player {
    @PrimaryColumn({ name: 'userInfo' })
    userInfo: number;
    @OneToOne(() => User, { eager: true })
    @JoinColumn({ name: 'userInfo' })
    user: User;

    @Column({ name: 'socketInfo' })
    socketInfo: string;
    @OneToOne(() => SocketIdMap, { eager: true })
    @JoinColumn({ name: 'socketInfo' })
    socket: SocketIdMap;

    @Column({ name: 'roomInfo' })
    roomInfo: number;
    @ManyToOne(() => Room, (room) => room.roomId)
    @JoinColumn({ name: 'roomInfo' })
    room: Room;

    @Column()
    isReady: boolean;

    @Column()
    isHost: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;
}
