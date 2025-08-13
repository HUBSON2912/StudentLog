import { StyleSheet } from "react-native"



export const theme = {
    light: {
        background: "#fbfbfb",
        border: "#84919f",
        error: "#e23e3e",
        iconActive: "#2e71f3",
        iconDisabled: "#2b3b49",
        primary: "#2f70f3",
        primaryPale: "#e0ebff",
        primaryHalf: "#6e9cf7",
        secondary: "#4b8f62",
        status: {
            done:"#ffc400",
            paid: "#4b8f62",
            planned: "#f2f0f3",
        },
        text: {
            black: "#2a3846",
            error: "#f56f6f",
            gray: "#4c5660",
            white: "#ffffff"
        },
    },
    styles: StyleSheet.create({
        description: {
            color: "#4c5660",
            fontSize: 16
        },
        h2: {
            fontSize: 20,
            color: "#2a3846",
            textAlignVertical: "center"
        },
        text: {
            fontSize: 16,
            color: "#2a3846",
            textAlignVertical: "center",
        },
        section: {
            flex: 1,
            backgroundColor: "#ffffff",
            marginVertical: 5,
            borderRadius: 10,
            padding: 15,
            gap: 3
        },
    }),
};