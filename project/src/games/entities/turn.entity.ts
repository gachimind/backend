import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { Room } from './room.entity';
import { Round } from './round.entity';
import { TurnResultPerPlayer } from './turnResultPerPlayer.entity';

@Entity()
export class Turn {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'tinyint' })
    turn: number;

    @Column({ name: 'roundInfo' })
    roundInfo: number;
    @ManyToOne(() => Round, (round) => round.id)
    @JoinColumn({ name: 'roundInfo' })
    round: Round;

    @Column({ name: 'speechPlayerInfo' })
    speechPlayerInfo: number;
    @ManyToOne(() => Player, (player) => player.playerId, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'speechPlayerInfo' })
    speechPlayer: Player;

    @Column()
    keyword: string;

    @Column({ type: 'text' })
    hint: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => TurnResultPerPlayer, (turnResultPerPlayer) => turnResultPerPlayer.turn)
    turns: TurnResultPerPlayer[];
}
