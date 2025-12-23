export function hourToHHMM(time) {
    try {
        return `${time.hours}:${String(time.minutes).padStart(2, '0')}`;
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

/**
 * 
 * @param {{hours: number, minutes: number}} a 
 * @param {{hours: number, minutes: number}} b 
 */
export function compareHour(a,b) {
    if(a.hours<b.hours) {
        return -1;
    }
    if(a.hours>b.hours) {
        return 1;
    }
    if(a.minutes<b.minutes) {
        return -1;
    }
    if(a.minutes>b.minutes) {
        return 1;
    }
    return 0;
}