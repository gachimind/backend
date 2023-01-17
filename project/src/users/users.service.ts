import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { TokenMap } from './entities/token-map.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(TokenMap)
        private readonly tokenMapRepository: Repository<TokenMap>,
        private jwtService: JwtService,
    ) {}

    async createUser(details: CreateUserDto): Promise<User> {
        const user = await this.usersRepository.save(details);
        return user;
    }

    async findUserByUserId(userId: number): Promise<User> {
        return await this.usersRepository.findOne({ where: { userId } });
    }

    async validateUserByUserId(userDetails) {
        let user: User = await this.findUserByUserId(userDetails.userId);
        if (!user) {
            user = await this.createUser(userDetails);
        }
        return user;
    }

    // AccessToken 생성
    async createToken(user: User): Promise<string> {
        const payload = { userId: user.userId };
        const token: string = this.jwtService.sign({
            payload,
        });
        console.log('UsersSevice, createToken() token:', token);
        await this.tokenMapRepository.save({ userInfo: user.userId, token: token });
        return token;
    }

    // 토큰 검증
    async tokenValidate(token: string) {
        return await this.jwtService.verify(token);
    }

    // 회원 정보 상세 조회
    // async getUserDetailsByToken(token: string): Promise<TokenMap> {
    //     const user = await this.tokenMapRepository.findOne({
    //         where: { token },
    //         relations: ['User'],
    //     });
    //     if (!user) {
    //         throw new HttpException('회원 인증에 실패했습니다.', 402);
    //     }
    //     return user;
    // }
}
