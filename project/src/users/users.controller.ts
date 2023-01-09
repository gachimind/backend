import { Controller, Get, Post, Delete, UseInterceptors, Body, Param, Query } from '@nestjs/common';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { HttpException } from '@nestjs/common';
import { ResultToDataInterceptor } from 'src/common/interceptors/resultToData.interceptor';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { IsEmail } from 'class-validator';

@UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    // 에러핸들링 -> throw new HttpException(message, status)

    // User entity를 respository로 inject해서 사용하는 예제입니다~
    @Get()
    async getAllUsers() {
        return await this.usersService.findAll();
    }

    @Get(':id')
    async getUserById(@Param() { id }) {
        const userId = Number(id);
        return await this.usersService.findByUserId(userId);
    }
    @Post()
    async createUser(@Body() userData: CreateUserDto) {
        const { email, nickname, profileImg } = userData;
        return await this.usersService.createUser({ email, nickname, profileImg });
    }
}
