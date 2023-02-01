"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 68:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.winstonLogger = void 0;
const nest_winston_1 = __webpack_require__(69);
const winstonDaily = __webpack_require__(70);
const winston = __webpack_require__(71);
const logDir = __dirname + '/../../logs';
const dailyOptions = (level) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + `/${level}`,
        filename: `%DATE%.${level}.log`,
        maxFiles: 30,
        zippedArchive: true,
    };
};
exports.winstonLogger = nest_winston_1.WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'silly',
            format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), nest_winston_1.utilities.format.nestLike('가치마인드', {
                prettyPrint: true,
            })),
        }),
        new winstonDaily(dailyOptions('info')),
        new winstonDaily(dailyOptions('warn')),
        new winstonDaily(dailyOptions('error')),
    ],
});


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("bd1bd2a8d19bdf242935")
/******/ })();
/******/ 
/******/ }
;