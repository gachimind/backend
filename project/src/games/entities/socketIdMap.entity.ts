import { User } from '../../users/entities/user.entity';
import {
    JoinColumn,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
    OneToOne,
} from 'typeorm';
import { Room } from './room.entity';
import { Player } from './player.entity';

@Entity()
export class SocketIdMap {
    @PrimaryColumn('varchar')
    socketId: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    userId: User | number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Player, (player) => player.roomId, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn({ name: 'currentRoom' })
    currentRoom: Player | number;
}
