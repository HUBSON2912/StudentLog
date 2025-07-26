import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../colors";
import { StatusLabel } from "./statuslabel";
import { bullet } from "../functions/getUnicodeItems";

export function Lesson({ item }) {

    return (
        <View style={styles.section}>
            <Text style={styles.text}>{item.student_name} {item.student_surname}</Text>
            <Text style={styles.description}>{item.subject} {bullet()} {item.level}</Text>
            <Text style={[styles.description, { marginTop: -6 }]}>{item.topic}</Text>
            <Text style={styles.description}>{item.date} {item.time}</Text>
            {StatusLabel(item.status)}
        </View>
    );
}

const styles=StyleSheet.create({
    description: {
        color: theme.light.text.gray,
        fontSize: 16
    },
    text: {
        fontSize: 20,
        color: theme.light.text.black,
    },
    section: {
        flex: 1,
        backgroundColor: theme.light.section,
        marginVertical: 5,
        borderRadius: 10,
        padding: 15,
        gap: 3
    },
});