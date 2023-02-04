"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLogger = exports.dailyOptions = exports.consoleOptions = void 0;
const nest_winston_1 = require("nest-winston");
const winstonDaily = require("winston-daily-rotate-file");
const winston = require("winston");
const logDir = __dirname + '/../../../../logs';
const { simple, combine, timestamp, colorize } = winston.format;
exports.consoleOptions = {
    level: process.env.NODE_ENV === 'production' ? 'http' : 'silly',
    exceptionHandlers: true,
    format: combine(colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), nest_winston_1.utilities.format.nestLike('가치마인드', {
        prettyPrint: true,
    })),
};
const dailyOptions = (level, maxFiles) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + `/${level}`,
        filename: level === 'debug' ? `%DATE%.all.log` : `%DATE%.${level}.log`,
        maxFiles,
        zippedArchive: true,
    };
};
exports.dailyOptions = dailyOptions;
exports.winstonLogger = nest_winston_1.WinstonModule.createLogger({
    transports: [
        new winston.transports.Console(exports.consoleOptions),
        new winstonDaily((0, exports.dailyOptions)('info', 7)),
        new winstonDaily((0, exports.dailyOptions)('warn', 14)),
        new winstonDaily((0, exports.dailyOptions)('error', 30)),
    ],
});
//# sourceMappingURL=winston.util.js.map