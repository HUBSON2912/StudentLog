import { SafeAreaView, Text, StyleSheet, View, Image } from 'react-native';
import { theme } from './colors';
import { PaperProvider } from 'react-native-paper';
import LessonsScreen from './screens/lessons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

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
                            Zarobki: 1234 zł
                        </Text>
                    </View>

                    <View style={{ width: 50, height: 50 }}>
                        <Image src={require("./calendar.png")} height={40} width={40}/>
                    </View>

                    <Tabs.Navigator>
                        <Tabs.Screen name="Lekcje" component={LessonsScreen} options={{
                            animation: 'fade', headerShown: false, tabBarIcon: ({ focused, color, size }) => {
                                return;
                            }
                        }} />
                        <Tabs.Screen name="Other" component={() => { return <View></View> }} options={{ animation: 'fade', headerShown: false }} />
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