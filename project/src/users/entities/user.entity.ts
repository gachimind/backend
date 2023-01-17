import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from 'src/games/entities/player.entity';
import { SocketIdMap } from 'src/games/entities/socketIdMap.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ unique: true })
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
}
