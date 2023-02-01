import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';

const logDir = __dirname + '/../../logs';
const dailyOptions = (level: string) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + `/${level}`,
        filename: `%DATE%.${level}.log`,
        maxFiles: 30,
        zippedArchive: true,
    };
};

export const winstonLogger = WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'silly',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                utilities.format.nestLike('가치마인드', {
                    prettyPrint: true,
                }),
            ),
        }),

        new winstonDaily(dailyOptions('info')),
        new winstonDaily(dailyOptions('warn')),
        new winstonDaily(dailyOptions('error')),
    ],
});
