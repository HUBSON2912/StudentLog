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
        const [d, m, y] = dmy.split(".").map(x => parseInt(x));
        return new Date(y, m - 1, d);
    }
    catch (error) {
        console.error(`Unexpected error: ${JSON.stringify(error)}`);
        return "";
    }
}
export function HHMMToHour(hm) {
    try {
        const [h, m] = hm.split(":").map(x => parseInt(x));
        return { hours: h, minutes: m };
    }
    catch (error) {
        console.error(`Unexpected error: ${JSON.stringify(error)}`);
        return "";
    }
}

export function dateUniqueString(date) {
    date = date.toISOString().replaceAll("-", "").replaceAll(":", "");
    return date.slice(0, date.indexOf("."));
}

export function isTomorrow(date) {
    if (!(date instanceof Date)) {
        throw new Error('Invalid argument: you must provide a "date" instance');
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return date.getDate() === tomorrow.getDate() &&
        date.getMonth() === tomorrow.getMonth() &&
        date.getFullYear() === tomorrow.getFullYear();
}

export function isAtLeastThreeDaysAgo(date) {
    if (!(date instanceof Date)) {
        throw new Error('Invalid argument: you must provide a "date" instance');
    }

    const today = new Date();

    // 3 days, 24 hours, 60 minutes, 60 seconds, 1000 miliseconds
    return (today - date >= 3 * 24 * 60 * 60 * 1000);
}