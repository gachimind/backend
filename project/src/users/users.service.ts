import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { TokenMap } from './entities/token-map.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(TokenMap)
        private tokenMapRepository: Repository<TokenMap>,
    ) {}

    async getUserDetailsByUserId(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('회원 인증에 실패했습니다.', 402);
        }
        return user;
    }
}
