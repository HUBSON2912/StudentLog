import { Platform, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from "react-native";
import { PaperProvider, } from "react-native-paper";
import { themeDark, themeLight } from "./theme";
import { createContext, useState, useEffect } from "react";
import { createTableS, deleteS, getAllS, insertS, updateS } from "./database/students";
import { NavigationContainer } from "@react-navigation/native";
import { createTableL, deleteL, getAllL, insertL, updateL } from "./database/lessons";
import StudetnsScreen from "./screens/Students";
import LessonsScreen from "./screens/Lessons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
                    setStudents(students.filter(s => s.id != id));
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
            console.log(`Error while updateing '${name}' with value: ${JSON.stringify(value)} and id: ${id}: ${error.message}`);
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
        update: update
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

                        <Tab.Navigator screenOptions={{ headerShown: false }}>
                            <Tab.Screen name="Students" component={StudetnsScreen} />
                            <Tab.Screen name="Lessons" component={LessonsScreen} />
                        </Tab.Navigator>

                    </NavigationContainer>
                </SafeAreaView>
            </PaperProvider>
        </DatabaseContext>
    );
}