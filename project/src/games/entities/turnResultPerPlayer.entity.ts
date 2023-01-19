import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { Turn } from './turn.entity';

@Entity()
export class TurnResultPerPlayer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'turnInfo' })
    turnInfo: number;
    @ManyToOne(() => Turn, (turn) => turn.id, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'turnInfo' })
    turn: Turn;

    @Column({ name: 'playerInfo' })
    playerInfo: number;
    @ManyToOne(() => Player, (player) => player.playerId, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'playerInfo' })
    player: Player;

    @Column({ type: 'tinyint' })
    score: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
