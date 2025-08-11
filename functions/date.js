function getMonthName(month) {
    switch (month) {
        case 0:
            return "styczeń";
        case 1:
            return "luty";
        case 2:
            return "marzec";
        case 3:
            return "kwiecień";
        case 4:
            return "maj";
        case 5:
            return "czerwiec";
        case 6:
            return "lipiec";
        case 7:
            return "sierpień";
        case 8:
            return "wrzesień";
        case 9:
            return "październik";
        case 10:
            return "listopad";
        case 11:
            return "grudzień";
        default:
            break;
    }
}

function getShortMonthName(month) {
    return getMonthName(month).substring(0, 3);
}

function getDayString(date) {
    return String(date.getDate()).padStart(2, '0');
}

function getMonthNumberAsString(date) {
    return String(date.getMonth() + 1).padStart(2, '0');
}

function getYearString(date) {
    return String(date.getFullYear());
}

function getHourString(date) {
    return String(date.getHours()).padStart(2, "0");
}

function getMinuteAsString(date) {
    return String(date.getMinutes()).padStart(2, "0");
}


export function ISOToDate(iso) {
    const [yyyy, mm, dd] = iso.split("T")[0].split("-").map((x) => parseInt(x));
    const [hh, min, ss] = iso.split("T")[1].split(":").map((x) => parseInt(x));;
    return new Date(yyyy, mm-1, dd, hh, min);
}

// European format

export function getDD_MM_YYYYDate(date) {
    const dayAsString = getDayString(date);
    const monthAsString = getMonthNumberAsString(date);
    const yearAsString = getYearString(date);

    return (dayAsString + "." + monthAsString + "." + yearAsString);
}

export function getDD_Month_YYYYDate(date) {
    const dayAsString = getDayString(date);
    const monthAsString = getMonthName(date.getMonth());
    const yearAsString = getYearString(date);

    return (dayAsString + " " + monthAsString + " " + yearAsString);
}

export function getDD_Mon_YYYYDate(date) {
    const dayAsString = getDayString(date);
    const monthAsString = getShortMonthName(date.getMonth());
    const yearAsString = getYearString(date);

    return (dayAsString + " " + monthAsString + " " + yearAsString);
}

export function getDD_MM_YYYY_HH_MMDate(date) {
    const hourAsString = getHourString(date);
    const minuteAsString = getMinuteAsString(date);

    return getDD_MM_YYYYDate(date) + " " + hourAsString + ":" + minuteAsString;
}

export function getDD_Month_YYYY_HH_MMDate(date) {
    const hourAsString = getHourString(date);
    const minuteAsString = getMinuteAsString(date);

    return getDD_Month_YYYYDate(date) + " " + hourAsString + ":" + minuteAsString;
}

export function getDD_Mon_YYYY_HH_MMDate(date) {
    const hourAsString = getHourString(date);
    const minuteAsString = getMinuteAsString(date);

    return getDD_Mon_YYYYDate(date) + "  " + hourAsString + ":" + minuteAsString;
}


// American format

export function getMM_DD_YYYYDate(date) {
    const dayAsString = getDayString(date);
    const monthAsString = getMonthNumberAsString(date);
    const yearAsString = getYearString();

    return (monthAsString + "/" + dayAsString + "/" + yearAsString);
}

export function getMM_DD_YYYY_HH_MMDate(date) {
    const hourAsString = getHourString(date);
    const minuteAsString = getMinuteAsString(date);

    return getMM_DD_YYYYDate(date) + "  " + hourAsString + ":" + minuteAsString;
}