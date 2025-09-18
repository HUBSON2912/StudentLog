import { SafeAreaView, Text, StyleSheet, View, Image } from 'react-native';
import { theme } from './theme';
import { PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { account, clipboard, cog } from './functions/getUnicodeItems';
import LessonsScreen from './screens/lessons';
import StudentsScreen from './screens/students';
import SettingsScreen from './screens/settings';
import { createContext, useEffect, useState } from 'react';
import { deleteIDLessons, dropDBLessons, getAllLessons, insertIntoLessons, updateIDLessons } from './functions/dbLessons';
import { deleteIDStudent, dropDBStudent, getAllStudents, insertIntoStudents, updateIDStudents } from './functions/dbStudents';
import { deleteIDPriceList, dropDBPriceList, getAllPriceList, insertIntoPriceList, updateIDPriceList } from './functions/dbPriceList';

const Tabs = createBottomTabNavigator();
export const DatabaseContext = createContext(undefined);


function groupBy(items, selector) {
    let map = new Map();
    for (let i = 0; i < items.length; i++) {
        let sel = selector(items[i]);
        if (map.get(sel) === undefined) {
            map.set(sel, []);
        }
        let arr = map.get(sel);
        arr.push(items[i]);
        map.set(sel, arr);
    }
    let arr = [...map].map((item) => { return { key: item[0], value: item[1] } });
    return arr;
}


export default function App() {

    const [lessons, setLessons] = useState([]);
    const [students, setStudents] = useState([]);
    const [priceList, setPriceList] = useState([]);

    const totalEarnings = () => {
        let earn = 0;
        for (let i = 0; i < lessons.length; i++) {
            if (lessons[i].status == 2) {
                earn += lessons[i].price;
            }
        }
        return earn;
    }
    const insertStudents = async (newStudent) => {
        const insertId = await insertIntoStudents(newStudent);
        const buf = students;
        newStudent.id = insertId;
        buf.push(newStudent);
        setStudents(buf);
    };

    const insertPriceList = async (newElement) => {
        const insertId = await insertIntoPriceList(newElement);
        const buf = priceList;
        newElement.id = insertId;
        buf.push(newElement);
        setPriceList(buf);
    }

    const updateLesson = (id, data) => {
        const buf = lessons;
        const studentInThisLesson = students.filter((x) => x.id == data.student_id)[0];
        data.name = studentInThisLesson.name;
        data.surname = studentInThisLesson.surname;
        data.id = id;
        for (let i = 0; i < buf.length; i++) {
            if (buf[i].id == id) {
                buf[i] = data;
                break;
            }
        }
        setLessons(buf);
        updateIDLessons(id, data);
    }

    const updateStudent = (id, data) => {
        const buf = students;
        for (let i = 0; i < buf.length; i++) {
            if (buf[i].id == id) {
                buf[i] = data;
                buf[i].id = id;
                break;
            }
        }
        setStudents(buf);
        updateIDStudents(id, data);
    }

    const updatePriceList = (id, data) => {
        const buf = priceList;
        for (let i = 0; i < buf.length; i++) {
            if (buf[i].id == id) {
                buf[i] = data;
                buf[i].id = id;
                break;
            }
        }
        setPriceList(buf);
        updateIDPriceList(id, data);
    }

    const insertLessons = async (newLesson) => {
        const insertId = await insertIntoLessons(newLesson);
        const buf = lessons;
        newLesson.id = insertId;
        let student = students.filter((x) => x.id == newLesson.student_id)[0];
        newLesson.name = student.name;
        newLesson.surname = student.surname;
        student.money = student.money + (newLesson.status == 2 ? newLesson.price : 0);
        student.lessons_amount = student.lessons_amount + (newLesson.status == 2 ? 1 : 0);
        updateStudent(student.id, student);
        buf.push(newLesson);
        setLessons(buf);
    };

    const getLessonByID = (id) => {
        const buf = database.lessons.filter((x) => x.id == id);
        if (buf.length == 0) {
            return null;
        }
        return buf[0];
    }

    const getStudentByID = (id) => {
        const buf = database.students.filter((x) => x.id == id);
        if (buf.length == 0) {
            return null;
        }
        return buf[0];
    }

    const getPriceListByID = (id) => {
        const buf = database.priceList.filter((x) => x.id == id);
        if (buf.length == 0) {
            return null;
        }
        return buf[0];
    }

    const deleteLesson = (id) => {
        let buf = lessons;
        buf = buf.filter((x) => x.id != id);
        setLessons(buf);
        deleteIDLessons(id);
    }

    const deleteStudent = (id) => {
        let buf = students;
        buf = buf.filter((x) => x.id != id);
        setStudents(buf);
        buf = lessons;
        buf = buf.filter((x) => x.student_id != id);
        setLessons(buf);
        deleteStudentsLessons(id);
        deleteIDStudent(id);
    }

    const deletePriceList = (id) => {
        let buf = priceList;
        buf = buf.filter((x) => x.id != id);
        setPriceList(buf);
        deleteIDPriceList(id);
    }

    const dropLessons = () => {
        setLessons([]);
        dropDBLessons();
    }

    const dropStudents = () => {
        setStudents([]);
        dropDBStudent();
    }

    const dropPriceList = () => {
        setPriceList([]);
        dropDBPriceList();
    }


    const earningsPerStudents = () => {
        return groupBy(lessons, (item) => item.student_id);
    }


    useEffect(() => {
        const fetchDB = async () => {
            setStudents(await getAllStudents());
            setLessons(await getAllLessons());
            setPriceList(await getAllPriceList());
        }
        fetchDB();
    }, []);

    const database = {
        lessons: lessons,
        students: students,
        priceList: priceList,
        drop: {
            lessons: dropLessons,
            students: dropStudents,
            priceList: dropPriceList
        },
        delete: {
            lesson: deleteLesson,
            student: deleteStudent,
            priceList: deletePriceList
        },
        getByID: {
            lesson: getLessonByID,
            student: getStudentByID,
            priceList: getPriceListByID
        },
        update: {
            lesson: updateLesson,
            student: updateStudent,
            priceList: updatePriceList
        },
        insert: {
            lesson: insertLessons,
            student: insertStudents,
            priceList: insertPriceList
        },
        totalEarnings: totalEarnings,
        earningsPerStudents: earningsPerStudents
    };

    return (
        <DatabaseContext.Provider value={database}>
            <PaperProvider>
                <NavigationContainer>
                    <SafeAreaView style={styles.container}>
                        <View>
                            <Text style={styles.title}>
                                StudentLog
                            </Text>
                        </View>


                        <Tabs.Navigator initialRouteName='Lessons' screenOptions={{ animation: 'shift', headerShown: false }}>
                            <Tabs.Screen name="Students" component={StudentsScreen} options={{
                                tabBarIcon: ({ focused, color, size }) => {
                                    return <Text style={{ fontSize: 22 }}>{account()}</Text>;
                                }
                            }} />
                            <Tabs.Screen name="Lessons" component={LessonsScreen} options={{
                                tabBarIcon: ({ focused, color, size }) => {
                                    return <Text style={{ fontSize: 22 }}>{clipboard()}</Text>;
                                }
                            }} />
                            <Tabs.Screen name="Settings" component={SettingsScreen} options={{
                                tabBarIcon: ({ focused, color, size }) => {
                                    return <Text style={{ fontSize: 22 }}>{cog()}</Text>;
                                }
                            }} />
                        </Tabs.Navigator>

                    </SafeAreaView>
                </NavigationContainer>
            </PaperProvider>
        </DatabaseContext.Provider>
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