import { SafeAreaView, Text, StyleSheet, View, Image } from 'react-native';
import { theme } from './theme';
import { PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { account, clipboard, cog } from './functions/getUnicodeItems';
import LessonsScreen from './screens/lessons';
import StudentsScreen from './screens/students';
import SettingsScreen from './screens/settings';
import { dropDBLessons, getTotalEarning } from './functions/dbLessons';
import { useEffect, useState } from 'react';

const Tabs = createBottomTabNavigator();

export default function App() {

    const [earnings, setEarnings] = useState(0);
    const countEarnings = async () => {
        setEarnings(await getTotalEarning());
    }
    countEarnings();

    return (
        <PaperProvider>
            <NavigationContainer>
                <SafeAreaView style={styles.container}>
                    <View>
                        <Text style={styles.title}>
                            StudentLog
                        </Text>
                    </View>


                    <Tabs.Navigator initialRouteName='Lekcje' screenOptions={{ animation: 'shift', headerShown: false }}>
                        <Tabs.Screen name="Uczniowie" component={StudentsScreen} options={{
                            tabBarIcon: ({ focused, color, size }) => {
                                return <Text style={{ fontSize: 22 }}>{account()}</Text>;
                            }
                        }} />
                        <Tabs.Screen name="Lekcje" component={LessonsScreen} options={{
                            tabBarIcon: ({ focused, color, size }) => {
                                return <Text style={{ fontSize: 22 }}>{clipboard()}</Text>;
                            }
                        }} />
                        <Tabs.Screen name="Ustawienia" component={SettingsScreen} options={{
                            tabBarIcon: ({ focused, color, size }) => {
                                return <Text style={{ fontSize: 22 }}>{cog()}</Text>;
                            }
                        }} />
                    </Tabs.Navigator>

                </SafeAreaView>
            </NavigationContainer>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 15,
        paddingTop: 20
    },

    main: {
        flex: 1
    },
    text: {
        fontSize: 18,
        color: theme.text.black,
    },
    title: {
        fontSize: 36,
        color: theme.text.black,
        fontWeight: "bold"
    },
});