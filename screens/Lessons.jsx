import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackHeader } from '../components/stackHeader';
import LessonsListScreen from './lessons/LessonsList';
import EditLessonScreen from './lessons/EditLesson';
import FilterLessonsScreen from './lessons/FilterLessons';

const Stack = createNativeStackNavigator();

export default function LessonsScreen() {
    
    return (
        <Stack.Navigator screenOptions={{
            header: ({ navigation, route, options, back })=><StackHeader back={back} options={options} route={route} navigation={navigation}/>
        }}>
            <Stack.Screen name="LessonsList" component={LessonsListScreen} options={{headerShown: false}}/>
            <Stack.Screen name="EditLesson" component={EditLessonScreen} options={{title: "Dodaj zajęcia"}}/>
            <Stack.Screen name="FilterLessons" component={FilterLessonsScreen} options={{title: "Filtruj"}}/>
        </Stack.Navigator>
    );
}