import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudentsListScreen from "./studentslist";
import EditStudent from "./editStudent";

const Stack=createNativeStackNavigator();

export default function StudentsScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="StudentsList" component={StudentsListScreen} options={{headerShown: false}}/>
            <Stack.Screen name="EditStudent" component={EditStudent} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}