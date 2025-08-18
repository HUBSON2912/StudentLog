import { FlatList, StyleSheet, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { theme } from "../theme";
import { Student } from "../components/student";
import { getAllStudents } from "../functions/dbStudents";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function StudentsListScreen({ navigation }) {
    
    
    const [message, setMessage] = useState("Wczytywanie...");
    

    const [students, setStudents] = useState([]);
    useFocusEffect(() => {
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
        <View style={{ backgroundColor: theme.background, flex: 1 }}>
            <View style={{ marginVertical: 15 }}>
                <Text style={[styles.text, { fontWeight: "500" }]}>
                    Ilość uczniów: {students.length}
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