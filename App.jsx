import { Platform, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from "react-native";
import { PaperProvider, } from "react-native-paper";
import { themeDark, themeLight } from "./theme";
import EditStudentScreen from "./screens/students/EditStudent";
import { possibleTableNames } from "./constants/const";
import { createContext, useState, useEffect } from "react";
import { createTableS, deleteS, getAllS, insertS, updateS } from "./database/students";
import StudentsListScreen from "./screens/students/StudentsList";
import { NavigationContainer } from "@react-navigation/native";
import StudetnsScreen from "./screens/Students";

export const DatabaseContext = createContext(null);

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

    const createTable = async (name) => {
        try {
            if (!(possibleTableNames.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            switch (name) {
                case "students":
                    createTableS();
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while creating table '${name}': ${JSON.stringify(error)}`);
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

                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while getting all from '${name}': ${JSON.stringify(error)}`);
            return error;
        }
    };

    const insert = async (name, value) => {
        try {
            if (!(possibleTableNames.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            switch (name) {
                case "students":
                    const id = await insertS(value);
                    value.id = id;
                    students.push(value);
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while inserting ${JSON.stringify(value)} into table '${name}': ${JSON.stringify(error)}`);
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

                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while removing id: ${id} table '${name}': ${JSON.stringify(error)}`);
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

                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while geting by ID: ${id} from table '${name}': ${JSON.stringify(error)}`);
            return error;
        }
    }

    const update = (name, value, id) => {
        try {
            if (!(possibleTableNames.includes(name))) {
                throw new Error(`Unknow table name: '${name}'`);
            }

            switch (name) {
                case "students":
                    updateS(value, id);
                    let buff = [...students];
                    for (let i = 0; i < buff.length; i++) {
                        if (buff[i].id == id) {
                            buff[i] = value;
                            buff[i].id = id;
                            break;
                        }
                    }
                    setStudents(buff);
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(`Error while updateing '${name}' with value: ${JSON.stringify(value)} and id: ${id}: ${JSON.stringify(error)}`);
            return error;
        }
    }


    const database = {
        students: students,
        insert: insert,
        getAll: getAll,
        get: get,
        remove: remove,
        update: update
    }

    useEffect(() => {
        createTable(possibleTableNames[0])
            .then(() => getAll(possibleTableNames[0]))
            .then(setStudents);
    }, []);

    return (
        <NavigationContainer theme={theme}>
            <DatabaseContext value={database}>
                <PaperProvider theme={theme}>
                    <SafeAreaView style={styles.container}>
                        <StudetnsScreen />
                    </SafeAreaView>
                </PaperProvider>
            </DatabaseContext>
        </NavigationContainer>
    );
}