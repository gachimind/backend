import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goals } from '../models/goals';
import { UserGoals } from '../models/usergoals';
import { CreateGoalDTO } from '../goal/dto/createGoal.dto';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goals) private goalRepository: Repository<Goals>,
    @InjectRepository(UserGoals) private userGoalRepository: Repository<UserGoals>,
    ) {}

    async createGoal(data): Promise<Goals>{
        const result = await this.goalRepository.save(data);
        return result;
    }

    async getAllGoals(): Promise<Goals[]> {
        const result: Goals[] = await this.goalRepository.find({
            order: {
                createdAt: "DESC",
            }
        });
        return result;
    }

    async getGoalByGoalId(goalId: number): Promise<Goals> {
        return await this.goalRepository.findOneBy({goalId});
    }

    async joinGoal(userId: number, goalId: number, recruitMember: number) {
        //const result = await this.userGoalRepository.save({userId, goalId});
        const update = await this.goalRepository.update({goalId}, {recruitMember})
    }
}