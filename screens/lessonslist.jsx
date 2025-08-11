import { FlatList, StyleSheet, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { Lesson } from "../components/lesson";
import { theme } from "../theme";
import { deleteStudentsLessons, getAllLessons, getTotalEarning } from "../functions/dbLessons";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function LessonsList({ navigation }) {
    const [earnings, setEarnings] = useState(0);
    const [message, setMessage] = useState("Brak danych do wyświetlenia");
    const [lessons, setLessons] = useState([]);
    useFocusEffect(() => {
        const fetchLessons = async () => {
            setLessons(await getAllLessons());
            if (lessons.length != 0) {
                setMessage("");
            }
            else {
                setMessage("Brak danych do wyświetlenia");
            }
            setEarnings(await getTotalEarning());
        }
        fetchLessons();
    });

    return (
        <View style={{ backgroundColor: theme.light.background, flex: 1 }}>
            <View style={{ marginVertical: 15 }}>
                <Text style={[styles.text, { fontWeight: "500" }]}>
                    Zarobki: {earnings} zł
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
                theme.styles.description,
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
        color: theme.light.text.black,
    }
});