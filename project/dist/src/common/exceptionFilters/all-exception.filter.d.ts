import { ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
export declare class AllExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: Error, host: ArgumentsHost): void;
}
