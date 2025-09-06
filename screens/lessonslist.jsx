import { FlatList, StyleSheet, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { Lesson } from "../components/lesson";
import { theme } from "../theme";
import { deleteStudentsLessons, getAllLessons, getTotalEarning } from "../functions/dbLessons";
import { Text } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getCurrency, getLanguage, getShowIncomes } from "../functions/settingsStorage";
import { getCurrencySymbol } from "../functions/currency";
import { DatabaseContext } from "../App";

export default function LessonsList({ navigation }) {

    const database=useContext(DatabaseContext);

    const [dictionary, setDictionary] = useState({});

    const [showMoney, setShowMoney] = useState(false);
    const [earnings, setEarnings] = useState(0);
    const [message, setMessage] = useState("...");
    const [lessons, setLessons] = useState([]);
    const [currency, setCurr] = useState({});

    useFocusEffect(() => {
        const fetchLessons = async () => {
            const file = (await getLanguage()).file;
            setDictionary(file);

            setLessons(database.lessons);
            if (lessons.length == 0 ) {
                setMessage(dictionary.no_data);
            } else {
                setMessage("");
            }
            
            const ear=await database.totalEarnings();
            setEarnings(ear);
            setCurr(await getCurrency());
            setShowMoney(await getShowIncomes());
        }
        fetchLessons();
    });

    return (
        <View style={{ backgroundColor: theme.background, flex: 1 }}>
            <View style={{ marginVertical: 15, display: showMoney ? "flex" : "none" }}>
                <Text style={[styles.text, { fontWeight: "500" }]}>
                    {dictionary.incomes}: {earnings} {getCurrencySymbol(currency["_code"])}
                </Text>
            </View>
            {
                lessons.length != 0 &&
                <FlatList
                    data={lessons}
                    renderItem={({ item }) => { return (<Lesson item={item} />) }}
                />
            }
            <Text style={[
                styles.description,
                {
                    marginTop: 50,
                    fontSize: 22,
                    textAlign: "center",
                    display: (message ? "flex" : "none")
                }]}>
                {message}
            </Text>
            <PlusComponent onPress={() => navigation.navigate("EditLesson", { lessonID: null })} />
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        color: theme.text.default,
    },
    description: {
        color: theme.text.gray,
        fontSize: 16
    }
});