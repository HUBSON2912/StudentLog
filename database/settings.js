export const SETTINGS_KEYS={
    language: "language", 
    currency: "currency", 
    showIncomes: "showIncomes", 
    showNumberStudents: "showNumberStudents", 
    usePriceList: "usePriceList", 
    discountForFirst: "discountForFirst", 
    rounding: "rounding",
    notificationsOn: "notificationsOn",
    notifUnknownTopic: "notifUnknownTopic",
    notifUnpaidLesson: "notifUnpaidLesson",
    notifTodayLesson: "notifTodayLesson",
}

function correctSettingsKey(key) {
    return (key in Object.values(SETTINGS_KEYS))
}

export function getStorage() {
    return createAsyncStorage("settings");
}

export async function settingsSet(key, value) {
    if(!correctSettingsKey(key))
        throw new Error(`Unknown settings key: ${key}`);

    const storage=getStorage();
    await storage.setItem(name, value);
}

export async function settingsGet(key) {
    if(!correctSettingsKey(key))
        throw new Error(`Unknown settings key: ${key}`);

    const storage=getStorage();
    const value=await storage.getItem(key);
    return value;
}

export async function settingsGetAll() {
    const storage=getStorage();
    return storage.getMany(Object.values(SETTINGS_KEYS));
}