import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { TokenMap } from './entities/token-map.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { TodayResult } from '../games/entities/todayResult.entity';
import { GameResult } from '../games/entities/gameResult.entity';
import { TurnResult } from '../games/entities/turnResult.entity';
import { getTodayDate } from '../games/util/today.date.constructor';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(TokenMap)
        private readonly tokenMapRepository: Repository<TokenMap>,
        @InjectRepository(TodayResult)
        private readonly todayResultRepository: Repository<TodayResult>,
        @InjectRepository(GameResult)
        private readonly gameResultRepository: Repository<GameResult>,
        @InjectRepository(TurnResult)
        private readonly TurnResultRepository: Repository<TurnResult>,
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

    // 회원 키워드 조회
    async getUserKeywordByToken(token: string) {
        const getUserKeywordByToken = await this.tokenMapRepository.findOneBy({
            token,
        });

        if (!getUserKeywordByToken) throw new HttpException('정상적인 접근이 아닙니다.', 401);

        const findUserTodayResult = await this.usersRepository.findOne({
            where: { userId: getUserKeywordByToken.userInfo },
            select: { todayResults: true },
        });

        ///////////////////////////

        // 전체 키워드 찾아오기
        const findTotalkeyword = await this.TurnResultRepository.find({
            where: { nickname: findUserTodayResult.nickname },
            select: { keyword: true, isSpeech: true, createdAt: true },
        });

        // 발표 유무에 따라 각각 배열에 담기
        const SpeechKeywordArray = [];
        const totalKeywordArray = [];
        for (const result of findTotalkeyword) {
            if (result.isSpeech === true) {
                SpeechKeywordArray.push({
                    Keyword: result.keyword,
                });
            } else {
                totalKeywordArray.push({
                    Keyword: result.keyword,
                });
            }
        }

        // 발표자일 경우 전체 단어
        const totalSpeechKeywordExp = [];
        for (const result in SpeechKeywordArray) {
            totalSpeechKeywordExp.push(SpeechKeywordArray[result].Keyword);
        }
        const totalSpeechKeywordCont = totalSpeechKeywordExp.join(); // 배열 합치기
        const totalSpeechKeyword = [...new Set(totalSpeechKeywordCont)]; // 중복 제거

        // 발표자가 아닌 경우 전체 단어
        const totalQuizKeywordExp = [];
        for (const result in totalKeywordArray) {
            totalQuizKeywordExp.push(totalKeywordArray[result].Keyword);
        }
        const totalQuizKeywordCont = totalQuizKeywordExp.join(); // 배열 합치기
        const totalQuizKeyword = [...new Set(totalQuizKeywordCont)]; // 중복 제거

        //////////////////////////////////////////

        // const today: Date = getTodayDate();

        // const todayKeywordArray = findTotalkeyword.find(
        //     (findTotalkeyword) => findTotalkeyword.createdAt == today,
        // );

        // console.log(todayKeywordArray);
        // // findTotalkeyword

        //////////////////////////////////////////
        const data = {
            userId: findUserTodayResult.userId,
            //todaySpeechKeyword,
            //todayQuizKeyword,
            totalSpeechKeyword,
            totalQuizKeyword,
        };
        return data;
    }
}
