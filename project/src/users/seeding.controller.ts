import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { ResultToDataInterceptor } from 'src/common/interceptors/resultToData.interceptor';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenMap } from './entities/token-map.entity';

@UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
@Controller('api/users')
export class SeedingController {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(TokenMap)
        private readonly tokenMapRepository: Repository<TokenMap>,
    ) {}

    @Get()
    async createTestUser() {
        const user = [];
        for (let num = 1; num <= 6; num++) {
            user.push({
                email: `test${num}@email.com`,
                nickname: `테스트닉네임${num}`,
                profileImg:
                    'https://ichef.bbci.co.uk/news/640/cpsprodpb/E172/production/_126241775_getty_cats.png',
            });
        }
        return await this.usersRepository.insert(user);
    }

    @Get('token')
    async createTestToken() {
        const user = [];
        for (let num = 1; num <= 6; num++) {
            user.push({
                userInfo: num,
                token: `token${num}`,
            });
        }
        return await this.tokenMapRepository.insert(user);
    }
}
