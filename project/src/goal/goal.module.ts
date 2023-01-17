import { forwardRef, Module } from '@nestjs/common';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { AuthModule } from '../auth/auth.module';
import { Users } from 'src/models/users';
import { Goals } from 'src/models/goals';
import { UserGoals } from 'src/models/usergoals';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Goals, UserGoals]),
    forwardRef(() => AuthModule)
  ],
  providers: [GoalService, UserService, AuthService, JwtService],
  controllers: [GoalController],
  exports: [GoalService],
})
export class GoalModule {}