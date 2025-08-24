import { FlatList, StyleSheet, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { theme } from "../theme";
import { Student } from "../components/student";
import { getAllStudents } from "../functions/dbStudents";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getLanguage, getShowAmountOfStudents } from "../functions/settingsStorage";

export default function StudentsListScreen({ navigation }) {

    const [dictionary, setDictionary]=useState({});

    const [message, setMessage] = useState("...");

    const [showHowManyStudents, setHowManyStudents] = useState(true);
    const [students, setStudents] = useState([]);
    useFocusEffect(() => {
        const fetchStudents = async () => {
            setDictionary((await getLanguage()).file);

            setStudents(await getAllStudents());
            if (students.length == 0) {
                setMessage(dictionary.no_data);
            }
            else {
                setMessage("");
            }

            setHowManyStudents(await getShowAmountOfStudents());
        }
        fetchStudents();
    });

    return (
        <View style={{ backgroundColor: theme.background, flex: 1 }}>
            <View style={{ marginVertical: 15, display: showHowManyStudents?"flex":"none"}}>
                <Text style={[styles.text, { fontWeight: "500" }]}>
                    {dictionary.amount_of_students}: {students.length}
                </Text>
            </View>

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

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        color: theme.text.default,
    },
});