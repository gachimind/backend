import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Keyword {
    @PrimaryGeneratedColumn()
    keywordId: number;

    @Column('varchar')
    keywordKor: string;

    @Column({ nullable: true })
    keywordEng?: string;

    @Column({ nullable: true })
    hint?: string;
}
