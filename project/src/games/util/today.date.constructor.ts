export function getTodayDate() {
    const date = new Date();
    console.log('date :', date);
    console.log('ISOString :', date.toISOString());

    const dateString = date.toDateString();
    const newDate = new Date(`${dateString} 0:00:00`);
    return newDate;
}

export function getDate() {
    const date = new Date();
    const dateString = date.toISOString();
    dateString.split('T')[0];
    return new Date(`${dateString.split('T')[0]}`);
}
