export function getDate() {
    const date = new Date();
    const kDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const dateString = kDate.toISOString();
    dateString.split('T')[0];
    return new Date(`${dateString.split('T')[0]}`);
}
