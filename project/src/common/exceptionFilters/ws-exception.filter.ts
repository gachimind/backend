import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets/errors';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { MESSAGES } from '@nestjs/core/constants';
import { Socket } from 'socket.io';

// 400 = bad request | 401 = unauthorized | 403 = forbidden | 404 = not found | 500 = internal server error
export type SocketExceptionStatus = 400 | 401 | 403 | 404 | 500;

export class SocketException extends WsException {
    status;
    eventName;
    constructor(message: string, status: SocketExceptionStatus, eventName: string) {
        super({ message, status, eventName });
        this.message = message;
        this.status = status;
        this.eventName = eventName;
    }
}

@Catch()
export class SocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const client: Socket = host.switchToWs().getClient();
        this.handleError(client, exception);
        const logger = new Logger('WsExceptionsHandler');
        logger.error(
            exception instanceof SocketException ? 'SocketException' : 'UnknownError',
            exception instanceof SocketException ? exception.eventName : 'unknownEvent',
            exception instanceof Error ? exception.stack : null,
        );
    }

    handleError<TClient extends { emit: Function }>(client: TClient, exception: any): void {
        if (!(exception instanceof SocketException)) {
            return this.handleUnknownError(exception, client);
        }
        const event = exception.eventName;
        const status = exception.status;
        const errorMessage = exception.message;
        const error = {
            errorMessage,
            status,
            event,
        };

        client.emit('error', { error });
    }

    handleUnknownError<TClient extends { emit: Function }>(exception: any, client: TClient): void {
        console.log('handleUnknownError');

        const status = 500;

        client.emit('error', {
            status,
            message: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
        });
    }

    isExceptionObject(err: any): err is Error {
        return isObject(err) && !!(err as Error).message;
    }
}
