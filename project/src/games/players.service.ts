import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketException } from 'src/common/exceptionFilters/ws-exception.filter';
import { LoginUserToSocketDto } from 'src/users/dto/login-user.dto';

export const socketIdMap = {}; // {socket.id : {nickname, profileImg, currentRoom}} -> repository로 변경해야 함

const authentication = { token1: 1, token2: 2, token3: 3 }; // {token : userId} in db -> repository로 변경해야 함

const fakeDBUserTable = [
    //  repository로 변경해야 함
    {
        userId: 1,
        email: 'test1@email.com',
        nickname: '세현1',
        profileImg:
            'https://t3.ftcdn.net/jpg/02/95/94/94/360_F_295949484_8BrlWkTrPXTYzgMn3UebDl1O13PcVNMU.jpg',
    },
    {
        userId: 2,
        email: 'test2@email.com',
        nickname: '예나1',
        profileImg:
            'https://t3.ftcdn.net/jpg/02/95/94/94/360_F_295949484_8BrlWkTrPXTYzgMn3UebDl1O13PcVNMU.jpg',
    },
    {
        userId: 3,
        email: 'test1@email.com',
        nickname: '도영1',
        profileImg:
            'https://t3.ftcdn.net/jpg/02/95/94/94/360_F_295949484_8BrlWkTrPXTYzgMn3UebDl1O13PcVNMU.jpg',
    },
];

@Injectable()
export class PlayersService {
    handleDisconnect(socket: Socket) {
        socketIdMap[socket.id] = null;
    }

    async socketIdMapToLoginUser(token: string, socket: Socket) {
        // token을 parsing하고, validate한 회원인지 검증 -> !!!검증 미들웨어 같은거 하나 만들어서 붙여야 함!!!
        const userId: number = authentication[token];
        if (!userId) {
            socket.emit('log-in', { errorMessage: '잘못된 접근입니다.', status: 401 });
            throw new SocketException('잘못된 접근입니다.', 401, 'log-in');
        }

        // socketIdMap에서 동일 socketId가 있는지 확인 (로그인한 페이지에서 )
        if (socketIdMap[socket.id]) {
            socket.emit('log-in', { errorMessage: '이미 로그인된 회원입니다.', status: 403 });
            throw new SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
        }

        // socketIdMap에서 value에 회원의 userId가 있으면, 이중 로그인을 간주하고, 에러 처리
        const usersInSocketIdMap: LoginUserToSocketDto[] = Object.values(socketIdMap);
        const requestUserInSocketIdMap = usersInSocketIdMap.find((user) => {
            if (!user) return null;
            return user.userId === userId;
        });
        if (requestUserInSocketIdMap) {
            socket.emit('log-in', { errorMessage: '이미 로그인된 회원입니다.', status: 403 });
            throw new SocketException('이미 로그인된 회원입니다.', 403, 'log-in');
        }

        // 위의 검사를 통과했다면, 회원 정보를 db에서 조회하여, socketIdMap에 매핑
        const user = await fakeDBUserTable.find((user) => user.userId === userId);
        socketIdMap[socket.id] = {
            userId,
            nickname: user.nickname,
            profileImg: user.profileImg,
        };
        return console.log(socketIdMap[socket.id]);
    }

    socketIdMapToLogOutUser(socket: Socket) {
        socketIdMap[socket.id] = null;
        return console.log(socketIdMap[socket.id]);
    }

    handleLeaveRoom(socketId) {
        socketIdMap[socketId].currentRoom = null;
        return console.log(socketIdMap[socketId]);
    }
}
