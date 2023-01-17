import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class TokenMap {
    @PrimaryGeneratedColumn()
    tokenMapId: number;

    @Column({ unique: true })
    token: string;

    @Column({ name: 'userInfo' })
    userInfo: number;
    @OneToOne(() => User, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'userInfo' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;
}
