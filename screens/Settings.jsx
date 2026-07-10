import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackHeader } from '../components/stackHeader';
import ConfigurationScreen from './settings/ConfigurationScreen';
import PriceListScreen from './settings/PriceList';


const Stack = createNativeStackNavigator();

export default function SettingsScreen() {
    
    return (
        <Stack.Navigator screenOptions={{
            header: ({ navigation, route, options, back })=><StackHeader back={back} options={options} route={route} navigation={navigation}/>
        }}>
            <Stack.Screen name="Configuration" component={ConfigurationScreen} options={{headerShown: false}}/>
            <Stack.Screen name="PriceList" component={PriceListScreen} options={{title: "Cennik"}}/>
        </Stack.Navigator>
    );
}