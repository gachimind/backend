import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { Room } from './room.entity';
import { TurnResult } from './turnResult.entity';

@Entity()
export class Turn {
    @PrimaryGeneratedColumn()
    turnId: number;

    @Column({ name: 'roomInfo' })
    roomInfo: number;
    @ManyToOne(() => Room, (room) => room.roomId, { cascade: ['update', 'remove'] })
    @JoinColumn({ name: 'roundInfo' })
    room: Room;

    @Column({ type: 'tinyint' })
    currentTurn: number;

    @Column()
    speechPlayer: string;

    @Column()
    keyword: string;

    @Column({ type: 'text' })
    hint: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => TurnResult, (turnResult) => turnResult.turnInfo)
    turnResults: TurnResult[];
}
