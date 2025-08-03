import { FlatList, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { Lesson } from "../components/lesson";
import { theme } from "../theme";
import { deleteIDLessons, getAllLessons } from "../functions/dbLessons";

export default function LessonsList({navigation}) {
    const lessons = getAllLessons();

    return (
        <View style={{ backgroundColor: theme.light.background, flex: 1 }}>
            <FlatList
                data={lessons}
                renderItem={({ item }) => { return (<Lesson item={item} />) }}
            />
            <PlusComponent onPress={()=>navigation.navigate("EditLesson", {lessonID: null})}/>
        </View>
    );
}