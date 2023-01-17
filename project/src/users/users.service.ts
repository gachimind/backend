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
        return await this.usersRepository.save(details);
    }

    async findUserByNickNameOrEmail(nickname: string, email: string): Promise<User[]> {
        console.log('findUserByNicknameOrEmail', { nickname, email });

        return await this.usersRepository.find({ where: [{ nickname }, { email }] });
    }

    async validateUser(userData: CreateUserDto): Promise<{ user: User; isNewUser: boolean }> {
        const users: User[] = await this.findUserByNickNameOrEmail(
            userData.nickname,
            userData.email,
        );
        let user = users[0];
        let isNewUser = false;
        if (!user) {
            user = await this.createUser(user);
            isNewUser = true;
        }
        return { user, isNewUser };
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
