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
        const ctx = host.switchToWs();
        const socket = ctx.getClient();
        socket.emit('error', {
            data: {
                errorMessage: exception.message,
                status: exception.status,
                event: exception.eventName,
            },
        });
    }
}
