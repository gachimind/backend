import { Injectable, CanActivate, ExecutionContext, NestMiddleware } from '@nestjs/common';
import { SocketIdMap } from 'src/games/entities/socketIdMap.entity';
import { PlayersService } from '../games/players.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly playersService: PlayersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToWs().getClient();
        const requestUser: SocketIdMap = await this.playersService.getUserBySocketId(
            request.socket.id,
        );
        if (!requestUser) {
            return false;
        }
        return true;
    }
}
// canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const req = context.switchToHttp().getRequest();
//     if (/* some logic with req */) {
//       req.myData = 'some custom value';
//     }
//     return true;
//   }

// async socketAuthentication(socketId: string, event: string) {
//     const requestUser: SocketIdMap = await this.playersService.getUserBySocketId(socketId);
//     if (!requestUser) {
//         throw new SocketException('로그인이 필요한 서비스입니다.', 403, event);
//     }
//     return requestUser;
// }

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//     constructor(private jwtService: JwtService, private userService: UsersService) {
//         super();
//     }
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const response = context.switchToHttp().getResponse();
//         const { authorization } = request.headers;
//         // const authorization = request.headers.authorization;
//         if (authorization === undefined) {
//             throw new HttpException('확인되지 않는 유저입니다.', HttpStatus.UNAUTHORIZED);
//             // 토큰 전송 실패
//         }

//         const token = authorization.replace('Bearer ', '');
//         const kakaoUserId: number = await this.validate(token);
//         response.kakaoUserId = kakaoUserId;
//         return true;
//     }

//     // 토큰 검증
//     async validate(token: string) {
//         try {
//             const { kakaoUserId } = await this.userService.tokenValidate(token);
//             return kakaoUserId;
//         } catch (error) {
//             switch (error.message) {
//                 // 토큰 오류 판단
//                 case 'invalid accessToken':
//                     throw new HttpException('정상적인 접근이 아닙니다.', 401);
//                 // 유효하지 않은 토큰

//                 case 'jwt expired':
//                     throw new HttpException('정상적인 접근이 아닙니다.', 410);
//                 // 토큰 만료

//                 // default:
//                 // throw new HttpException('서버 오류입니다.', 500);
//             }
//         }
//     }
// }
// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]);
//         if (!requiredRoles) {
//             return true;
//         }
//         const { headers } = context.switchToHttp().getRequest();

//         if (headers.authorization?.startsWith('Bearer ')) {
//             const token = headers.authorization.substring(7);
//             const verified = await this.authService.verifyToken(token);
//             const user = await this.userservice.find(verified.id);

//             return requiredRoles.some((role) => user.roles?.includes(role));
//         }

//         return null;
//     }
// }
// @Injectable()
// export class AuthenticationGatewayMiddleware {
//     constructor(private readonly playersService: playersService) {}
//     resolve() {
//         return (socket, next) => {
//             if (!requestUser) {
//                 throw new SocketException('로그인이 필요한 서비스입니다.', 403, 'create-room');
//             }

//             return jwt.verify(socket.handshake.query.auth_token, 'secret', async (err, payload) => {
//                 if (err) throw new WsException(err);

//                 const user = await this.userService.findOne({ where: { email: payload.email } });
//                 socket.handshake.user = user;
//                 return next();
//             });
//         };
//     }
// }

// @Injectable()
// export class AuthenticationGatewayMiddleware {
//     constructor(private readonly userService: UserService) { }
//     resolve() {
//         return (socket, next) => {
//             if (!socket.handshake.query.auth_token) {
//                 throw new WsException('Missing token.');
//             }

//             return jwt.verify(socket.handshake.query.auth_token, 'secret', async (err, payload) => {
//                 if (err) throw new WsException(err);

//                 const user = await this.userService.findOne({ where: { email: payload.email }});
//                 socket.handshake.user = user;
//                 return next();
//             });
//         }
//     }
//   }
