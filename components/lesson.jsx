import { Alert, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../theme";
import { StatusLabel } from "./statuslabel";
import { bullet } from "../functions/getUnicodeItems";
import Section from "./section";
import { getDD_Mon_YYYY_HH_MMDate } from "../functions/date";
import { useNavigation } from "@react-navigation/native";
import { deleteIDLessons } from "../functions/dbLessons";
import { useContext, useEffect, useState } from "react";
import { getCurrency, getLanguage } from "../functions/settingsStorage";
import { getCurrencySymbol } from "../functions/currency";
import { DatabaseContext } from "../App";

export function Lesson({ item }) {

    const database=useContext(DatabaseContext);
    
    const [dictionary, setDictionary]=useState({});

    const navigation = useNavigation();

    const [curr, setCurr] = useState({});
    useEffect(() => {
        const fetchCurr = async () => {
            setCurr(await getCurrency());
            setDictionary((await getLanguage()).file);
        }
        fetchCurr();
    });


    const handleEditing = () => {
        navigation.navigate("EditLesson", { lessonID: item.id });
    }

    const handleDelete = () => {
        Alert.alert(dictionary.confirmation,
            `${dictionary.are_you_sure_that_you_want_to_delete}
    ID: ${item.id}
    ${dictionary.student}: ${item.name} ${item.surname}
    ${dictionary.subject}: ${item.subject} ${item.level}
    ${dictionary.date}: ${item.year}-${String(item.month).padStart(2, "0")}-${String(item.day).padStart(2, "0")} ${item.hour}:${String(item.minute).padStart(2, '0')}`,
            [
                { text: "Tak", onPress: () => { database.delete.lesson(item.id) } },  // verify
                { text: "Nie", onPress: () => { } }
            ],
            { cancelable: true }
        )
    };

    const showAlert = () => {
        Alert.alert(dictionary.what_do_you_want_to_do, `${dictionary.what_do_you_want_to_do_NOTE}
    ID: ${item.id}
    Uczeń: ${item.name} ${item.surname}
    Przedmiot: ${item.subject} ${item.level}
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