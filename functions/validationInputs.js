export function convertFloatPoint(string) {
    return string.replaceAll(",", ".");
}

export function isLikeInt(string) {
    // optional sign and numbers
    const regexLikeInt = /^(-|\+)?[0-9]+$/gm;
    return (string.match(regexLikeInt) != null);
}

export function isLikeFloat(string) {
    // optional sign, numbers, optional dot and numbers
    const regexLikeInt = /^(-|\+)?[0-9]+((\.)?[0-9]*)?$/gm;
    return (string.match(regexLikeInt) != null);
}

export function isLikePositiveInt(string) {
    // optional sign and numbers
    const regexLikeInt = /^(\+)?[0-9]+$/gm;
    return (string.match(regexLikeInt) != null);
}

export function isLikePositiveFloat(string) {
    // optional sign, numbers, optional dot and numbers
    const regexLikeInt = /^(\+)?[0-9]+((\.)?[0-9]*)?$/gm;
    return (string.match(regexLikeInt) != null);
}