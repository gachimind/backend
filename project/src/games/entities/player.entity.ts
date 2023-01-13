import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { SocketIdMap } from './socketIdMap.entity';

@Entity()
export class Player {
    @OneToOne(() => User, (user) => user.userId, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    @PrimaryColumn()
    userId: User | number;

    @OneToOne(() => SocketIdMap, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'socketId' })
    socketId: SocketIdMap | number;

    @ManyToOne(() => Room, (room) => room.roomId, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'roomId' })
    roomId: Room | number;

    @Column()
    isGameOn: boolean;

    @Column()
    isGameReadyToStart: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
