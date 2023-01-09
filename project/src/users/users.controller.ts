import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { HttpException } from '@nestjs/common';
import { ResultToDataInterceptor } from 'src/common/interceptors/resultToData.interceptor';
import { LoginUserDto } from './dto/login-user.dto';

@UseInterceptors(UndefinedToNullInterceptor, ResultToDataInterceptor)
@Controller('api/users')
export class UsersController {
    // 에러핸들링 -> throw new HttpException(message, status)
}
