import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    // User entity를 respository로 inject해서 사용하는 예제입니다~
    async findAll(): Promise<User[]> {
        console.log('findAll');
        return await this.usersRepository.find();
    }

    async findByUserId(userId: number): Promise<User> {
        return await this.usersRepository.findOne({ where: { userId } });
    }
    async findByEmail(email: string): Promise<User> {
        return await this.usersRepository.findOne({ where: { email } });
    }

    async createUser({ email, nickname, profileImg }: CreateUserDto): Promise<User> {
        const user = await this.findByEmail(email);
        if (user) throw new HttpException('이미 등록된 사용자입니다.', 400);

        const newUser = await this.usersRepository.save({ email, nickname, profileImg });

        if (!newUser) throw new HttpException('사용자 등록에 실패했습니다.', 500);

        return newUser;
    }

    async remove(userId: string): Promise<void> {
        await this.usersRepository.delete(userId);
    }
}
