import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Like } from 'typeorm';
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

    // 카카오 로그인 API
    async createUser(details: CreateUserDto): Promise<User> {
        return await this.usersRepository.save(details);
    }

    async findUserByNickname(nickname: string) {
        return await this.usersRepository.findBy({ nickname: Like(`${nickname}%`) });
    }

    async findUser(kakaoUserId: number, email: string): Promise<User> {
        let user = await this.usersRepository.findOne({ where: { kakaoUserId } });

        if (!user && email) {
            user = await this.usersRepository.findOne({ where: { email } });
        }
        return user;
    }

    async validateUser(userData: CreateUserDto): Promise<User> {
        let user: User = await this.findUser(userData.kakaoUserId, userData.email);

        // db에 유저 정보가 없는 경우 처리
        if (!user) {
            const sameNickname = await this.findUserByNickname(userData.nickname);
            if (sameNickname.length) {
                userData.nickname = userData.nickname + (sameNickname.length + 1);
            }
            userData.isFirstLogin = true;
            user = await this.createUser(userData);
        }

        return user;
    }

    // AccessToken 생성
    async createToken(user: User): Promise<string> {
        const payload = {}; // 공갈빵 만들기
        const token: string = this.jwtService.sign({
            payload,
        });

        const tokenMapId: TokenMap = await this.tokenMapRepository.findOne({
            where: { userInfo: user.userId },
            select: { tokenMapId: true },
        });

        const tokenMapData = { userInfo: user.userId, token: token };
        if (tokenMapId) {
            tokenMapData['tokenMapId'] = tokenMapId.tokenMapId;
        }

        await this.tokenMapRepository.save(tokenMapData);

        return token;
    }

    // 토큰 검증
    async tokenValidate(token: string) {
        return await this.jwtService.verify(token, {
            secret: this.configService.get('TOKEN_SECRETE_KEY'),
        });
    }

    // 로그아웃 API
    async logout(token: string) {
        const findUser = await this.tokenMapRepository.delete({ token });

        if (!findUser) throw new HttpException('정상적인 접근이 아닙니다.', 401);

        return findUser;
    }

    // 회원 정보 상세 조회 API
    async getUserDetailsByToken(token: string) {
        const getUserInfoByToken = await this.tokenMapRepository.findOne({
            where: { token },
            select: {
                user: { userId: true, nickname: true, profileImg: true, isFirstLogin: true },
            },
        });

        if (!getUserInfoByToken)
            throw new HttpException('해당하는 사용자를 찾을 수 없습니다.', 401);

        const { userId, nickname, profileImg, isFirstLogin } = getUserInfoByToken.user;

        if (isFirstLogin) {
            await this.usersRepository.save({ userId, isFirstLogin: false });
        }

        const todayScore: number = await this.getTodayScoreByUserId(userId);

        return {
            userId,
            nickname,
            profileImg,
            isFirstLogin,
            today: { todayScore, todayRank: 0 },
            total: { totalScore: 0 },
        };
    }

    async getTodayScoreByUserId(userInfo: number): Promise<number> {
        // 오늘 스코어 찾아오기
        const today: Date = getTodayDate();
        const findTodayScore: TodayResult = await this.todayResultRepository.findOne({
            where: {
                userInfo,
                createdAt: MoreThan(today),
            },
        });

        let todayScore = 0;
        if (findTodayScore) todayScore = findTodayScore.todayScore;

        return todayScore;
    }

    // 회원 키워드 조회 API
    async userKeyword(token: string) {
        const user = await this.tokenMapRepository.findOneBy({
            token,
        });

        if (!user) throw new HttpException('정상적인 접근이 아닙니다.', 401);

        // 전체 키워드 찾아오기
        const findTotalkeyword = await this.TurnResultRepository.find({
            where: { userId: user.userInfo },
            select: { keyword: true, isSpeech: true, createdAt: true },
        });

        const speechKeywordArray = [];
        const quizKeywordArray = [];
        for (const result of findTotalkeyword) {
            if (result.isSpeech) {
                speechKeywordArray.push(result.keyword);
            } else {
                quizKeywordArray.push(result.keyword);
            }
        }

        const totalSpeechKeyword = [...new Set(speechKeywordArray)];
        const totalQuizKeyword = [...new Set(quizKeywordArray)];

        // 오늘 전체 키워드 찾아오기
        const today: Date = getTodayDate();
        const findTodaykeyword = await this.TurnResultRepository.find({
            where: {
                userId: user.userInfo,
                createdAt: MoreThan(today),
            },
            select: { keyword: true, isSpeech: true },
        });

        const todaySpeechKeywordArray = [];
        const todayQuizKeywordArray = [];
        for (const result of findTodaykeyword) {
            if (result.isSpeech) {
                todaySpeechKeywordArray.push(result.keyword);
            } else {
                todayQuizKeywordArray.push(result.keyword);
            }
        }
        const todaySpeechKeyword = [...new Set(todaySpeechKeywordArray)];
        const todayQuizKeyword = [...new Set(todayQuizKeywordArray)];

        // 데이터 정렬
        const data = {
            userId: user.userInfo,
            todaySpeechKeyword,
            todayQuizKeyword,
            totalSpeechKeyword,
            totalQuizKeyword,
        };
        console.log(data);
        return data;
    }

    // 닉네임 중복확인 API
    async overlapCheck(nickname: string) {
        const overlapCheck = await this.usersRepository.findOne({
            where: { nickname },
        });

        if (overlapCheck) {
            throw new HttpException('이미 사용 중인 닉네임입니다.', 412);
        }
        return { Message: '사용 가능한 닉네임입니다.' };
    }

    // 닉네임/캐릭터 수정 API
    async userInfoChange(token: string, body) {
        const userInfoChange = await this.tokenMapRepository.findOne({
            where: { token },
        });

        if (!userInfoChange) {
            throw new HttpException('해당하는 사용자를 찾을 수 없습니다.', 401);
        } else
            (userInfoChange) => {
                const { nickname, profileImg } = body;
                const bodyValue = Object.values({ nickname, profileImg });
                this.usersRepository.save(bodyValue);
            };

        return userInfoChange;
    }
}
