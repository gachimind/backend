import { User } from '../../users/entities/user.entity';
import { JoinColumn, CreateDateColumn, Entity, PrimaryColumn, OneToOne, Column } from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class SocketIdMap {
    @PrimaryColumn('varchar')
    socketId: string;

    @Column({ name: 'userInfo' })
    userInfo: number;
    @OneToOne(() => User, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'userInfo' })
    user: User;

    @OneToOne(() => Player, (player) => player.socket)
    player: Player;

    @CreateDateColumn({ select: false })
    createdAt: Date;
}
