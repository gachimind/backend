import { User } from '../../users/entities/user.entity';
import {
    JoinColumn,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
    OneToOne,
} from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class SocketIdMap {
    @PrimaryColumn('varchar')
    socketId: string;

    @OneToOne(() => User, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'userId' })
    userId: User | number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => Player, (player) => player.socketId, { eager: true })
    player: Player;
}
