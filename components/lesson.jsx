import { Alert, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../theme";
import { StatusLabel } from "./statuslabel";
import { bullet } from "../functions/getUnicodeItems";
import Section from "./section";
import { getDD_Mon_YYYY_HH_MMDate } from "../functions/date";
import { useNavigation } from "@react-navigation/native";
import { deleteIDLessons } from "../functions/dbLessons";

export function Lesson({ item }) {
    /** TODO 
     * verify if displaing the status works propertly, not sure about it
     * display a note that there is no topic given in the lesson
     */

    const navigation = useNavigation();

    const handleEditing = () => {
        navigation.navigate("EditLesson", { lessonID: item.id });
    }

    const handleDelete = () => {
        Alert.alert("Potwierdzenie",
            `Czy na pewno chcesz usunąć tego ucznia?\n\nID: ${item.id} \nImię: ${item.name} \nNazwisko: ${item.surname}`,
            [
                { text: "Tak", onPress: () => { deleteIDLessons(item.id) } },
                { text: "Nie", onPress: () => { } }
            ],
            { cancelable: true }
        )
    };

    const showAlert = () => {
        Alert.alert("Co zamierzasz zrobić", `Wybierz co zamierzasz zrobić z tym rekordem. \n\nID: ${item.id} \nImię: ${item.name} \nNazwisko: ${item.surname}`,
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
    let date = new Date(yyyy, mm-1, dd, hh, min);
    // date = new Date(date.getTime() - date.getTimezoneOffset() * 1000 * 60);

    return (
        <Section
            onPressBehaviour="scale"
            onLongPress={showAlert}
        >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={theme.styles.h2}>{item.name} {item.surname}</Text>
                <Text style={theme.styles.h2}>{item.price} zł</Text>
            </View>
            <Text style={theme.styles.description}>{item.subject} {bullet()} {item.level}</Text>
            <Text style={[theme.styles.description, { marginTop: -6 }]}>{item.topic}</Text>
            <Text style={theme.styles.description}>{getDD_Mon_YYYY_HH_MMDate(date)}</Text>
            {StatusLabel(item.status)}
        </Section>
    );
}