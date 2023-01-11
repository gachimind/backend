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

    async getUserDetailsByUserId(userId: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { userId } });
        if (!user) {
            throw new HttpException('회원 인증에 실패했습니다.', 402);
        }
        return user;
    }
}
