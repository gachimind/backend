import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { TokenMap } from './entities/token-map.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { stringify } from 'querystring';
import { userInfo } from 'os';
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

    async findUserByNickNameOrEmail(
        kakaoUserId: number,
        nickname: string,
        email: string,
    ): Promise<User[]> {
        console.log('findUserByNicknameOrEmail', { kakaoUserId, nickname, email });

        return await this.usersRepository.find({
            where: [{ kakaoUserId }, { nickname }, { email }],
        });
    }

    async validateUser(userData: CreateUserDto): Promise<{ user: User; isNewUser: boolean }> {
        const users: User[] = await this.findUserByNickNameOrEmail(
            userData.kakaoUserId,
            userData.nickname,
            userData.email,
        );

        // db에 유저 정보가 없는 경우 처리
        if (!users || !users.length) {
            const user: User = await this.createUser(userData);
            const isNewUser = true;
            return { user, isNewUser };
        }

        return { user: users[0], isNewUser: false };
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
        console.log(getUserInfoByToken, '000000000000000000');
        const modifyingUser = getUserInfoByToken.user;

        const { kakaoUserId, email, nickname, profileImg } = await modifyingUser;
        getUserInfoByToken.user.kakaoUserId = kakaoUserId;
        getUserInfoByToken.user.email = email;
        getUserInfoByToken.user.nickname = nickname;
        getUserInfoByToken.user.profileImg = profileImg;

        const userDetail = { kakaoUserId, email, nickname, profileImg };

        return userDetail;
    }
}
