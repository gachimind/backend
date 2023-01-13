import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { SocketIdMap } from './socketIdMap.entity';

@Entity()
export class Player {
    @PrimaryColumn()
    userId: number;

    @OneToOne(() => SocketIdMap)
    @JoinColumn({ name: 'socketId' })
    socketId: SocketIdMap;

    @ManyToOne(() => Room, (room) => room.roomId, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'roomId' })
    roomId: Room;

    @Column()
    isGameOn: boolean;

    @Column()
    isGameReadyToStart: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
