import { FlatList, TouchableOpacity, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { theme } from "../theme";
import { Student } from "../components/student";
import { getAllStudents } from "../functions/database";

export default function StudentsListScreen({ navigation }) {

    const students = getAllStudents();
    return (
        <View style={{ backgroundColor: theme.light.background, flex: 1 }}>
            <FlatList
                data={students}
                renderItem={({ item }) => { return (<Student item={item} />) }}
            />

            <PlusComponent onPress={
                () => {
                    navigation.navigate("EditStudent", { studentID: null });
                }} />
        </View>
    );


}