import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDetails } from './auth/kakao.data';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    // 카카오 로그인하고 유저 정보 저장
    async validateUser(details: UserDetails) {
        const user = await this.usersRepository.findOneBy({
            userId: details.userId,
        });
        if (user) return user;
        const newUser = this.usersRepository.create(details);
        return this.usersRepository.save(newUser);
    }

    async createUser(details: UserDetails) {
        const user = this.usersRepository.create(details);
        return this.usersRepository.save(user);
    }
    e;
    async findUserById(userId: string) {
        const user = await this.usersRepository.findOneBy({ userId });
        return user;
    }

    // 토큰 검증
    async tokenValidate(token: string) {
        return await this.jwtService.verify(token, {
            secret: process.env.TOKEN_SECRETE_KEY,
        });
    }

    // AccessToken 생성
    async createAccessToken(user: User) {
        const payload = {
            userId: user.userId,
            tokenType: 'accessToken',
        };
        const accessToken: string = this.jwtService.sign(payload, {
            secret: process.env.TOKEN_SECRETE_KEY,
            expiresIn: '24h',
        });
        return accessToken;
    }

    // 회원 정보 상세 조회
    async getUserDetailsByUserId(userId: any): Promise<User> {
        const user = await this.usersRepository.findOne({
            select: { userId: true, email: true, nickname: true, profileImg: true },
            where: { userId },
        });
        if (!user) {
            throw new HttpException('회원 인증에 실패했습니다.', 402);
        }
        return user;
    }
}
