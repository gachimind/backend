export function getTodayDate() {
    const date = new Date();
    const dateString = date.toDateString();
    const newDate = new Date(`${dateString} 0:00:00`);
    return newDate;
}
