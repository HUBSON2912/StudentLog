import { FlatList, View } from "react-native";
import { PlusComponent } from "../components/pluscomponent";
import { Lesson } from "../components/lesson";
import { theme } from "../theme";

export default function LessonsScreen() {

    const lessons = [
        {
            id: 0,
            student_name: "Jan",
            student_surname: "Nowak",
            subject: "Matematyka",
            level: "Szkoła podstawowa",
            topic: "Pierwsza zasada termodynamiki",
            date: "14.02.2025",
            time: "13:45",
            price: 60,
            time_during: 1, // hour
            status: 0
        },
        {
            id: 1,
            student_name: "Jan",
            student_surname: "Nowak",
            subject: "Matematyka",
            level: "Szkoła podstawowa",
            topic: "Interferencja fal elektromagnetycznych",
            date: "14.02.2025",
            time: "13:45",
            price: 60,
            time_during: 1, // hour
            status: 2
        },
        {
            id: 2,
            student_name: "Jan",
            student_surname: "Nowak",
            subject: "Matematyka",
            level: "Szkoła podstawowa",
            topic: "Dodawanie ułamków zwykłych",
            date: "14.02.2025",
            time: "13:45",
            price: 60,
            time_during: 1, // hour
            status: 1
        },
        {
            id: 3,
            student_name: "Jan",
            student_surname: "Nowak",
            subject: "Matematyka",
            level: "Szkoła podstawowa",
            topic: "Dodawanie ułamków zwykłych",
            date: "14.02.2025",
            time: "13:45",
            price: 60,
            time_during: 1, // hour
            status: 2
        },
        {
            id: 4,
            student_name: "Jan",
            student_surname: "Nowak",
            subject: "Matematyka",
            level: "Szkoła podstawowa",
            topic: "Pierwsza zasada termodynamiki",
            date: "14.02.2025",
            time: "13:45",
            price: 60,
            time_during: 1, // hour
            status: 0
        },
        {
            id: 5,
            student_name: "Jan",
            student_surname: "Nowak",
            subject: "Matematyka",
            level: "Szkoła podstawowa",
            topic: "Interferencja fal elektromagnetycznych",
            date: "14.02.2025",
            time: "13:45",
            price: 60,
            time_during: 1, // hour
            status: 2
        },
        {
            id: 6,
            student_name: "Jan",
            student_surname: "Nowak",
            subject: "Matematyka",
            level: "Szkoła podstawowa",
            topic: "Dodawanie ułamków zwykłych",
            date: "14.02.2025",
            time: "13:45",
            price: 60,
            time_during: 1, // hour
            status: 1
        },
        {
            id: 7,
            student_name: "Jan",
            student_surname: "Nowak",
            subject: "Matematyka",
            level: "Szkoła podstawowa",
            topic: "Dodawanie ułamków zwykłych",
            date: "14.02.2025",
            time: "13:45",
            price: 60,
            time_during: 1, // hour
            status: 2
        },  
    ]

    return (
        <View style={{backgroundColor: theme.light.background}}>
            <FlatList
                data={lessons}
                renderItem={({ item }) => { return (<Lesson item={item} />) }}
            />
            <PlusComponent />
        </View>
    );
}