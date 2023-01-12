import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    roomId: number;

    @Column({ length: 100 })
    roomTitle: string;

    @Column('tinyint')
    maxCount: number;

    @Column('tinyint')
    round: number;

    @Column('int')
    readyTime: number;

    @Column('int')
    speechTime: number;

    @Column('int')
    discussionTime: number;

    @Column()
    isSecreteRoom: boolean;

    @Column({ type: 'tinyint', width: 4 })
    roomPassword: number;

    @Column()
    isGameOn: boolean;

    @Column()
    isGameReadyToStart: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
