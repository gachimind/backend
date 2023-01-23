import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';

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
    speechPlayer: string;

    @Column()
    keyword: string;

    @Column({ type: 'text', nullable: true })
    hint: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
