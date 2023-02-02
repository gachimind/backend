import * as winston from 'winston';
export declare const consoleOptions: {
    level: string;
    exceptionHandlers: boolean;
    format: winston.Logform.Format;
};
export declare const dailyOptions: (level: string, maxFiles: number) => {
    level: string;
    datePattern: string;
    dirname: string;
    filename: string;
    maxFiles: number;
    zippedArchive: boolean;
};
export declare const winstonLogger: import("@nestjs/common").LoggerService;
