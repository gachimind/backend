import { ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets/errors';
export type SocketExceptionStatus = 400 | 401 | 403 | 404 | 500;
export declare class SocketException extends WsException {
    status: any;
    eventName: any;
    constructor(message: string, status: SocketExceptionStatus, eventName: string);
}
export declare class SocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: SocketException | Error | TypeError, host: ArgumentsHost): void;
    handleError<TClient extends {
        emit: Function;
    }>(client: TClient, exception: any): void;
    handleUnknownError<TClient extends {
        emit: Function;
    }>(exception: any, client: TClient): void;
    isExceptionObject(err: any): err is Error;
}
