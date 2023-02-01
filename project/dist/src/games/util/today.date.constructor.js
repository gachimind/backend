"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayDate = void 0;
function getTodayDate() {
    const date = new Date();
    console.log('date :', date);
    const dateString = date.toDateString();
    const newDate = new Date(`${dateString} 0:00:00`);
    return newDate;
}
exports.getTodayDate = getTodayDate;
//# sourceMappingURL=today.date.constructor.js.map