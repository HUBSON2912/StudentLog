import { Platform, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from "react-native";
import { Icon, PaperProvider, } from "react-native-paper";
import { themeDark, themeLight } from "./theme";
import { createContext, useState, useEffect } from "react";
import { createTableS, deleteS, getAllS, insertS, updateS } from "./database/students";
import { NavigationContainer } from "@react-navigation/native";
import { createTableL, deleteL, deleteStudentsLessonL, getAllL, insertL, updateL } from "./database/lessons";
import StudetnsScreen from "./screens/Students";
import LessonsScreen from "./screens/Lessons";
import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { possibleTableNames } from "./constants/const";

export const DatabaseContext = createContext(null);

const Tab = createBottomTabNavigator();

export default function App() {
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

    const createTable = async (name) => {
        try {
            if (!(possibleTableNames.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            switch (name) {
                case "students":
                    createTableS();
                    break;
                case "lessons":
                    createTableL();
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while creating table '${name}': ${error.message}`);
            return error;
        }
    };

    const getAll = async (name) => {
        try {
            if (!(possibleTableNames.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            switch (name) {
                case "students":
                    return await getAllS();
                case "lessons":
                    return await getAllL();
                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while getting all from '${name}': ${error.message}`);
            return error;
        }
    };

    const insert = async (name, value) => {
        try {
            if (!(possibleTableNames.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }
            let id;
            switch (name) {
                case "students":
                    id = await insertS(value);
                    value.id = id;
                    setStudents([...students, value]);
                    break;
                case "lessons":
                    id = await insertL(value);
                    value.id = id;
                    setLessons([...lessons, value]);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while inserting ${JSON.stringify(value)} into table '${name}': ${error.message}`);
            return error;
        }
    };

    const remove = async (name, id) => {
        try {
            if (!(possibleTableNames.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            switch (name) {
                case "students":
                    deleteS(id);
                    deleteStudentsLessonL(id);
                    setStudents(students.filter(s => s.id != id));
                    setLessons(lessons.filter(l => l.student_id != id));
                    break;
                case "lessons":
                    deleteL(id);
                    setLessons(lessons.filter(l => l.id != id));
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while removing id: ${id} table '${name}': ${error.message}`);
            return error;
        }
    };

    const get = (name, id) => {
        try {
            if (!(possibleTableNames.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            switch (name) {
                case "students":
                    return students.filter(x => x.id == id)[0];
                case "lessons":
                    return lessons.filter(x => x.id == id)[0];

                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while geting by ID: ${id} from table '${name}': ${error.message}`);
            return error;
        }
    }

    const update = (name, value, id) => {
        try {
            if (!(possibleTableNames.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            let buff;

            switch (name) {
                case "students":
                    updateS(value, id);
                    buff = [...students];
                    for (let i = 0; i < buff.length; i++) {
                        if (buff[i].id == id) {
                            buff[i] = value;
                            buff[i].id = id;
                            break;
                        }
                    }
                    setStudents(buff);
                    break;
                case "lessons":
                    updateL(value, id);
                    buff = [...lessons];
                    for (let i = 0; i < buff.length; i++) {
                        if (buff[i].id == id) {
                            buff[i] = value;
                            buff[i].id = id;
                            break;
                        }
                    }
                    setLessons(buff);
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while updating '${name}' with value: ${JSON.stringify(value)} and id: ${id}: ${error.message}`);
            return error;
        }
    }

    const getDetails = (name, id) => {
        try {
            if (!(possibleTableNames.includes(name))) {
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

                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while geting details about '${name}' id=${id} with value: ${JSON.stringify(value)} and id: ${id}: ${error.message}`);
            return error;
        }
    }


    const database = {
        students: students,
        lessons: lessons,
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
    }, []);

    return (
        <DatabaseContext value={database}>
            <PaperProvider theme={theme}>
                <SafeAreaView style={styles.container}>
                    <NavigationContainer theme={theme}>
                        <StatusBar translucent backgroundColor="transparent" />

                        <Tab.Navigator screenOptions={{ headerShown: false, tabBarInactiveTintColor: theme.colors.onBackground, tabBarActiveTintColor: theme.colors.primary }}>
                            <Tab.Screen name="Students" component={StudetnsScreen} options={{ tabBarIcon: () => <Icon source={"account"} size={26} />, title: "Uczniowie" }} />
                            <Tab.Screen name="Lessons" component={LessonsScreen} options={{ tabBarIcon: () => <Icon source={"calendar"} size={26} /> }} />
                        </Tab.Navigator>

                    </NavigationContainer>
                </SafeAreaView>
            </PaperProvider>
        </DatabaseContext>
    );
}