"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const ws_exception_filter_1 = require("../common/exceptionFilters/ws-exception.filter");
let ChatService = class ChatService {
    checkAnswer(turn, message) {
        if (message != turn.keyword) {
            return false;
        }
        return true;
    }
    FilterAnswer(turn, userId, message) {
        if (turn.currentEvent === 'readyTime' || turn.currentEvent === 'speechTime') {
            if (turn.speechPlayer !== userId && turn.currentEvent === 'readyTime')
                return false;
            const isAnswer = this.checkAnswer(turn, message);
            if (isAnswer) {
                console.log('isAnswer block');
                if (userId === turn.speechPlayer) {
                    throw new ws_exception_filter_1.SocketException('발표자는 정답을 채팅으로 알릴 수 없습니다.', 400, 'send-chat');
                }
                return true;
            }
        }
        return false;
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map