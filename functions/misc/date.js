export function dateToDDMMYYYY(date) {
    if(! (date instanceof Date))
        return "";
    return `${String(date.getDate()).padStart(2,"0")}.${String(date.getMonth()+1).padStart(2,"0")}.${date.getFullYear()}`
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