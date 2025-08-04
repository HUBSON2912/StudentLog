import { Alert, FlatList, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { Lesson } from "../components/lesson";
import { theme } from "../theme";
import { deleteIDLessons, getAllLessons } from "../functions/dbLessons";
import { Text } from "react-native-paper";

export default function LessonsList({ navigation }) {
    const lessons = getAllLessons();

    return (
        <View style={{ backgroundColor: theme.light.background, flex: 1 }}>
            {
                lessons.length != 0 &&
                <FlatList
                    data={lessons}
                    renderItem={({ item }) => { return (<Lesson item={item} />) }}
                />
            }
            {
                lessons.length == 0 &&
                <Text style={[
                    theme.styles.description,
                    {
                        marginTop: 50,
                        fontSize: 22,
                        textAlign: "center"
                    }]}>
                    Brak wpisów na temat lekcji.
                </Text>
            }
            <PlusComponent onPress={() => navigation.navigate("EditLesson", { lessonID: null })} />
        </View>
    );
}