import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    AfterLoad,
    BeforeInsert,
    AfterUpdate,
} from 'typeorm';
import { TodayResult } from '../../games/entities/todayResult.entity';
import { GameResult } from '../../games/entities/gameResult.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number; // 자동 생성

    @Column({ nullable: true, unique: true })
    kakaoUserId: number | null;

    @Column({ nullable: true, unique: true })
    githubUserId: number | null;

    @Column()
    email: string;

    @Column({ unique: true, length: 30 })
    nickname: string;

    @Column('text')
    profileImg: string;

    @Column()
    isFirstLogin: boolean;

    @CreateDateColumn({ select: false })
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;

    @DeleteDateColumn({ select: false })
    deletedAt: Date | null;

    @OneToMany(() => GameResult, (gameResult) => gameResult.user)
    gameResults: GameResult[];

    @OneToMany(() => TodayResult, (todayResult) => todayResult.user, { eager: true })
    todayResults: TodayResult[];
}
