import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    // User entity를 respository로 inject해서 사용하는 예제입니다~
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(userId: number): Promise<User> {
        return this.userRepository.findOneBy({ userId });
    }

    async remove(userId: string): Promise<void> {
        await this.userRepository.delete(userId);
    }
}
