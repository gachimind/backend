import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch(Error)
export class AllExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        super.catch(exception, host);
        const ctx = host.switchToWs();
        const socket = ctx.getClient();
        const error = {
            errorMessage: exception.message,
        };
        socket.emit('error', {
            error,
        });
    }
}
