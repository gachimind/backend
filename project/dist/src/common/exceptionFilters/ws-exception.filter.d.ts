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
    catch(exception: Error, host: ArgumentsHost): boolean;
    isExceptionObject(err: any): err is Error;
}
