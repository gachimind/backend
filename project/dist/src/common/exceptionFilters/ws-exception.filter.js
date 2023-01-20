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
        super.catch(exception, host);
        const ctx = host.switchToWs();
        const socket = ctx.getClient();
        socket.emit('error', {
            error: {
                errorMessage: exception.message,
                status: exception.status,
                event: exception.eventName,
            },
        });
    }
};
SocketExceptionFilter = __decorate([
    (0, common_1.Catch)(SocketException)
], SocketExceptionFilter);
exports.SocketExceptionFilter = SocketExceptionFilter;
//# sourceMappingURL=ws-exception.filter.js.map