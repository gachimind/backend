import { User } from 'src/users/user.entity';
import {
    JoinColumn,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
} from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class SocketIdMap {
    @PrimaryColumn('varchar')
    socketId: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Room, (room) => room.roomId, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    currentRoom: Room;
}
