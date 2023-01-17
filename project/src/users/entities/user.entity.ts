import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn()
    userId: number; // kakaoId를 userId로 넣고 PK로 사용

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
}
