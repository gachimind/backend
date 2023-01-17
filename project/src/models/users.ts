import {
  Column,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { Goals } from './goals';
import { UserGoals } from './usergoals';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: false })
  name: string;

  @Column({ unique: false })
  nickname: string;
  
  @Column({ nullable: true })
  image: string;

  @Column()
  loginCategory: string;

  @Column({ nullable: true })
  pinCode: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Goals, (goal) => goal.userId, { cascade: ['insert'] })
  goals: Goals[];

  @OneToMany(() => UserGoals, (userGoal) => userGoal.userId, { cascade: ['insert'] })
  userGoals: UserGoals[];

}