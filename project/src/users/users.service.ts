import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDetails } from './auth/kakao.data';
import { filter } from 'rxjs';
import { IsEmail } from 'class-validator';
import { All } from '@nestjs/common/decorators';
import { truncate } from 'fs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    // 카카오 로그인
    async validateUser(details: UserDetails) {
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

    // 회원 정보 상세 조회
    async getUserDetailsByUserId(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            select: { id: true, email: true, nickname: true, profileImg: true },
            where: { id },
        });
        if (!user) {
            throw new HttpException('회원 인증에 실패했습니다.', 402);
        }
        return user;
    }
}
