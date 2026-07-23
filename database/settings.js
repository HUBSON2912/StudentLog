import { createAsyncStorage } from "@react-native-async-storage/async-storage";

export const SETTINGS_KEYS={
    // language: "language", 
    currency: "currency", 
    showIncomes: "showIncomes", 
    showNumberStudents: "showNumberStudents", 
    usePriceList: "usePriceList", 
    discountForFirst: "discountForFirst", 
    rounding: "rounding",
    autocompleteInputs: "autocompleteInputs",
}

const DEFAULT_VALUES={
    // language: "Polski", 
    currency: JSON.stringify({
		"symbol": "zł",
		"name": "Polish Zloty",
		"symbol_native": "zł",
		"decimal_digits": 2,
		"rounding": 0,
		"code": "PLN",
		"name_plural": "Polish zlotys"
	}), 
    showIncomes: "true", 
    showNumberStudents: "true", 
    usePriceList: "true", 
    discountForFirst: "100", 
    rounding: JSON.stringify({ id: 0, label: "w dół" }),
    autocompleteInputs: "true",
}

export function correctSettingsKey(key) {
    return Object.values(SETTINGS_KEYS).includes(key);
}

export async function settingsGetStorage() {
    const storage=createAsyncStorage("settings");

    for(let key in SETTINGS_KEYS) {
        // if key is not saved yet
        if(!(await storage.getItem(SETTINGS_KEYS[key]))) {
            storage.setItem(SETTINGS_KEYS[key], DEFAULT_VALUES[key]);
        }
    }

    return storage;
}

export async function settingsSet(key, value) {
    if(!correctSettingsKey(key))
        throw new Error(`Unknown settings key: ${key}`);

    const storage=await settingsGetStorage();
    await storage.setItem(key, value);
}

export async function settingsGet(key) {
    if(!correctSettingsKey(key))
        throw new Error(`Unknown settings key: ${key}`);

    const storage=await settingsGetStorage();
    const value=await storage.getItem(key);
    return value;
}

export async function settingsGetAll() {
    const storage=await settingsGetStorage();
    return storage.getMany(Object.values(SETTINGS_KEYS));
}