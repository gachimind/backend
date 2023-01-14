import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDetails } from './auth/kakao.data';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    // 카카오 로그인
    // async validateUser(details: UserDetails) {
    //     const user = await this.usersRepository.findOneBy({
    //         email: details.email,
    //     });
    //     if (user) return user;
    //     const newUser = this.usersRepository.create(details);
    //     return this.usersRepository.save(newUser);
    // }

    async findUserById(userId: number) {
        const user = await this.usersRepository.findOneBy({ userId });
        return user;
    }

    // 유저 정보 받아오는 부분
    async kakaoLogin(authorization) {
        if (!authorization) throw new HttpException('토큰 정보가 없습니다.', 402);
        const kakaoAccessToken = authorization;
        const { data: kakaoUser } = await axios('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `${kakaoAccessToken}`,
            },
        });

        const profileImg: string = kakaoUser.properties.profile_image;
        const nickname: string = kakaoUser.properties.nickname;
        const email: string = kakaoUser.kakao_account.email;
        const exUser = await this.usersRepository.findOne({
            where: { email },
        });
        if (!exUser) {
            const newUser = await this.usersRepository.save({
                nickname,
                profileImg,
                email,
            });
            // console.log(newUser);

            // 회원정보 저장 토큰 발급
            console.log('회원정보 저장 토큰 발급');
            const accessToken = await this.makeAccessToken(newUser.email);
            const refreshToken = await this.makeAccessToken(newUser.email);
            await this.CurrnetRefreshToken(refreshToken, newUser.userId);
            return { accessToken, refreshToken };
        } else {
            const { userId } = exUser;

            // 로그인 토큰 발급
            console.log('로그인 토큰 발급');
            // return kakaojwt(userId);
            const accessToken = await this.makeAccessToken(exUser.email);
            const refreshToken = await this.makeAccessToken(exUser.email);
            await this.CurrnetRefreshToken(refreshToken, userId);
            return { accessToken, refreshToken };
        }
    }

    async makeAccessToken(email) {
        const payload = { email };
        const accessToken = await this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '60m',
        });
        return accessToken;
    }
    async makeRefreshToken(email) {
        const payload = { email };
        const refreshToken = await this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '1d',
        });
        return refreshToken;
    }
    async CurrnetRefreshToken(refreshToken: string, userId: number) {
        const salt = await bcrypt.genSalt();
        const token = await bcrypt.hash(refreshToken, salt);
        await this.usersRepository.update(userId, { token });
    }

    // 회원 정보 상세 조회
    async getUserDetailsByUserId(userId: number): Promise<User> {
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
