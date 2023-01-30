"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDate = exports.getTodayDate = void 0;
function getTodayDate() {
    const date = new Date();
    const dateString = date.toDateString();
    const newDate = new Date(`${dateString} 0:00:00`);
    return newDate;
}
exports.getTodayDate = getTodayDate;
function getDate() {
    const date = new Date();
    const dateString = date.toISOString();
    dateString.split('T')[0];
    return new Date(`${dateString.split('T')[0]}`);
}
exports.getDate = getDate;
//# sourceMappingURL=today.date.constructor.js.map