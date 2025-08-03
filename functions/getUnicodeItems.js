import { decode } from "html-entities";

export function bullet() {
    return decode("&bull;");
}

export function clipboard() {
    return decode("&#128203;");
}

export function plus() {
    return decode("&plus;");
}

export function account() {
    return decode("&#128100;");
}

export function cog() {
    return decode("&#9881;");
}

export function phone() {
    return decode("&#9743;");
}

export function mail() {
    return decode("&#9993;");
}

export function arrowDown() {
    return decode("&#9660;");
}

export function arrowUp() {
    return decode("&#9650;");
}