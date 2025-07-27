import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsMainScreen from './settings_main_screen';
import PriceList from './pricelist';

const Stack = createNativeStackNavigator();

export default function SettingsScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SettingsMain" component={SettingsMainScreen} options={{headerShown: false}} />
            <Stack.Screen name="PriceList" component={PriceList} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}