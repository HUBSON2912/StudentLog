import { Platform, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from "react-native";
import { Icon, PaperProvider, } from "react-native-paper";
import { themeDark, themeLight } from "./theme";
import { createContext, useState, useEffect } from "react";
import { createTableS, deleteS, getAllS, insertS, updateS } from "./database/students";
import { NavigationContainer } from "@react-navigation/native";
import { createTableL, deleteL, deleteStudentsLessonL, getAllL, insertL, updateL } from "./database/lessons";
import StudetnsScreen from "./screens/Students";
import LessonsScreen from "./screens/Lessons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { POSSIBLE_TABLE_NAMES } from "./constants/const";
import SettingsScreen from "./screens/Settings";
import { correctSettingsKey, settingsGetAll, settingsSet } from "./database/settings";
import { createTablePL, deletePL, getAllPL, insertPL, updatePL } from "./database/pricelist";
import BackgroundFetch from "react-native-background-fetch";
import notifee, { AuthorizationStatus } from '@notifee/react-native';

export const DatabaseContext = createContext(null);
export const SettingsContext = createContext(null);

const Tab = createBottomTabNavigator();

export default function App() {

    // info delete it later
    // ---------------------
    useEffect(() => {
        async function displayNotification(taskId) {
            try {
                const settings = await notifee.getNotificationSettings();

                if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
                    console.log('Permission settings:', settings);
                } else {
                    console.log('User declined permissions');
                    BackgroundFetch.finish(taskId);
                    return;
                }

                console.log("displayNotification()");
                // Create a channel
                const channelId = await notifee.createChannel({
                    id: 'default',
                    name: 'Default Channel',
                });

                // Display a notification
                await notifee.displayNotification({
                    title: 'Notification Title',
                    body: 'Main body content of the notification',
                    android: {
                        channelId,
                        smallIcon: 'ic_launcher',
                        pressAction: {
                            id: 'default',
                        },
                    },
                });
            }
            catch (error) {
                console.log("Error in displayNotification", error);
            }
        }

        // displayNotification();

        BackgroundFetch.configure({
            minimumFetchInterval: 15,
            stopOnTerminate: false,
            startOnBoot: true,
            enableHeadless: true,
        },
            // async (taskId) => {
            //     console.log("HEADLESS START");
            //     // console.log(JSON.stringify(taskId));

            //     BackgroundFetch.finish(taskId);
            // },
            // (taskId)=>{
            //     console.log("Timeout");
            //     BackgroundFetch.finish(taskId);
            // }
            async (taskId) => {
                displayNotification();
                BackgroundFetch.finish(taskId);
            }, (taskId) => {
                BackgroundFetch.finish(taskId);
            }
        );
    }, []);
    // ---------------------


    const systemTheme = useColorScheme();
    const theme = systemTheme == "dark" ? themeDark : themeLight;

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
            flex: 1,
            // paddingHorizontal: 20,
            gap: 10,
            paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0
        }
    });


    // Database Context functions definition
    const [students, setStudents] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [pricelist, setPricelist] = useState([]);

    const createTable = async (name) => {
        try {
            if (!(POSSIBLE_TABLE_NAMES.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            switch (name) {
                case "students":
                    createTableS();
                    break;
                case "lessons":
                    createTableL();
                    break;
                case "pricelist":
                    createTablePL();
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(`Error while creating table '${name}': ${error.message}`);
            return error;
        }
    };

    const getAll = async (name) => {
        try {
            if (!(POSSIBLE_TABLE_NAMES.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }
            let buf = [];
            switch (name) {
                case "students":
                    buf = await getAllS();
                    setStudents(buf);
                    return buf;
                case "lessons":
                    buf = await getAllL();
                    setLessons(buf);
                    return buf;
                case "pricelist":
                    buf = await getAllPL();
                    setPricelist(buf);
                    return buf;
                default:
                    break;
            }
        } catch (error) {
            console.error(`Error while getting all from '${name}': ${error.message}`);
            return error;
        }
    };

    const insert = async (name, value) => {
        try {
            if (!(POSSIBLE_TABLE_NAMES.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }
            let id;
            switch (name) {
                case "students":
                    id = await insertS(value);
                    value.id = id;
                    setStudents(prev => [...prev, value]);
                    break;
                case "lessons":
                    id = await insertL(value);
                    value.id = id;
                    setLessons(prev => [...prev, value]);
                    break;
                case "pricelist":
                    id = await insertPL(value);
                    value.id = id;
                    setPricelist(prev => [...prev, value]);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(`Error while inserting ${JSON.stringify(value)} into table '${name}': ${error.message}`);
            return error;
        }
    };

    const remove = async (name, id) => {
        try {
            if (!(POSSIBLE_TABLE_NAMES.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            switch (name) {
                case "students":
                    deleteS(id);
                    deleteStudentsLessonL(id);
                    setStudents(prev => prev.filter(s => s.id != id));
                    setLessons(prev => prev.filter(l => l.student_id != id));
                    break;
                case "lessons":
                    deleteL(id);
                    setLessons(prev => prev.filter(l => l.id != id));
                    break;
                case "pricelist":
                    deletePL(id);
                    setPricelist(prev => prev.filter(pl => pl.id != id));
                default:
                    break;
            }
        } catch (error) {
            console.error(`Error while removing id: ${id} table '${name}': ${error.message}`);
            return error;
        }
    };

    const get = (name, id) => {
        try {
            if (!(POSSIBLE_TABLE_NAMES.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            switch (name) {
                case "students":
                    return students.filter(x => x.id == id)[0];
                case "lessons":
                    return lessons.filter(x => x.id == id)[0];
                case "pricelist":
                    return pricelist.filter(x => x.id == id)[0];
                default:
                    break;
            }
        } catch (error) {
            console.error(`Error while geting by ID: ${id} from table '${name}': ${error.message}`);
            return error;
        }
    }

    const update = (name, value, id) => {
        try {
            if (!(POSSIBLE_TABLE_NAMES.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            let buff;

            switch (name) {
                case "students":
                    updateS(value, id);
                    setStudents(prev => {
                        buff = [...prev];
                        for (let i = 0; i < buff.length; i++) {
                            if (buff[i].id == id) {
                                buff[i] = value;
                                buff[i].id = id;
                                break;
                            }
                        }
                        return buff;
                    });
                    break;
                case "lessons":
                    updateL(value, id);
                    setLessons(prev => {
                        buff = [...prev];
                        for (let i = 0; i < buff.length; i++) {
                            if (buff[i].id == id) {
                                buff[i] = value;
                                buff[i].id = id;
                                break;
                            }
                        }
                        return buff;
                    });
                    break;
                case "pricelist":
                    updatePL(value, id);
                    setPricelist(prev => {
                        buff = [...prev];
                        for (let i = 0; i < buff.length; i++) {
                            if (buff[i].id == id) {
                                buff[i] = value;
                                buff[i].id = id;
                                break;
                            }
                        }
                        return buff;
                    });
                default:
                    break;
            }
        } catch (error) {
            console.error(`Error while updating '${name}' with value: ${JSON.stringify(value)} and id: ${id}: ${error.message}`);
            return error;
        }
    }

    const getDetails = (name, id) => {
        try {
            if (!(POSSIBLE_TABLE_NAMES.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }
            let res = get(name, id);
            switch (name) {
                case "students":
                    let studLess = lessons.filter(less => less.student_id == id);
                    let plannedLessons = studLess.filter(less => less.status == 0);
                    let doneLessons = studLess.filter(less => less.status == 1);
                    let paidLessons = studLess.filter(less => less.status == 2);

                    let totalTime = 0, totalMoney = 0;
                    for (let i = 0; i < studLess.length; i++) {
                        totalMoney += studLess[i].status == 2 ? studLess[i].price : 0;
                        totalTime += studLess[i].status == 2 ? studLess[i].duration : 0;
                    }

                    return {
                        ...res,
                        totalMoney: totalMoney,
                        totalTime: totalTime,
                        lessonsAmount: {
                            planned: plannedLessons.length,
                            done: doneLessons.length,
                            paid: paidLessons.length
                        }
                    }
                case "lessons":
                    return res;
                case "pricelist":
                    return res;
                default:
                    break;
            }
        } catch (error) {
            console.error(`Error while geting details about '${name}' id=${id} with value: ${JSON.stringify(value)} and id: ${id}: ${error.message}`);
            return error;
        }
    }

    const database = {
        students: students,
        lessons: lessons,
        pricelist: pricelist,
        insert: insert,
        getAll: getAll,
        get: get,
        remove: remove,
        update: update,
        getDetails: getDetails
    }

    useEffect(() => {
        createTable("students")
            .then(() => getAll("students"))
            .then(setStudents);
        createTable("lessons")
            .then(() => getAll("lessons"))
            .then(setLessons);
        createTable("pricelist")
            .then(() => getAll("pricelist"))
            .then(setPricelist);
    }, []);


    // Settings stuff
    const [settings, setSettings] = useState(new Object());

    const settingsAPI = {
        settings: settings,
        set: async (key, value) => {
            if (!correctSettingsKey(key))
                throw new Error(`Unknown settings key: ${key}`);

            setSettings(prev => {
                let buff = { ...prev };
                buff[key] = value;
                return buff;
            });
            await settingsSet(key, value);
        }
    }

    useEffect(() => {
        async function loadSettings() {
            const allSett = await settingsGetAll();
            setSettings(allSett);
        }
        loadSettings();
    }, []);

    return (
        <SettingsContext value={settingsAPI}>
            <DatabaseContext value={database}>
                <PaperProvider theme={theme}>
                    <SafeAreaView style={styles.container}>
                        <NavigationContainer theme={theme}>
                            <StatusBar translucent backgroundColor="transparent" />

                            <Tab.Navigator screenOptions={{ headerShown: false, tabBarInactiveTintColor: theme.colors.onBackground, tabBarActiveTintColor: theme.colors.primary }} initialRouteName="Lessons">
                                <Tab.Screen name="Students" component={StudetnsScreen} options={{ tabBarIcon: () => <Icon source={"account"} size={26} />, title: "Uczniowie" }} />
                                <Tab.Screen name="Lessons" component={LessonsScreen} options={{ tabBarIcon: () => <Icon source={"calendar"} size={26} />, title: "Lekcje" }} />
                                <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: () => <Icon source={"cog"} size={26} />, title: "Opcje" }} />
                            </Tab.Navigator>

                        </NavigationContainer>
                    </SafeAreaView>
                </PaperProvider>
            </DatabaseContext>
        </SettingsContext>
    );
}