import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class TokenMap {
    @PrimaryGeneratedColumn()
    tokenMapId: number;

    @OneToOne(() => User, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'userId' })
    userId: User;

    @Column({ unique: true })
    token: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
