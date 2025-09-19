import { Alert, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../theme";
import Section from "./section";
import { useContext, useEffect, useState } from "react";
import { getCurrency } from "../functions/settingsStorage";
import { getCurrencySymbol } from "../functions/currency";
import { useNavigation } from "@react-navigation/native";
import { DatabaseContext } from "../App";

export default function PriceLiseElement({ item }) {
    const navigation = useNavigation();
    const database=useContext(DatabaseContext);
    const [curr, setCurr] = useState({});
    useEffect(() => {
        const fetchCurr = async () => {
            setCurr(await getCurrency());
        }
        fetchCurr();
    });

    const handleEditing = () => navigation.navigate("PriceListEdit", { priceListElement: item });

    const handleDelete = () => {
        Alert.alert(
            "Potwierdzenie",
            `Czy na pewno chcesz usunąć ten rekord?\n\tID: ${item.id}\n\tPrzedmiot: ${item.subject}\n\tPoziom: ${item.level}`,
            [
                { text: "Tak", onPress: () => { database.delete.priceList(item.id) } },  // verify
                { text: "Nie", onPress: () => { } }
            ],
            { cancelable: true }
        );
    }

    const showAlert = () => {
        Alert.alert(
            "Co chcesz zrobić?",
            `Co zamierzasz zrobić z elementem\n\tID: ${item.id}\n\tPrzedmiot: ${item.subject}\n\tPoziom: ${item.level}`,
            [
                { text: "Anuluj", onPress: () => { }, style: "cancel" },
                { text: "Edytuj", onPress: handleEditing },
                { text: "Usuń", onPress: handleDelete },
            ],
            { cancelable: true }
        );
    }

    return (
        <Section style={{ flexDirection: "row" }} onLongPress={showAlert}>
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