import { themeDark, themeLight } from "../theme";

export const POSSIBLE_TABLE_NAMES = ["students", "lessons", "status", "pricelist"];

export const SUGGESTED_PLATFORMS = ["Discord", "Google Meet", "Microsoft Teams", "Skype", "Zoom"];

// value is a kind of ID
export const POSSIBLE_FORMS = [
    { value: 0, icon: "laptop", label: "Zdalnie" },
    { value: 1, icon: "home", label: "Stacjonarnie" },
    { value: 2, icon: "shuffle-variant", label: "Mieszanie" }
];

// form id where it's necessary to use remotely form data (platform and nick) 
export const REMOTELY_FORM = [0, 2];

// form id where it's necessary to use stationary form data (address) 
export const STATIONARY_FORM = [1, 2];

export const POSSIBLE_LESSONS_ADD_MODE = [
    { value: 0, icon: "numeric-1-circle", label: "Jedna lekcja" },
    { value: 1, icon: "calendar", label: "Regularnie" }
];

export const POSSIBLE_STATUSES = {
    dark: [
        { value: 0, label: "Zaplanowane", colors: themeDark.colors.status[0] },
        { value: 1, label: "Wykonane", colors: themeDark.colors.status[1] },
        { value: 2, label: "Opłacone", colors: themeDark.colors.status[2] }
    ],
    light: [
        { value: 0, label: "Zaplanowane", colors: themeLight.colors.status[0] },
        { value: 1, label: "Wykonane", colors: themeLight.colors.status[1] },
        { value: 2, label: "Opłacone", colors: themeLight.colors.status[2] }
    ]
};

export const STUDENTS_ORDER = [
    {
        label: "Trafność ￬",
        paramName: ["disabled", "id"],
        ascending: true
    },
    {
        label: "Trafność ￪",
        paramName: ["disabled", "id"],
        ascending: false
    },
    {
        label: "Imię i nazwisko ￬",
        paramName: ["name", "surname"],
        ascending: true
    },
    {
        label: "Imię i nazwisko ￪",
        paramName: ["name", "surname"],
        ascending: false
    },
    {
        label: "Nazwisko i imię ￬",
        paramName: ["surname", "name"],
        ascending: true
    },
    {
        label: "Nazwisko i imię ￪",
        paramName: ["surname", "name"],
        ascending: false
    },
    {
        label: "Forma ￬",
        paramName: ["form"],
        ascending: true
    },
    {
        label: "Forma ￪",
        paramName: ["form"],
        ascending: false
    },
];

export const LESSONS_ORDER = [
    {
        label: "Trafność ￬",
        paramName: ["status", "date", "hour", "id"],
        ascending: true
    },
    {
        label: "Trafność ￪",
        paramName: ["status", "date", "hour", "id"],
        ascending: false
    },
    {
        label: "ID ucznia ￬",
        paramName: ["student_id"],
        ascending: true
    },
    {
        label: "ID ucznia ￪",
        paramName: ["student_id"],
        ascending: false
    },
    {
        label: "Data ￬",
        paramName: ["date", "hour"],
        ascending: true
    },
    {
        label: "Data ￪",
        paramName: ["date", "hour"],
        ascending: false
    },
    {
        label: "Przedmiot i poziom ￬",
        paramName: ["subject", "level"],
        ascending: true
    },
    {
        label: "Przedmiot i poziom ￪",
        paramName: ["subject", "level"],
        ascending: false
    },
    {
        label: "Cena ￬",
        paramName: ["price"],
        ascending: true
    },
    {
        label: "Cena ￪",
        paramName: ["price"],
        ascending: false
    },
    {
        label: "Status ￬",
        paramName: ["status"],
        ascending: true
    },
    {
        label: "Status ￪",
        paramName: ["status"],
        ascending: false
    },
];

export const WEEK_DAYS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

export const POSSIBLE_LANGUAGES = ["Polski", "English"]

export const POSSIBLE_ROUNDING_MODE = [{ id: 0, label: "w górę" }, { id: 1, label: "w dół" }, { id: 2, label: "matematycznie" }, { id: 3, label: "nie zaokrąglaj" },]