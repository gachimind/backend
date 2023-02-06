export declare class CreateUserDto {
    kakaoUserId: number | null;
    githubUserId: number | null;
    email: string;
    nickname: string;
    profileImg: string;
    isFirstLogin?: boolean;
}
