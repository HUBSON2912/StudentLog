import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getCurrency() {
    const currency = await AsyncStorage.getItem("currency");
    if (!currency) {
        // default currency is US Dolar
        const defCurr = {
            "_code": "USD",
            "_unicode-decimal": "36",
            "_unicode-hex": "24",
            "__text": "United States Dollar"
        };
        await AsyncStorage.setItem("currency", JSON.stringify(defCurr));
        return defCurr;
    }
    else {
        const curr=JSON.parse(currency);
        return curr;
    }
}

export async function setCurrency(value) {
    await AsyncStorage.setItem("currency", JSON.stringify(value));
}