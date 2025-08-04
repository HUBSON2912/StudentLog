import { SafeAreaView, Text, StyleSheet, View, Image } from 'react-native';
import { theme } from './theme';
import { PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { account, clipboard, cog } from './functions/getUnicodeItems';
import LessonsScreen from './screens/lessons';
import StudentsScreen from './screens/students';
import SettingsScreen from './screens/settings';
import { getTotalEarning } from './functions/dbLessons';

const Tabs = createBottomTabNavigator();

export default function App() {

    return (
        <PaperProvider>
            <NavigationContainer>
                <SafeAreaView style={styles.container}>
                    <View>
                        <Text style={styles.title}>
                            StudentLog
                        </Text>
                    </View>
                    <View style={{ marginVertical: 15 }}>
                        <Text style={[styles.text, { fontWeight: "500" }]}>
                            Zarobki: {getTotalEarning()} zł
                        </Text>
                    </View>

                    <Tabs.Navigator initialRouteName='Lekcje' screenOptions={{animation: 'shift', headerShown: false}}>
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
        backgroundColor: theme.light.background,
        paddingHorizontal: 15,
        paddingTop: 20
    },

    main: {
        flex: 1
    },
    text: {
        fontSize: 18,
        color: theme.light.text.black,
    },
    title: {
        fontSize: 36,
        color: theme.light.text.black,
        fontWeight: "bold"
    },
});


/*
npm i react-native-date-picker
npm i react-native-paper
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack
npm install --save react-native-sqlite-storage
npm install @react-navigation/bottom-tabs
npm install react-native-svg




npm i @react-native-vector-icons/ionicons
npm install @react-native-material/core   
npm install @react-native-vector-icons/material-design-icons
*/