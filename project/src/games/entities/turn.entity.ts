import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Turn {
    @PrimaryGeneratedColumn()
    turnId: number;

    @Column({ name: 'roomInfo' })
    roomInfo: number;
    @ManyToOne(() => Room, (room) => room.roomId, {
        cascade: true,
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

    @CreateDateColumn({ select: false })
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;
}
