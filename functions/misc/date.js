export function dateToDDMMYYYY(date) {
    if (!(date instanceof Date))
        return "";
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`
}

export function hourToHHMM(time) {
    try {
        return `${time.hours}:${String(time.minutes).padStart(2, '0')}`;
    }
    catch (error) {
        console.error(`Unexpected error: ${JSON.stringify(error)}`);
        return "";
    }
}

export function DDMMYYYYToDate(dmy) {
    try {
        const [d, m, y] = dmy.split(".").map(x=>parseInt(x));
        return new Date(y, m - 1, d);
    }
    catch (error) {
        console.error(`Unexpected error: ${JSON.stringify(error)}`);
        return "";
    }
}
export function HHMMToHour(hm) {
    try {
        const [h, m] = hm.split(":").map(x=>parseInt(x));
        return { hours: h, minutes: m };
    }
    catch (error) {
        console.error(`Unexpected error: ${JSON.stringify(error)}`);
        return "";
    }
}