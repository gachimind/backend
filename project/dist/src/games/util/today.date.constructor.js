"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDate = void 0;
function getDate() {
    const date = new Date();
    const kDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const dateString = kDate.toISOString();
    dateString.split('T')[0];
    return new Date(`${dateString.split('T')[0]}`);
}
exports.getDate = getDate;
//# sourceMappingURL=today.date.constructor.js.map