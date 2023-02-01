export function getTodayDate() {
    const date = new Date('Z');
    console.log('date :', date);
    console.log('ISOString :', date.toISOString());

    const dateString = date.toDateString();
    const newDate = new Date(`${dateString} 0:00:00`);
    return newDate;
}
