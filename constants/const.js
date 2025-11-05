export const possibleTableNames = ["students", "lessons", "status", "pricelist"];

export const suggestedPlatforms = ["Discord", "Google Meet", "Messenger", "Microsoft Teams", "Skype", "Zoom"];

// value is a kind of ID
export const possibleForms = [
    { value: 0, icon: "laptop", label: "Zdalnie" },
    { value: 1, icon: "home", label: "Stacjonarnie" },
    { value: 2, icon: "shuffle-variant", label: "Mieszanie" }
];

// form id where it's necessary to use remotely form data (platform and nick) 
export const remotelyForm=[0,2];

// form id where it's necessary to use stationary form data (address) 
export const stationaryForm=[1,2];