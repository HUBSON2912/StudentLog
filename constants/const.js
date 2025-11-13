import { themeDark, themeLight } from "../theme";

export const possibleTableNames = ["students", "lessons", "status", "pricelist"];

export const suggestedPlatforms = ["Discord", "Google Meet", "Messenger", "Microsoft Teams", "Skype", "Zoom"];

// value is a kind of ID
export const possibleForms = [
    { value: 0, icon: "laptop", label: "Zdalnie" },
    { value: 1, icon: "home", label: "Stacjonarnie" },
    { value: 2, icon: "shuffle-variant", label: "Mieszanie" }
];

// form id where it's necessary to use remotely form data (platform and nick) 
export const remotelyForm = [0, 2];

// form id where it's necessary to use stationary form data (address) 
export const stationaryForm = [1, 2];

export const possibleLessonsAddMode = [
    { value: 0, icon: "numeric-1-circle", label: "Jedna lekcja" },
    { value: 1, icon: "calendar", label: "Regularnie" }
];

export const possibleStatuses = {
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
}