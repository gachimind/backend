import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  quizId: number;

  @Column()
  wordKo: string;

  @Column()
  wordEng: string;

  @Column()
  hint: string;
}
