import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { theme } from "../theme";
import { useEffect, useState } from "react";
import { arrowDown } from "../functions/getUnicodeItems";
import SelectDropdown from "react-native-select-dropdown";
import RectangleRadioButton from "../components/rectRadioButton";
import DatePicker from "react-native-date-picker";
import { getDD_MM_YY_HH_MMDate, getDD_MM_YYYYDate, getDD_Mon_YYYY_HH_MMDate, getDD_Mon_YYYYDate, ISOToDate } from "../functions/date";
import { insertIntoLessons, updateIDLessons } from "../functions/dbLessons";
import { getAllStudents } from "../functions/dbStudents";


export default function EditLesson({ navigation, route }) {

    const { lessonID } = route.params;

    const possibleForms = [
        { id: 0, title: "Zdalnie" },
        { id: 1, title: "Stacjonarnie" },
        { id: 2, title: "Mieszana" },
    ];

    const lessonData = {};
    const students = getAllStudents();


    // creating states for data that are given in the form
    const [studentID, setStudentID] = useState(null);
    const [subject, setSubject] = useState("");
    const [level, setLevel] = useState("");
    const [topic, setTopic] = useState("");
    const [duration, setDuration] = useState(1);
    const [price, setPrice] = useState(null);





    // stuff for picking date
    const [mode, setMode] = useState("");

    const [selectedDateTime_oneLesson, setDateTime_oneLesson] = useState(new Date())
    const [isDatePickerOpen_oneLesson, setDateVisibility_oneLesson] = useState(false);
    const [isTimePickerOpen_oneLesson, setTimeVisibility_oneLesson] = useState(false);



    // functions for rendering
    const renderDropdownButtonChooseStudent = (sel, isOpen) => {
        return (
            <View style={[styles.optionValue, { borderRadius: 5, paddingVertical: 5, justifyContent: "center", borderColor: theme.light.border, borderWidth: 1 }]}>
                <Text style={theme.styles.text}>{sel ? sel.id + " " + sel.name + " " + sel.surname : "Wybierz ucznia"}</Text>
                <Text style={styles.arrowDown}>{arrowDown()}</Text>
            </View>
        );
    };

    const renderDropdownItemChooseStudent = (item, index, isSelected) => {
        return (
            <View style={[
                styles.dropdownItem,
                { backgroundColor: (isSelected ? theme.light.primaryPale : "white") }
            ]}>
                <Text style={[theme.styles.text, { fontSize: 10, position: "absolute", left: 2 }]}>{item.id}</Text>
                <Text style={theme.styles.text}>{item.name} {item.surname}</Text>
            </View>
        );
    }


    // handling events
    const handleSaveButton = () => {
        const newLessonData = {
            student_id: studentID.id,
            subject: subject,
            level: level,
            date: selectedDateTime_oneLesson.toISOString(),
            topic: topic,
            duration: duration,
            price: price,
        }

        // TODO
        // check if all the data were typed in
        // check if there is no drop database

        if (!lessonID) {
            insertIntoLessons(newLessonData);
        }
        else {
            updateIDLessons(lessonID, newLessonData);
        }
        navigation.pop();
    }






    // fetch all the data if I want to edit
    let [haveISetTheData, setAreDataSet] = useState(false);
    useEffect(() => {
        if (!haveISetTheData && lessonID !== null && lessonData && Object.keys(lessonData).length > 0) {
            setStudentID(lessonData.studentID || "");
            setSubject(lessonData.subject || "");
            setLevel(lessonData.phone || "");
            setDateTime_oneLesson(ISOToDate(lessonData.date) || "");
            setTopic(lessonData.topic || "");
            setDuration(lessonData.duration || "");
            setPrice(lessonData.price || "");

            setMode("one-lesson");
            setAreDataSet(true);
        }
    }, [lessonData, lessonID]);





    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                <KeyboardAvoidingView>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Uczeń</Text>
                        <SelectDropdown
                            data={students}
                            onSelect={(sel, index) => setStudentID(sel)}
                            renderButton={renderDropdownButtonChooseStudent}
                            renderItem={renderDropdownItemChooseStudent}
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Przedmiot</Text>

                        {/* if there is price list you can use SelectDropdown */}

                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Przedmiot"
                            value={subject}
                            onChangeText={setSubject}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            textContentType="familyName"
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Poziom</Text>
                        {/* if there is price list you can use SelectDropdown */}
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Poziom"
                            value={level}
                            onChangeText={setLevel}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            keyboardType="default"
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Tryb dodawania</Text>
                        {/* if add one then just set one date but in the other case start date and the end date and show the set lessons at the bottom */}
                        <View style={{ flex: 4, flexDirection: "row", gap: 10 }}>
                            <RectangleRadioButton
                                text="Jedna lekcja"
                                onSelect={() => setMode("one-lesson")}
                                isSelected={mode === "one-lesson"}
                            />
                            <RectangleRadioButton
                                text="Regularnie"
                                onSelect={() => setMode("regulary")}
                                isSelected={mode === "regulary"}
                            />
                        </View>
                    </View>

                    {mode == "one-lesson" &&
                        <>
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Data i godzina</Text>

                                <Button
                                    mode="outlined"
                                    style={{ flex: 2 }}
                                    onPress={() => setDateVisibility_oneLesson(true)}
                                >
                                    <Text style={theme.styles.text}>{getDD_Mon_YYYY_HH_MMDate(selectedDateTime_oneLesson)}</Text>
                                </Button>

                                <DatePicker
                                    modal
                                    mode="date"
                                    date={selectedDateTime_oneLesson}
                                    open={isDatePickerOpen_oneLesson}
                                    onConfirm={(date) => {
                                        setDateTime_oneLesson(new Date(date.getFullYear(), date.getMonth(), date.getDate(), selectedDateTime_oneLesson.getHours(), selectedDateTime_oneLesson.getMinutes()));
                                        setDateVisibility_oneLesson(false);
                                        setTimeVisibility_oneLesson(true);
                                    }}
                                    onCancel={() => {
                                        setDateVisibility_oneLesson(false);
                                    }}
                                />
                                <DatePicker
                                    modal
                                    mode="time"
                                    date={selectedDateTime_oneLesson}
                                    open={isTimePickerOpen_oneLesson}
                                    onConfirm={(date) => {
                                        setDateTime_oneLesson(new Date(selectedDateTime_oneLesson.getFullYear(), selectedDateTime_oneLesson.getMonth(), selectedDateTime_oneLesson.getDate(), date.getHours(), date.getMinutes()));
                                        setTimeVisibility_oneLesson(false);
                                    }}
                                    onCancel={() => {
                                        setTimeVisibility_oneLesson(false);
                                    }}
                                />
                            </View>
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Temat</Text>
                                {/* if there is price list you can use SelectDropdown */}
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder="Temat"
                                    value={topic}
                                    onChangeText={setTopic}
                                    activeOutlineColor={theme.light.primaryHalf}
                                    contentStyle={theme.styles.text}
                                    keyboardType="default"
                                />
                            </View>
                        </>
                    }


                    {
                        mode !== "" &&
                        <>

                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Czas</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder="Czas"
                                    value={String(duration)}
                                    onChangeText={val => setDuration(parseInt(val))}
                                    activeOutlineColor={theme.light.primaryHalf}
                                    contentStyle={theme.styles.text}
                                    keyboardType="number-pad"
                                />
                            </View>

                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Cena</Text>

                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder="Cena"
                                    value={price}
                                    onChangeText={val => setPrice(parseInt(val))}
                                    activeOutlineColor={theme.light.primaryHalf}
                                    contentStyle={theme.styles.text}
                                    keyboardType="number-pad"
                                />

                                <Button
                                    style={{
                                        position: "absolute",
                                        // backgroundColor: "red",
                                        justifyContent: "center",
                                        alignContent: "center",
                                        top: 18,
                                        right: 7
                                        // display: if i didnt specified subject, level, time or I turned off the price list then NONE
                                    }}

                                    onPress={console.log("TODO")}
                                >
                                    <Image source={require("../assets/images/magic.png")} style={{ width: 32, height: 32 }} />
                                </Button>
                            </View>
                        </>
                    }






                </KeyboardAvoidingView>

                <View style={styles.buttonPanel}>
                    {/* cancel button */}
                    <Button
                        mode="contained"
                        style={[styles.button, { backgroundColor: theme.light.error }]}
                        onPress={() => navigation.pop()}
                    >
                        <Text style={styles.buttonLabel}>Anuluj</Text>
                    </Button>


                    {/* save button */}
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={handleSaveButton}
                    >
                        <Text style={styles.buttonLabel}>Zapisz</Text>
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    arrowDown: {
        position: "absolute",
        color: theme.light.text.black,
        right: 10
    },
    button: {
        backgroundColor: theme.light.primary,
        marginVertical: 5,
        flex: 1
    },
    buttonLabel: {
        color: theme.light.text.white,
        fontWeight: "bold",
        letterSpacing: 1
    },
    buttonPanel: {
        justifyContent: "center",
        gap: 10,
        flexDirection: "row",
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: theme.light.background,
    },
    dropdownItem: {
        width: '100%',
        // flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center",
        paddingVertical: 8,
        borderBottomColor: theme.light.text.gray,
        borderBottomWidth: 1
    },
    label: {
        flex: 2
    },
    optionContainer: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
    },
    optionValue: {
        flex: 4,
        alignItems: "center",
    },
    text: {
        color: theme.light.text.black,
        textAlignVertical: "center",
        fontSize: 16,
    },
    textInput: {
        flex: 4,
        backgroundColor: theme.light.background,
    }
});