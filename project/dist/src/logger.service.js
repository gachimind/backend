"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const winston = require("winston");
const moment = require("moment");
const nest_winston_1 = require("nest-winston");
const { errors, combine, timestamp, printf } = winston.format;
class LoggerService {
    constructor(service) {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.File({
                    level: 'error',
                    filename: `error-${moment(new Date()).format('YYYY-MM-DD')}.log`,
                    dirname: 'logs',
                    maxsize: 5000000,
                    format: combine(errors({ stack: true }), timestamp({ format: 'isoDateTime' }), printf((info) => {
                        return `${info.message}`;
                    })),
                }),
                new winston.transports.Console({
                    level: 'debug',
                    format: combine(timestamp({ format: 'isoDateTime' }), nest_winston_1.utilities.format.nestLike(service, {
                        prettyPrint: true,
                    })),
                }),
                new winston.transports.File({
                    filename: `application-${moment(new Date()).format('YYYY-MM-DD')}.log`,
                    dirname: 'logs',
                    maxsize: 5000000,
                    format: combine(timestamp({ format: 'isoDateTime' }), printf((info) => {
                        return `${info.message}`;
                    })),
                }),
            ],
        });
    }
    log(message) {
        this.logger.log({ level: 'info', message });
    }
    info(message) {
        this.logger.info(message);
    }
    error(message, trace) {
        this.logger.error(message, trace);
    }
    warn(message) {
        this.logger.warning(message);
    }
    debug(message) {
        this.logger.debug(message);
    }
    verbose(message) {
        this.logger.verbose(message);
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map