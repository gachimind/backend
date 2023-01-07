import { Controller, UseInterceptors } from '@nestjs/common';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
// Http 통신 중 throw new Error 상황에서 사용 -> throw new HttpException(message, status)
import { HttpException } from '@nestjs/common';

@UseInterceptors(UndefinedToNullInterceptor)
@Controller('api/users')
export class UsersController {}
