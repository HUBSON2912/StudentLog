export function getMonthName(month) {
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

export function getShortMonthName(month) {
    return getMonthName(month).substring(0, 3);
}

export function getDD_MM_YYYYDate(date) {
    const dayAsString = String(date.getDate()).padStart(2, '0');
    const monthAsString = String(date.getMonth() + 1).padStart(2, '0');
    const yearAsString = String(date.getFullYear());
    return (dayAsString + "." + monthAsString + "." + yearAsString);
}

export function getDD_Month_YYYYDate(date) {
    const dayAsString = String(date.getDate()).padStart(2, '0');
    const monthAsString = getMonthName(date.getMonth());
    const yearAsString = String(date.getFullYear());
    return (dayAsString + " " + monthAsString + " " + yearAsString);
}

export function getDD_Mon_YYYYDate(date) {
    const dayAsString = String(date.getDate()).padStart(2, '0');
    const monthAsString = getShortMonthName(date.getMonth());
    const yearAsString = String(date.getFullYear());
    return (dayAsString + " " + monthAsString + " " + yearAsString);
}

export function getDD_MM_YY_HH_MMDate(date) {
    const hourAsString=String(date.getHours()).padStart(2,"0");
    const minuteAsString=String(date.getMinutes()).padStart(2,"0");
    return getDD_MM_YYYYDate(date)+" "+hourAsString+":"+minuteAsString;
}