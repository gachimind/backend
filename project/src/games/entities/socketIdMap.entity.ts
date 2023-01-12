import { User } from '../../users/entities/user.entity';
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
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Room, (room) => room.id, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    currentRoom: Room;
}
