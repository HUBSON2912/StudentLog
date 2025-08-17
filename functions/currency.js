import { decode } from "html-entities";

export const currencies = require("../data/currency-symbols.json")["currency-symbol"].entry;

export function getCurrencySymbol(code) {
    let whichCurrencyCode = currencies.filter((val) => { return val._code == code; });
    const currency = whichCurrencyCode.length === 0 ? null : whichCurrencyCode[0];

    if (!currency) {
        return "";
    }

    const currencyUnicodeSymbol =
        currency["_unicode-decimal"].
            split(", ").
            map((val) => {
                return decode(`&#${val};`)
            });

    console.log(currencyUnicodeSymbol);
    return currencyUnicodeSymbol;

}