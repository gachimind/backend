import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Keyword {
    @PrimaryGeneratedColumn()
    keywordId: number;

    @Column()
    keywordKor: string;

    @Column()
    keywordEng: string;

    @Column()
    hint: string;
}
