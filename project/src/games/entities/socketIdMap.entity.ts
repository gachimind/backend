import { User } from '../../users/entities/user.entity';
import {
    JoinColumn,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    Column,
} from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class SocketIdMap {
    @PrimaryColumn()
    socketId: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    userId: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Room, (room) => room.roomId, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'currentRoom' })
    currentRoom: Room;
}
