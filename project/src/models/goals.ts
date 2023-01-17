import {
    ManyToOne,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { Users } from './users';
  import { UserGoals } from './usergoals';
  
  @Entity()
  export class Goals extends BaseEntity {
    @ManyToOne(() => Users, (user) => user.goals, { onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    userId: Users;

    @PrimaryGeneratedColumn()
    goalId: number;
  
    @Column({ nullable: false })
    amount: number;

    @Column({ nullable: false })
    startDate: Date;

    @Column({ nullable: false })
    endDate: Date;

    @Column({ nullable: false })
    recruitMember: number;

    @Column({ nullable: false })
    headCount: number;

    // @Column({ nullable: true })
    // isPrivate: boolean;

    // @Column({ nullable: true })
    // isAuto: boolean;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: true })
    hashTag: string;

    @CreateDateColumn({ 
      type: "timestamp",
      update: false,
     })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @OneToMany(() => UserGoals, (userGoal) => userGoal.goalId, { cascade: ['insert'] })
    userGoals: UserGoals[];
  }