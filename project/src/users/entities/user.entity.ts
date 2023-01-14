import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
// @Entity({ name: 'User' })
export class User {
    @PrimaryGeneratedColumn()
    // @PrimaryGeneratedColumn({ name: 'id' })
    userId: number;

    @Column('varchar', { unique: true, length: 50 })
    email: string;

    @Column('varchar')
    nickname: string;

    @Column('text')
    profileImg: string;

    @Column({ nullable: true })
    currentHashedRefreshToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;
}
