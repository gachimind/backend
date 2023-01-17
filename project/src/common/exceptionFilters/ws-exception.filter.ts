import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets/errors';

// 400 = bad request | 401 = unauthorized | 403 = forbidden | 404 = not found | 500 = internal server error
export type SocketExceptionStatus = 400 | 401 | 403 | 404 | 500;

export class SocketException extends WsException {
    status;
    eventName;
    constructor(message: string, status: SocketExceptionStatus, eventName: string) {
        super({ message, status, eventName });
    }
}

@Catch(SocketException)
export class SocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: SocketException, host: ArgumentsHost) {
        super.catch(exception, host);
        console.error(exception);

        // client에 어떻게 메세지 내려가는지 확인 해야 함
        // const ctx = host.switchToWs();
        // const response = ctx.getClient();
        // console.log('ws-exception response', response.id);
        // const errorMessage = exception.message;
        // const status = exception.status;
        // const eventName = exception.eventName;
        // response.emit(`${eventName}`, { errorMessage, status });
    }
}
