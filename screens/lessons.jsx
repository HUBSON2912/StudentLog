import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LessonsList from "./lessonslist";
import EditLesson from "./editLesson";

const Stack=createNativeStackNavigator();

export default function LessonsScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="LessonsList" component={LessonsList} options={{headerShown: false}}/>
            <Stack.Screen name="EditLesson" component={EditLesson} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}