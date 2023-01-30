"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketExceptionFilter = exports.SocketException = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const errors_1 = require("@nestjs/websockets/errors");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const constants_1 = require("@nestjs/core/constants");
class SocketException extends errors_1.WsException {
    constructor(message, status, eventName) {
        super({ message, status, eventName });
        this.message = message;
        this.status = status;
        this.eventName = eventName;
    }
}
exports.SocketException = SocketException;
let SocketExceptionFilter = class SocketExceptionFilter extends websockets_1.BaseWsExceptionFilter {
    catch(exception, host) {
        const client = host.switchToWs().getClient();
        const logger = new common_1.Logger('WsExceptionsHandler');
        logger.error(exception instanceof SocketException ? 'SocketException' : 'UnknownError', exception instanceof SocketException ? exception.eventName : 'unknownEvent', exception instanceof Error ? exception.stack : null);
        if (exception instanceof SocketException) {
            if (exception.eventName === 'game') {
                const roomId = [...client.rooms][1];
                return client.to(roomId).emit('error', {
                    error: {
                        errorMessage: exception.eventName,
                        status: exception.status,
                        event: exception.message,
                    },
                });
            }
            return client.emit('error', {
                error: {
                    errorMessage: exception.eventName,
                    status: exception.status,
                    event: exception.message,
                },
            });
        }
        console.log('handleUnknownError');
        client.emit('error', {
            status: 500,
            message: constants_1.MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
        });
    }
    isExceptionObject(err) {
        return (0, shared_utils_1.isObject)(err) && !!err.message;
    }
};
SocketExceptionFilter = __decorate([
    (0, common_1.Catch)(SocketException, Error)
], SocketExceptionFilter);
exports.SocketExceptionFilter = SocketExceptionFilter;
//# sourceMappingURL=ws-exception.filter.js.map