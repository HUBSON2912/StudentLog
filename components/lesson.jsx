import { Alert, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../theme";
import { StatusLabel } from "./statuslabel";
import { bullet } from "../functions/getUnicodeItems";
import Section from "./section";
import { getDD_Mon_YYYY_HH_MMDate } from "../functions/date";
import { useNavigation } from "@react-navigation/native";
import { deleteIDLessons } from "../functions/dbLessons";
import { useEffect, useState } from "react";
import { getCurrency } from "../functions/settingsStorage";
import { getCurrencySymbol } from "../functions/currency";

export function Lesson({ item }) {

    const navigation = useNavigation();

    const [curr, setCurr] = useState({});
    useEffect(() => {
        const fetchCurr = async () => {
            setCurr(await getCurrency());
        }
        fetchCurr();
    });


    const handleEditing = () => {
        navigation.navigate("EditLesson", { lessonID: item.id });
    }

    const handleDelete = () => {
        Alert.alert("Potwierdzenie",
            `Czy na pewno chcesz usunąć tę lekcję?\n\n
            ID: ${item.id} \n
            Uczeń: ${item.name} ${item.surname}\n
            Przedmiot: ${item.subject} ${item.level}\n
            Data: ${item.year}-${String(item.month).padStart(2, "0")}-${String(item.day).padStart(2, "0")} ${item.hour}:${String(item.minute).padStart(2, '0')}`,
            [
                { text: "Tak", onPress: () => { deleteIDLessons(item.id) } },
                { text: "Nie", onPress: () => { } }
            ],
            { cancelable: true }
        )
    };

    const showAlert = () => {
        Alert.alert("Co zamierzasz zrobić", `Wybierz co zamierzasz zrobić z tym rekordem. \n\n
            ID: ${item.id} \n
            Uczeń: ${item.name} ${item.surname}\n
            Przedmiot: ${item.subject} ${item.level}\n
            Data: ${item.year}-${String(item.month).padStart(2, "0")}-${String(item.day).padStart(2, "0")} ${String(item.hour).padStart(2, "0")}:${String(item.minute).padStart(2, "0")}`,
            [
                { text: "Anuluj", onPress: () => { }, style: "cancel" },
                { text: "Edytuj", onPress: handleEditing },
                { text: "Usuń", onPress: handleDelete },
            ],
            { cancelable: true }
        )
    }


    const [yyyy, mm, dd] = [item.year, item.month, item.day];
    const [hh, min] = [item.hour, item.minute];
    let date = new Date(yyyy, mm - 1, dd, hh, min);
    // date = new Date(date.getTime() - date.getTimezoneOffset() * 1000 * 60);

    return (
        <Section
            onPressBehaviour="scale"
            onLongPress={showAlert}
        >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.h2}>{item.name} {item.surname}</Text>
                <Text style={styles.h2}>{item.price} {getCurrencySymbol(curr["_code"])}</Text>
            </View>
            <Text style={styles.description}>{item.subject} {bullet()} {item.level}</Text>
            {item.topic && <Text style={[styles.description, { marginTop: -6 }]}>{item.topic}</Text>}
            {!item.topic && <Text style={[styles.description, { marginTop: -6, fontWeight: "bold", color: theme.text.error }]}>UZUPEŁNIJ TEMAT</Text>}
            <Text style={styles.description}>{getDD_Mon_YYYY_HH_MMDate(date)}</Text>
            {StatusLabel(item.status)}
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
    }
});