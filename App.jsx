import { Platform, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from "react-native";
import { PaperProvider, } from "react-native-paper";
import { themeDark, themeLight } from "./theme";
import EditStudentScreen from "./screens/students/EditStudent";
import { possibleTableNames } from "./constants/const";
import { createContext, useState, useEffect } from "react";
import { createTableS, getAllS, insertS } from "./database/students";
import StudentsListScreen from "./screens/students/StudentsList";

export const DatabaseContext = createContext(null);

export default function App() {
    const systemTheme = useColorScheme();
    const theme = systemTheme == "dark" ? themeDark : themeLight;

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
            flex: 1,
            paddingHorizontal: 20,
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
            console.log(`Error while creating table '${name}': ${JSON.stringify(error)}`);
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
            console.log(`Error while creating table '${name}': ${JSON.stringify(error)}`);
            return error;
        }
    };

    const database = {
        students: students,
        insert: insert,
        getAll: getAll
    }

    useEffect(() => {
        createTable(possibleTableNames[0])
            .then(() => getAll(possibleTableNames[0]))
            .then(setStudents);
    }, []);

    return (
        <DatabaseContext value={database}>
            <PaperProvider theme={theme}>
                <SafeAreaView style={styles.container}>
                    <StudentsListScreen />
                </SafeAreaView>
            </PaperProvider>
        </DatabaseContext>
    );
}