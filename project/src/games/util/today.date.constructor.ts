export function getTodayDate() {
    const date = new Date();
    console.log('date :', date);

    const dateString = date.toDateString();
    const newDate = new Date(`${dateString} 0:00:00`);
    return newDate;
}
