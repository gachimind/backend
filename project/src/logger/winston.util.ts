import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';

const logDir = __dirname + '../../logs';
const { simple, combine, timestamp, colorize } = winston.format;

// TODO : printf 함수 사용해서 원하는대로 로깅 하기
export const consoleOptions = {
    level: process.env.NODE_ENV === 'production' ? 'http' : 'silly',
    exceptionHandlers: true,
    format:
        process.env.NODE_ENV === 'production'
            ? combine(colorize({ all: true }), simple())
            : combine(
                  colorize({ all: true }),
                  timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
                  utilities.format.nestLike('가치마인드', {
                      prettyPrint: true,
                  }),
              ),
};

export const dailyOptions = (level: string, maxFiles: number) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + `/${level}`,
        filename: level === 'debug' ? `%DATE%.all.log` : `%DATE%.${level}.log`,
        maxFiles,
        zippedArchive: true,
    };
};

export const winstonLogger = WinstonModule.createLogger({
    transports: [
        new winston.transports.Console(consoleOptions),
        new winstonDaily(dailyOptions('info', 7)),
        new winstonDaily(dailyOptions('warn', 14)),
        new winstonDaily(dailyOptions('error', 30)),
    ],
});
