import { ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets/errors';
export type SocketExceptionStatus = 400 | 401 | 403 | 404 | 500;
export declare class SocketException extends WsException {
    status: any;
    constructor(message: string, status: SocketExceptionStatus);
}
export declare class SocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: SocketException, host: ArgumentsHost): void;
}
