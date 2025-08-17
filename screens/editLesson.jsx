import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { theme } from "../theme";
import { useEffect, useState } from "react";
import { arrowDown } from "../functions/getUnicodeItems";
import SelectDropdown from "react-native-select-dropdown";
import RectangleRadioButton from "../components/rectRadioButton";
import DatePicker from "react-native-date-picker";
import { getDD_MM_YYYY_HH_MMDate, getDD_MM_YYYYDate, getWeekDayName, ISOToDate } from "../functions/date";
import { getByIDLessons, insertIntoLessons, updateIDLessons } from "../functions/dbLessons";
import { getAllStudents, getByIDStudents } from "../functions/dbStudents";
import { possibleStatus, StatusLabel } from "../components/statuslabel";
import CheckboxDayTime from "../components/checkboxdaytime";


export default function EditLesson({ navigation, route }) {

    const { lessonID } = route.params;

    const [lessonData, setLessonData] = useState({});
    const [students, setStudents] = useState([]);
    const [defStudent, setDefStudent] = useState(null);

    // creating states for data that are given in the form
    const [student, setStudent] = useState(null);
    const [subject, setSubject] = useState("");
    const [level, setLevel] = useState("");
    const [topic, setTopic] = useState("");
    const [duration, setDuration] = useState(1);
    const [price, setPrice] = useState(0);
    const [status, setStatus] = useState(possibleStatus[0]);

    useEffect(() => {
        const fetchData = async () => {
            if (lessonID !== null) {
                setLessonData(await getByIDLessons(lessonID));
            }

            setStudents(await getAllStudents());
        }
        fetchData();
    })

    const [error, setError] = useState("");



    // stuff for picking date
    const [mode, setMode] = useState("");

    // one lesson
    const [selectedDateTime_oneLesson, setDateTime_oneLesson] = useState(new Date())
    const [isDatePickerOpen_oneLesson, setDateVisibility_oneLesson] = useState(false);
    const [isTimePickerOpen_oneLesson, setTimeVisibility_oneLesson] = useState(false);

    // regulary
    const today = new Date();  // temporary
    const [selectedDateBegin_regulary, setDateBegin_regulary] = useState(new Date());
    const [isDateBeginPickerOpen_regulary, setDateBeginVisibility_regulary] = useState(false);
    const [selectedDateEnd_regulary, setDateEnd_regulary] = useState(new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()));
    const [isDateEndPickerOpen_regulary, setDateEndVisibility_regulary] = useState(false);

    // selecting the days of the week
    const [selectedDays, setSelectedDays] = useState([null, null, null, null, null, null, null]);
    const handleSelectingDaysOfWeek = (index, time) => {
        let temp = [...selectedDays];
        temp[index] = time;
        setSelectedDays(temp);
    }

    // functions for rendering
    const renderDropdownButtonChooseStudent = (sel, isOpen) => {
        return (
            <View style={[styles.optionValue, { borderRadius: 5, paddingVertical: 5, justifyContent: "center", borderColor: theme.light.border, borderWidth: 1 }]}>
                <Text style={theme.styles.text}>{student ? student.id + " " + student.name + " " + student.surname : "Wybierz ucznia"}</Text>
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
    const handleSaveButton_oneLesson = () => {
        // check if there is no drop database or shit like this

        if (
            !student ||
            !subject ||
            !level ||
            !selectedDateTime_oneLesson ||
            !duration ||
            !price ||
            !status
        ) {
            setError("Uzupełnij wszystkie dane");
            return;
        }

        const newLessonData = {
            student_id: student.id,
            subject: subject,
            level: level,
            year: selectedDateTime_oneLesson.getFullYear(),
            month: selectedDateTime_oneLesson.getMonth() + 1,
            day: selectedDateTime_oneLesson.getDate(),
            hour: selectedDateTime_oneLesson.getHours(),
            minute: selectedDateTime_oneLesson.getMinutes(),
            topic: topic,
            duration: parseFloat(duration),
            price: parseInt(price),
            status: status.id
        }
        if (!lessonID) {
            insertIntoLessons(newLessonData);
        }
        else {
            updateIDLessons(lessonID, newLessonData);
        }
        navigation.pop();
    }

    // idea add a calendar with all your lessons

    const isArrayFilledByNULL = (arr) => {
        let temp = [...arr];
        temp = temp.filter((val, ind, arr) => { return val; });
        return temp.length == 0;
    }

    const handleSaveButton_regulary = () => {
        if (
            !student ||
            !subject ||
            !level ||
            !duration ||
            !price ||
            isArrayFilledByNULL(selectedDays)
        ) {
            setError("Uzupełnij wszystkie dane");
            return;
        }

        if (selectedDateBegin_regulary.getTime() > selectedDateEnd_regulary.getTime()) {
            setError("Nieprawidłowy zakres dat")
            return;
        }


        let newLessonsArray = [];
        for (let day = new Date(selectedDateBegin_regulary.getFullYear(), selectedDateBegin_regulary.getMonth(), selectedDateBegin_regulary.getDate(), 3, 0, 0, 0);
            true;
            day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1, 3, 0, 0, 0)) {

            const dayoftheweek = day.getDay() == 0 ? 6 : (day.getDay() - 1); // monday is the first (the 0th) dat of the week and sunday is the last
            if (selectedDays[dayoftheweek]) {
                const newLessonData = {
                    student_id: student.id,
                    subject: subject,
                    level: level,
                    year: day.getFullYear(),
                    month: day.getMonth() + 1,
                    day: day.getDate(),
                    hour: selectedDays[dayoftheweek].getHours(),
                    minute: selectedDays[dayoftheweek].getMinutes(),
                    topic: "",
                    duration: parseFloat(duration),
                    price: parseInt(price),
                    status: 0   // planned
                }
                newLessonsArray.push(newLessonData);
            }

            if (
                day.getFullYear() == selectedDateEnd_regulary.getFullYear() &&
                day.getMonth() == selectedDateEnd_regulary.getMonth() &&
                day.getDate() == selectedDateEnd_regulary.getDate()) {
                break;
            }
        }

        for (let i = 0; i < newLessonsArray.length; i++) {
            insertIntoLessons(newLessonsArray[i]);
        }

        navigation.pop();

    }


    // fetch all the data if I want to edit
    let [haveISetTheData, setAreDataSet] = useState(false);
    useEffect(() => {
        const setFetchedLessonData = async () => {
            const stud = await getByIDStudents(lessonData.student_id);
            setDefStudent(stud);
            setStudent(stud);
            setSubject(lessonData.subject);
            setLevel(lessonData.level);
            setDateTime_oneLesson(new Date(lessonData.year, lessonData.month - 1, lessonData.day, lessonData.hour, lessonData.minute));
            setTopic(lessonData.topic);
            setDuration(String(lessonData.duration));
            setPrice(String(lessonData.price));
            setStatus(possibleStatus[lessonData.status])

            setMode("one-lesson");
            setAreDataSet(true);
        }
        if (!haveISetTheData && lessonID !== null && lessonData && Object.keys(lessonData).length > 0) {
            setFetchedLessonData();
        }
    }, [lessonData, lessonID]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                <KeyboardAvoidingView>

                    {/* student input */}
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Uczeń</Text>

                        {
                            students.length == 0 &&
                            <Text style={[styles.textInput, theme.styles.text, { textAlign: "center", backgroundColor: "white" }]}>Brak zapisanych uczniów.</Text>
                        }

                        {
                            students.length != 0 &&

                            <SelectDropdown
                                data={students}
                                onSelect={(sel, index) => {
                                    setStudent(sel);
                                }}
                                renderButton={renderDropdownButtonChooseStudent}
                                renderItem={renderDropdownItemChooseStudent}
                                defaultValue={defStudent}
                            />
                        }
                    </View>

                    {/* subject input */}
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

                    {/* level input */}
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

                    {/* duration input */}
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Czas</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Czas"
                            value={String(duration)}
                            onChangeText={val => setDuration(parseFloat(val))}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            keyboardType="number-pad"
                        />
                    </View>

                    {/* price input */}
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Cena</Text>

                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Cena"
                            value={price}
                            onChangeText={val => setPrice(val)}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            keyboardType="number-pad"
                        />

                        {/* auto price button */}
                        <Button
                            style={{
                                position: "absolute",
                                // backgroundColor: "red",
                                justifyContent: "center",
                                alignContent: "center",
                                top: 18,
                                right: 7
                                // todo display: if i didnt specified subject, level, time or I turned off the price list then NONE
                            }}

                            onPress={() => {
                                /* todo automatic price*/
                            }}
                        >
                            <Image source={require("../assets/images/magic.png")} style={{ width: 32, height: 32 }} />
                        </Button>
                    </View>


                    {/* mode: you can add one lesson or add lessons on every Monday, Tuesday... */}
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Tryb dodawania</Text>

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

                    {/* if you want to add one lesson */}
                    {mode == "one-lesson" &&
                        <>
                            {/* date and hour */}
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Data i godzina</Text>

                                <Button
                                    mode="outlined"
                                    style={{ flex: 2 }}
                                    onPress={() => setDateVisibility_oneLesson(true)}
                                >
                                    <Text style={theme.styles.text}>{getDD_MM_YYYY_HH_MMDate(selectedDateTime_oneLesson)}</Text>
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

                            {/* status input */}
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Status</Text>
                                <View style={[styles.textInput, styles.statusContainer]}>
                                    <SelectDropdown
                                        data={possibleStatus}
                                        defaultValue={status}
                                        dropdownStyle={{ backgroundColor: "white", borderRadius: 10 }}
                                        onSelect={(selected, index) => {
                                            setStatus(selected);
                                        }}
                                        renderButton={(selected, isOpen) => {
                                            return (
                                                <View style={styles.statusContainer}>
                                                    {StatusLabel(status.id, styles.status)}
                                                </View>
                                            );
                                        }}
                                        renderItem={(item, index, isSelected) => {
                                            return (
                                                <View style={styles.statusContainer}>
                                                    {StatusLabel(item.id, styles.status)}
                                                </View>
                                            );
                                        }}
                                    />
                                </View>
                            </View>

                            {/* topic input: aviable only for one lesson, every lesson in the range would be about different thing */}
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Temat</Text>
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
                        mode === "regulary" &&
                        <>
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Button
                                    mode="text"
                                    style={{ flex: 2 }}
                                    onPress={() => setDateBeginVisibility_regulary(true)}
                                >
                                    <Text style={theme.styles.text}>Od: {getDD_MM_YYYYDate(selectedDateBegin_regulary)}</Text>
                                </Button>

                                <Button
                                    mode="text"
                                    style={{ flex: 2 }}
                                    onPress={() => setDateEndVisibility_regulary(true)}
                                >
                                    <Text style={theme.styles.text}>Do: {getDD_MM_YYYYDate(selectedDateEnd_regulary)}</Text>
                                </Button>

                                <DatePicker
                                    modal
                                    mode="date"
                                    date={selectedDateBegin_regulary}
                                    open={isDateBeginPickerOpen_regulary}
                                    onConfirm={(date) => {
                                        setDateBegin_regulary(date);
                                        setDateBeginVisibility_regulary(false);
                                    }}
                                    onCancel={() => {
                                        setDateBeginVisibility_regulary(false);
                                    }}
                                />

                                <DatePicker
                                    modal
                                    mode="date"
                                    date={selectedDateEnd_regulary}
                                    open={isDateEndPickerOpen_regulary}
                                    onConfirm={(date) => {
                                        setDateEnd_regulary(date);
                                        setDateEndVisibility_regulary(false);
                                    }}
                                    onCancel={() => {
                                        setDateEndVisibility_regulary(false);
                                    }}
                                />
                            </View>

                            <View style={[theme.styles.section, styles.optionContainer, { flexDirection: "column" }]}>
                                <CheckboxDayTime dayIndex={0} onSelect={handleSelectingDaysOfWeek} />
                                <CheckboxDayTime dayIndex={1} onSelect={handleSelectingDaysOfWeek} />
                                <CheckboxDayTime dayIndex={2} onSelect={handleSelectingDaysOfWeek} />
                                <CheckboxDayTime dayIndex={3} onSelect={handleSelectingDaysOfWeek} />
                                <CheckboxDayTime dayIndex={4} onSelect={handleSelectingDaysOfWeek} />
                                <CheckboxDayTime dayIndex={5} onSelect={handleSelectingDaysOfWeek} />
                                <CheckboxDayTime dayIndex={6} onSelect={handleSelectingDaysOfWeek} />
                            </View>


                        </>
                    }

                </KeyboardAvoidingView>

                <Text style={styles.errorMessage}>{error}</Text>
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
                        onPress={() => {
                            if (mode == "regulary")
                                handleSaveButton_regulary();
                            else
                                handleSaveButton_oneLesson();
                        }}
                    >
                        <Text style={styles.buttonLabel}>Zapisz</Text>
                    </Button>
                </View>
            </ScrollView >
        </View >
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
    errorMessage: {
        color: theme.light.error,
        fontSize: 18,
        textAlign: "center",
        margin: 5
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
    status: {
        position: "static",
        justifyContent: "center",
        alignItems: "center"
    },
    statusContainer: {
        borderRadius: 10,
        backgroundColor: "white",
        padding: 3,
    },
    text: {
        color: theme.light.text.black,
        textAlignVertical: "center",
        fontSize: 16,
    },
    textInput: {
        flex: 4,
        backgroundColor: theme.light.background,
    },

});