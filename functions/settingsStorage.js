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

export async function getShowIncomes() {
    const showIncomes = await AsyncStorage.getItem("showIncomes");
    return showIncomes === "false" ? false : true;
}

export async function setShowIncomes(value) {
    await AsyncStorage.setItem("showIncomes", value ? "true" : "false");
}

export async function getShowAmountOfStudents() {
    return (await AsyncStorage.getItem("showAmountOfStudents") === "false") ? false : true;
}

export async function setShowAmountOfStudents(value) {
    await AsyncStorage.setItem("showAmountOfStudents", value ? "true" : "false");
}