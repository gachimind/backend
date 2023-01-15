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
    @JoinColumn({ name: 'userInfo' })
    userInfo: User | number;

    @OneToOne(() => Player, (player) => player.socketInfo)
    playerInfo: Player;

    @CreateDateColumn()
    createdAt: Date;
}
