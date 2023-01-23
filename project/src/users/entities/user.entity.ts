import { GameResult } from '../../games/entities/gameResult.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number; // 자동 생성

    @Column()
    kakaoUserId: number;

    @Column({ unique: true, length: 50 })
    email: string | null;

    @Column({ unique: true, length: 30 })
    nickname: string;

    @Column('text')
    profileImg: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    @OneToMany(() => GameResult, (gameResult) => gameResult.user, { eager: true })
    gameResults: GameResult[];
}
