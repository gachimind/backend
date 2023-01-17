import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDetails } from './auth/kakao.data';
import { TokenMap } from './entities/token-map.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt.guard';
import { KakaoAuthGuard } from './auth/kakao.guards';
import { TokenDetails } from './auth/token.data';
import { throws } from 'assert';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(TokenMap)
        private readonly tokenMapRepository: Repository<TokenMap>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    // 카카오 로그인하고 유저 정보 저장
    async validateUser(details: UserDetails) {
        const user = await this.usersRepository.findOneBy({
            kakaoUserId: details.kakaoUserId,
        });
        if (user) return user;
        const newUser = this.usersRepository.save(details);
        return newUser;
    }

    async findUserById(kakaoUserId: number) {
        const user = await this.usersRepository.findOneBy({ kakaoUserId });
        return user;
    }

    // 토큰 검증
    async tokenValidate(token: string) {
        return await this.jwtService.verify(token, {
            secret: process.env.TOKEN_SECRETE_KEY,
        });
    }

    // AccessToken 생성
    async createToken(user: User) {
        // const payload = {
        //     kakaoUserId: user.kakaoUserId,
        //     tokenType: 'accessToken',
        // };
        const token: string = this.jwtService.sign({
            secret: process.env.TOKEN_SECRETE_KEY,
            expiresIn: '24h',
        });
        await this.tokenMapRepository.save({ userInfo: user.userId, token: token });
        return token;
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
