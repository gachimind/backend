"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger.service");
let LoggerMiddleware = class LoggerMiddleware {
    constructor() { }
    use(req, res, next) {
        const loggerService = new logger_service_1.LoggerService(req.url.slice(1).split('/')[req.url.slice(1).split('/').length - 1]);
        const tempUrl = req.method + ' ' + req.url.split('?')[0];
        const _headers = req.headers ? req.headers : {};
        const _query = req.query ? req.query : {};
        const _body = req.body ? req.body : {};
        const _url = tempUrl ? tempUrl : {};
        loggerService.info(JSON.stringify({
            url: _url,
            headers: _headers,
            query: _query,
            body: _body,
        }));
        next();
    }
};
LoggerMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggerMiddleware);
exports.LoggerMiddleware = LoggerMiddleware;
//# sourceMappingURL=logger.middleware.js.map