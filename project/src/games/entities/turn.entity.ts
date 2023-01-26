import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Room } from './room.entity';
import { TurnResult } from './turnResult.entity';

@Entity()
export class Turn {
    @PrimaryGeneratedColumn()
    turnId: number;

    @Column({ name: 'roomInfo' })
    roomInfo: number;
    @ManyToOne(() => Room, (room) => room.roomId, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'roomInfo' })
    room: Room;

    @Column({ type: 'tinyint' })
    turn: number;

    @Column()
    currentEvent: string;

    @Column()
    speechPlayer: number;

    @Column()
    speechPlayerNickname: string;

    @Column()
    keyword: string;

    @Column({ type: 'text', nullable: true })
    hint: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
