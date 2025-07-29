import { View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../theme";
import { StatusLabel } from "./statuslabel";
import { bullet } from "../functions/getUnicodeItems";
import Section from "./section";

export function Lesson({ item }) {

    return (
        <Section onPressBehaviour="scale">
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={theme.styles.h2}>{item.student_name} {item.student_surname}</Text>
                <Text style={theme.styles.h2}>{item.price} zł</Text>
            </View>
            <Text style={theme.styles.description}>{item.subject} {bullet()} {item.level}</Text>
            <Text style={[theme.styles.description, { marginTop: -6 }]}>{item.topic}</Text>
            <Text style={theme.styles.description}>{item.date} {item.time}</Text>
            {StatusLabel(item.status)}
        </Section>
    );
}