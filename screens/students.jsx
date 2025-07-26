import { FlatList, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { theme } from "../theme";
import { Student } from "../components/student";

export default function StudentsScreen() {

    const students = [
        {
            name: "Jan",
            surname: "Nowak",
            phone: "123456798",
            form: 0,
            place: "Discord",
            email: "aaa@bbbb.ccc",
            nick: "Chair"
        },
        {
            name: "Jan",
            surname: "Nowak",
            phone: "123456798",
            form: 1,
            place: "Pierławki 3",
            email: "aaa@bbbb.ccc",
            nick: "Chair"
        },
        {
            name: "Jan",
            surname: "Nowak",
            phone: "",
            form: 0,
            place: "Discord",
            email: "aaa@bbbb.ccc",
            nick: "Chair"
        },
        {
            name: "Jan",
            surname: "Nowak",
            phone: "123456798",
            form: 0,
            place: "Discord",
            email: "",
            nick: "Chair"
        },
        {
            name: "Jan",
            surname: "Nowak",
            phone: "123456798",
            form: 0,
            place: "Discord",
            email: "",
            nick: "Chair"
        },
    ]

    return (
        <View style={{backgroundColor: theme.light.background}}>
            <FlatList
                data={students}
                renderItem={({ item }) => { return (<Student item={item} />) }}
            />
            <PlusComponent />
        </View>
    );
}