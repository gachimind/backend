import { CreateUserDto } from './create-user.dto';
declare const LoginUserToSocketDto_base: import("@nestjs/common").Type<Omit<CreateUserDto, "email">>;
export declare class LoginUserToSocketDto extends LoginUserToSocketDto_base {
    userId: number;
}
export {};
