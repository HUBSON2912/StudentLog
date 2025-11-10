import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentsListScreen from './students/StudentsList';
import EditStudentScreen from './students/EditStudent';
import { StackHeader } from '../components/stackHeader';

const Stack = createNativeStackNavigator();

export default function StudetnsScreen() {
    
    return (
        <Stack.Navigator screenOptions={{
            header: ({ navigation, route, options, back })=><StackHeader back={back} options={options} route={route} navigation={navigation}/>
        }}>
            <Stack.Screen name="StudentList" component={StudentsListScreen} options={{headerShown: false}}/>
            <Stack.Screen name="EditStudent" component={EditStudentScreen} options={{title: "Dodaj ucznia"}}/>
        </Stack.Navigator>
    );
}