import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResultToDataInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        // 전 부분
        //controller에서 return한 값을 {data:return값} 형태로 감싸주어 res를 보냄
        return next.handle().pipe(map((data) => ({ data })));
    }
}
