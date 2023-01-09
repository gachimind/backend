import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets/errors';

// 400 = bad request | 401 = unauthorized | 403 = forbidden | 404 = not found | 500 = internal server error
export type SocketExceptionStatus = 400 | 401 | 403 | 404 | 500;

export class SocketException extends WsException {
    status;
    constructor(message: string, status: SocketExceptionStatus) {
        super({ message, status });
        this.status = status;
    }
}

@Catch(SocketException)
export class SocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: SocketException, host: ArgumentsHost) {
        super.catch(exception, host);

        // client에 어떻게 메세지 내려가는지 확인 해야 함
        // const ctx = host.switchToWs();
        // const response = ctx.getData();
        // const status = exception.status;
        // const errorMessage = exception.message;

        // return { errorMessage, status };
        // const ackCallback = host.getArgByIndex(2);
        // ackCallback(exception);
    }
}
