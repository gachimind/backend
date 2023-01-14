import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class KakaoAuthGuard extends AuthGuard('kakao') {
    async canActivate(context: ExecutionContext) {
        const activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
    }
}

// https://docs.nestjs.com/guards

// 패스포트의 auth guard를 이용해서 익스프레스의 미들웨어처럼 작동하게 함
// 패스포트의 역할은 사용자 이름, 암호 토큰 같은 자격 증명 확인

// 가드의 역할
// 조건에 따라서 주어진 요청을 핸들러가 처리할지 여부를 결정
// 특정 경로 컨텍스트로 연결되지 않으면 인증되지 않음
// 즉 특정 경로로 접속하지 않고 검증되지 않은 유저한테 403 401을 날린다

// 인증된 유저가 특정 경로로 호출했을 때 토큰을 추출하고 검증한 후
// 정보를 추출할 수 있는지에 대한 권한 확인
