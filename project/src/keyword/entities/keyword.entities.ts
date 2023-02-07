import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Keyword {
    @PrimaryGeneratedColumn()
    keywordId: number;

    @Column('varchar')
    keyword: string;

    @Column()
    link: string;

    @Column({ nullable: true })
    hint: string;
}
