import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { TurnResult } from './turnResult.entity';
import { Player } from './player.entity';

@Entity()
export class GameResult {
    @PrimaryGeneratedColumn()
    gameResultId: number;

    @Column({ name: 'playerInfo' })
    playerInfo: number;
    @OneToOne(() => Player, (player) => player.playerId, { eager: true })
    @JoinColumn({ name: 'playerInfo' })
    player: Player;

    @Column({ name: 'roomInfo' })
    roomInfo: number;
    @OneToOne(() => Room, (room) => room.roomId)
    @JoinColumn({ name: 'roomInfo' })
    room: Room;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => TurnResult, (turnResult) => turnResult.gameResult, { eager: true })
    turnResults: TurnResult[];
}
