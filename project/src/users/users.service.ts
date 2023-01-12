import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async getUserDetailsByUserId(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('회원 인증에 실패했습니다.', 402);
        }
        return user;
    }

    async validateUser(details: User) {
        const user = await this.usersRepository.findOneBy({
            email: details.email,
        });
        if (user) return user;
        const newUser = this.usersRepository.create(details);
        return this.usersRepository.save(newUser);
    }

    async findUserById(id: number) {
        const user = await this.usersRepository.findOneBy({ id });
        return user;
    }
}
