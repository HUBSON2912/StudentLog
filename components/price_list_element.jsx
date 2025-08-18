import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../theme";
import Section from "./section";
import { useEffect, useState } from "react";
import { getCurrency } from "../functions/settingsStorage";
import { getCurrencySymbol } from "../functions/currency";

export default function PriceLiseElement({ item }) {
    const [curr, setCurr] = useState({});
    useEffect(() => {
        const fetchCurr = async () => {
            setCurr(await getCurrency());
        }
        fetchCurr();
    });

    return (
        <Section style={{ flexDirection: "row" }}>
            <View style={{ flex: 3 }}>
                <Text style={styles.h2}>{item.subject}</Text>
                <Text style={styles.description}>{item.level}</Text>
            </View>
            <Text style={styles.priceNumber}>{item.price} {getCurrencySymbol(curr["_code"])}</Text>
        </Section>
    );
}

const styles = StyleSheet.create({
    h2: {
        fontSize: 20,
        color: theme.text.default,
        textAlignVertical: "center"
    },
    description: {
        color: theme.text.gray,
        fontSize: 16
    },
    priceNumber: {
        fontSize: 20,
        color: theme.text.default,
        textAlignVertical: "center",
        flex: 1,
        textAlign: "center",
        textAlignVertical: "center"
    }
});