import { User } from '../../users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { SocketIdMap } from './socketIdMap.entity';

@Entity()
export class Player {
    @PrimaryColumn()
    userInfo: number;

    @OneToOne(() => User, (user) => user.userId, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userInfo' })
    user: User;

    @OneToOne(() => SocketIdMap, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'socketInfo' })
    socketInfo: SocketIdMap | string;

    @ManyToOne(() => Room, (room) => room.roomId, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'roomInfo' })
    roomInfo: Room | number;

    @Column()
    isReady: boolean;

    @Column()
    isHost: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
