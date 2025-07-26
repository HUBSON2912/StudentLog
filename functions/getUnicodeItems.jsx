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