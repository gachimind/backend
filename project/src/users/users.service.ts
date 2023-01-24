import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { TokenMap } from './entities/token-map.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(TokenMap)
        private readonly tokenMapRepository: Repository<TokenMap>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async createUser(details: CreateUserDto): Promise<User> {
        return await this.usersRepository.save(details);
    }

    async findUser(kakaoUserId: number, email: string, nickname: string): Promise<User> {
        let user = await this.usersRepository.findOne({ where: { kakaoUserId } });

        if (!user && email) {
            user = await this.usersRepository.findOne({ where: { email } });
        }
        if (!user && nickname) {
            user = await this.usersRepository.findOne({ where: { nickname } });
        }
        return user;
    }

    async validateUser(userData: CreateUserDto): Promise<{ user: User; isNewUser: boolean }> {
        let user: User = await this.findUser(
            userData.kakaoUserId,
            userData.email,
            userData.nickname,
        );

        // db에 유저 정보가 없는 경우 처리
        if (!user) {
            user = await this.createUser(userData);
            const isNewUser = true;
            return { user, isNewUser };
        }

        return { user, isNewUser: false };
    }

    // AccessToken 생성
    async createToken(user: User, isNewUSer: boolean): Promise<string> {
        const payload = {}; // 공갈빵 만들기
        const token: string = this.jwtService.sign({
            payload,
        });
        if (isNewUSer) {
            await this.tokenMapRepository.save({
                userInfo: user.userId,
                token: token,
            });
        } else {
            await this.tokenMapRepository.update({ user }, { token: token });
        }

        return token;
    }

    // 토큰 검증
    async tokenValidate(token: string) {
        return await this.jwtService.verify(token, {
            secret: this.configService.get('TOKEN_SECRETE_KEY'),
        });
    }

    // 회원 정보 상세 조회
    async getUserDetailsByToken(token: string) {
        const getUserInfoByToken = await this.tokenMapRepository.findOneBy({ token });

        if (!getUserInfoByToken) throw new HttpException('정상적인 접근이 아닙니다.', 401);

        const { userId, email, nickname, profileImg } = getUserInfoByToken.user;

        return { userId, email, nickname, profileImg };
    }
}
