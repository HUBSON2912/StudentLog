import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const themeLight = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        "primary": "#2962FF",
        "onPrimary": "#FFFFFF",
        "primaryContainer": "#99B6FF",
        "onPrimaryContainer": "#2C3437",

        "secondary": "#4A6572",
        "onSecondary": "#FFFFFF",
        "secondaryContainer": "#D7E3EA",
        "onSecondaryContainer": "#081F27",

        "tertiary": "#6A5ACD",
        "onTertiary": "#FFFFFF",
        "tertiaryContainer": "#E3DFFF",
        "onTertiaryContainer": "#1C1165",

        "background": "#F7F9FC",
        "onBackground": "#1A1C1E",

        "surface": "#FFFFFF",
        "onSurface": "#1C1E21",
        "surfaceVariant": "#E0E3EC",
        "onSurfaceVariant": "#42474E",

        "outline": "#73777F",
        "outlineVariant": "#C6C7CE",

        "error": "#D32F2F",
        "onError": "#FFFFFF",
        "errorContainer": "#F9DEDC",
        "onErrorContainer": "#410E0B",

        "status": [
            {
                "background": "#D5D9E0",
                "onBackground": "#1C1F23"
            },
            {
                "background": "#F2C94C",
                "onBackground": "#1A1600"
            },
            {
                "background": "#4CAF50",
                "onBackground": "#FFFFFF"
            }
        ]
    }
}

export const themeDark = {
    ...MD3DarkTheme,
    "colors": {
        ...MD3DarkTheme.colors,
        "primary": "#9DB3FF",
        "onPrimary": "#002A78",
        "primaryContainer": "#0050e6",
        "onPrimaryContainer": "#D6E2FF",

        "secondary": "#B5C7D0",
        "onSecondary": "#1F333B",
        "secondaryContainer": "#354A54",
        "onSecondaryContainer": "#D7E3EA",

        "tertiary": "#C8C1FF",
        "onTertiary": "#2A1F7A",
        "tertiaryContainer": "#4435A4",
        "onTertiaryContainer": "#E3DFFF",

        "background": "#111317",
        "onBackground": "#E2E2E5",

        "surface": "#1A1C1E",
        "onSurface": "#E3E3E6",
        "surfaceVariant": "#41464F",
        "onSurfaceVariant": "#C6C7CE",

        "outline": "#91959D",
        "outlineVariant": "#41464F",

        "error": "#F2B8B5",
        "onError": "#601410",
        "errorContainer": "#8C1D18",
        "onErrorContainer": "#F9DEDC",

        "status": [
            {
                "background": "#50545C",
                "onBackground": "#ECEDEF"
            },
            {
                "background": "#C9A73E",
                "onBackground": "#1A1500"
            },
            {
                "background": "#3F8A41",
                "onBackground": "#DDFCE1"
            }
        ]
    }
}