import { FlatList, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { theme } from "../theme";
import { Student } from "../components/student";
import { getAllStudents } from "../functions/dbStudents";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";

export default function StudentsListScreen({ navigation }) {
    const [message, setMessage] = useState("Wczytywanie...");

    const [students, setStudents] = useState([]);
    useEffect(() => {
        const fetchStudents = async () => {
            setStudents(await getAllStudents());
            if (students.length == 0) {
                setMessage("Brak danych do wyświetlenia");
            }
            else {
                setMessage("");
            }
        }
        fetchStudents();
    });

    return (
        <View style={{ backgroundColor: theme.light.background, flex: 1 }}>

                <Text style={[
                    theme.styles.description,
                    {
                        marginTop: 50,
                        fontSize: 22,
                        textAlign: "center",
                        display: (message?"flex":"none")
                    }]}>
                    {message}
                </Text>

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