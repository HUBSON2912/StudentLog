import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getCurrency() {
    const currency = await AsyncStorage.getItem("currency");
    if (!currency) {
        // default currency is PLN
        const defCurr = {
            "_code": "PLN",
            "_unicode-decimal": "122, 322",
            "_unicode-hex": "7a, 142",
            "__text": "Poland Zloty"
        };
        await AsyncStorage.setItem("currency", JSON.stringify(defCurr));
        return defCurr;
    }
    else {
        const curr = JSON.parse(currency);
        return curr;
    }
}

export async function setCurrency(value) {
    await AsyncStorage.setItem("currency", JSON.stringify(value));
}