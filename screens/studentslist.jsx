import { FlatList, TouchableOpacity, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { theme } from "../theme";
import { Student } from "../components/student";
import { dropDBStudent, getAllStudents } from "../functions/dbStudents";
import { Text } from "react-native-paper";

export default function StudentsListScreen({ navigation }) {
    const students = getAllStudents();
    return (
        <View style={{ backgroundColor: theme.light.background, flex: 1 }}>

            {
                students.length == 0 &&
                <Text style={[
                    theme.styles.description,
                    {
                        marginTop: 50,
                        fontSize: 22,
                        textAlign: "center"
                    }]}>
                    Brak wpisów na temat uczniów.
                </Text>
            }

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