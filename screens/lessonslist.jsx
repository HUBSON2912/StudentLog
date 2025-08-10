import { FlatList, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { Lesson } from "../components/lesson";
import { theme } from "../theme";
import { getAllLessons } from "../functions/dbLessons";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";

export default function LessonsList({ navigation }) {
    
    const [message, setMessage] = useState("Wczytywanie...");
    const [lessons, setLessons] = useState([]);
    useEffect(() => {
        const fetchLessons = async () => {
            setLessons(await getAllLessons());
            if (lessons.length == 0) {
                setMessage("Brak danych do wyświetlenia");
            }
            else {
                setMessage("");
            }
        }
        fetchLessons();
    });

    return (
        <View style={{ backgroundColor: theme.light.background, flex: 1 }}>
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