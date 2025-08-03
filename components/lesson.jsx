import { View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../theme";
import { StatusLabel } from "./statuslabel";
import { bullet } from "../functions/getUnicodeItems";
import Section from "./section";
import { getDD_MM_YYYY_HH_MMDate, ISOToDate } from "../functions/date";

export function Lesson({ item }) {

    const [yyyy, mm, dd] = item.date.split("T")[0].split("-");
    const [hh, min, ss] = item.date.split("T")[1].split(":");
    // console.log(item.date);
    let date=new Date(yyyy,mm,dd,hh,min);
    // console.log(date.toISOString());
    date=new Date(date.getTime()-date.getTimezoneOffset()*1000*60);
    // console.log(date.toISOString());

    return (
        <Section onPressBehaviour="scale">
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={theme.styles.h2}>{item.name} {item.surname}</Text>
                <Text style={theme.styles.h2}>{item.price} zł</Text>
            </View>
            <Text style={theme.styles.description}>{item.subject} {bullet()} {item.level}</Text>
            <Text style={[theme.styles.description, { marginTop: -6 }]}>{item.topic}</Text>
            <Text style={theme.styles.description}>{getDD_MM_YYYY_HH_MMDate(date)}</Text>
            {StatusLabel(item.status)}
        </Section>
    );
}