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
            email: "aaa@bbbb.ccc",
            form: 0,
            platform: "Discord",
            nick: "Chair",
            city: "",
            street: "",
            house_nr: "",
            flat_nr: null
        },
        {
            name: "Jan",
            surname: "Nowak",
            phone: "123456798",
            email: "aaa@bbbb.ccc",
            form: 2,
            platform: "Discord",
            nick: "Chair",
            city: "Kraków",
            street: "Polna",
            house_nr: "123b",
            flat_nr: null
        },
        {
            name: "Jan",
            surname: "Nowak",
            phone: "123456798",
            email: "aaa@bbbb.ccc",
            form: 0,
            platform: "Discord",
            nick: "Chair",
            city: "",
            street: "",
            house_nr: "",
            flat_nr: null
        },
        {
            name: "Jan",
            surname: "Nowak",
            phone: "123456798",
            email: "aaa@bbbb.ccc",
            form: 1,
            platform: "",
            nick: "",
            city: "Warszawa",
            street: "Piotra Michałowskiego",
            house_nr: 3,
            flat_nr: 5
        },
        {
            name: "Jan",
            surname: "Nowak",
            phone: "123456798",
            email: "aaa@bbbb.ccc",
            form: 0,
            platform: "Discord",
            nick: "Chair",
            city: "",
            street: "",
            house_nr: "",
            flat_nr: null
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