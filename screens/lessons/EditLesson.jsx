import { KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { AnimatedFAB, Button, Chip, Icon, SegmentedButtons, Snackbar, Text, TextInput, useTheme } from "react-native-paper";
import { ToggleChipGroup } from "../../components/toggleChipGroup";
import { possibleLessonsAddMode, possibleStatuses, weekDays } from "../../constants/const";
import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "../../App";
import SelectDropdown from "react-native-select-dropdown";
import { AutocompleteTextInput } from "../../components/autocompleteTextInput";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { dateToDDMMYYYY, DDMMYYYYToDate, HHMMToHour, hourToHHMM } from "../../functions/misc/date";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

export default function EditLessonScreen({ navigation, route }) {
    const theme = useTheme();
    const db = useContext(DatabaseContext);
    const statuses = useColorScheme() == "dark" ? possibleStatuses.dark : possibleStatuses.light;
    const { lessonID } = route.params ?? { lessonID: null };

    const styles = StyleSheet.create({
        container: {
            paddingHorizontal: 20,
            flexGrow: 1
        },
        chipContainer: {
            flex: 1,
            gap: 5,
            alignItems: "center"
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 10
        },
        label: {
            width: 100,
            fontSize: 16,
        },
        input: {
            flex: 1
        },
        chipHoursWeekDays: {
            flexDirection: "row",
            gap: 5,
            flexWrap: "wrap",
            flexShrink: 1
        }
    });

    const [showCalendar_oneLess, setShowCalendar_oneLess] = useState(false);
    const [showTime_oneLess, setShowTime_oneLess] = useState(false);
    const [showCalendar_regulary, setShowCalendar_regulary] = useState(false);

    const students = db.students;

    const [selectedStudentID, setSelectedStudentID] = useState(null);
    const [subject, setSubject] = useState("");
    const [level, setLevel] = useState("");
    const [duration, setDuration] = useState("1");
    const [price, setPrice] = useState("");
    const [mode, setMode] = useState(0);
    const [date_oneLess, setDate_oneLess] = useState(new Date());
    const [hour_oneLess, setHour_oneLess] = useState({ hours: new Date().getHours(), minutes: new Date().getMinutes() });
    const [status, setStatus] = useState(0);
    const [topic, setTopic] = useState("");
    const [dateRange_regulary, setDateRange_regulary] = useState({ startDate: new Date(), endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()) });
    const [timesPerDay_regulary, setTimesPerDay_regulary] = useState([[], [], [], [], [], [], []]);
    const [pressedDayIndex, setPressedDayIndex] = useState(null);
    const [showTimeWeekDay, setShowTimeWeekDay] = useState(false);

    useEffect(() => {
        if (!lessonID) {
            return;
        }

        navigation.setOptions({ title: `Edytuj lekcję (${lessonID})` })

        const lessonData = db.get("lessons", lessonID);

        setSelectedStudentID(lessonData.student_id);
        setSubject(lessonData.subject);
        setLevel(lessonData.level);
        setDuration(String(lessonData.duration));
        setPrice(String(lessonData.price));
        setDate_oneLess(DDMMYYYYToDate(lessonData.date));
        setHour_oneLess(HHMMToHour(lessonData.hour));
        setTopic(lessonData.topic);
        setStatus(lessonData.status);
    }, []);

    const [loading, setLoading] = useState(false);

    const handleSaveInsert_oneLesson = async () => {
        setLoading(true);
        const newLesson = {
            student_id: selectedStudentID,
            subject: subject,
            level: level,
            duration: parseFloat(duration),
            price: parseInt(price),
            date: dateToDDMMYYYY(date_oneLess),
            hour: hourToHHMM(hour_oneLess),
            status: status,
            topic: topic
        };
        await db.insert("lessons", newLesson);
        setLoading(false);
        navigation.pop();
    }

    const handleSaveUpdate_oneLesson = async () => {
        setLoading(true);
        const newLesson = {
            student_id: selectedStudentID,
            subject: subject,
            level: level,
            duration: parseFloat(duration.replace(',', '.')),
            price: parseInt(price),
            date: dateToDDMMYYYY(date_oneLess),
            hour: hourToHHMM(hour_oneLess),
            status: status,
            topic: topic
        };
        await db.update("lessons", newLesson, lessonID);
        setLoading(false);
        navigation.pop();
    }

    const handleSaveInsert_regulary = async () => {
        setLoading(true);
        let newLessons = [];
        let newItem;

        // the loop is in range [startDate, endDate) 
        // so we can add one day to the end date so
        // now we have [startDate, endDate]
        let endDate = new Date(dateRange_regulary.endDate.valueOf() + 1 * 24 * 60 * 60 * 1000);

        for (let day = dateRange_regulary.startDate;
            dateToDDMMYYYY(day) !== dateToDDMMYYYY(endDate);
            day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
        ) {
            let dayofweek = day.getDay() - 1;
            dayofweek = (dayofweek < 0 ? 6 : dayofweek);
            console.log(dateToDDMMYYYY(day), weekDays[dayofweek]);
            for (let i = 0; i < timesPerDay_regulary[dayofweek].length; i++) {
                newItem = {
                    student_id: selectedStudentID,
                    subject: subject,
                    level: level,
                    duration: parseFloat(duration.replace(',', '.')),
                    price: parseInt(price),
                    date: dateToDDMMYYYY(day),
                    hour: hourToHHMM(timesPerDay_regulary[dayofweek][i]),
                    status: 0,  // defaultly planned
                    topic: ""
                };
                console.log(newItem);
                newLessons.push({ ...newItem });
            }
        }
        for (let i = 0; i < newLessons.length; i++) {
            db.insert("lessons", newLessons[i]);
        }
        console.log(db);
        setLoading(false);
        navigation.pop();
    }

    const chooseSaveMone = () => {
        if (mode == 0) {
            if (lessonID) {
                handleSaveUpdate_oneLesson();
                return;
            }
            else {
                handleSaveInsert_oneLesson();
                return;
            }
        }
        else {
            handleSaveInsert_regulary();
            return;
        }
    }

    const DropdownItem = (item, index, isSelected) => {
        const styles = StyleSheet.create({
            elementContainer: {
                backgroundColor: isSelected ? theme.colors.surface : "black",
                borderWidth: 1,
                borderColor: theme.colors.outline,
                paddingHorizontal: 15,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                gap: 10
            }
        });

        console.log(`"${item.name}"`, `"${item.surname}"`);

        return (
            <View style={styles.elementContainer}>
                <Text>{item.id}</Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <Text variant="bodyLarge">{item.name}</Text>
                    <Text variant="bodyLarge">{item.surname}</Text>
                </View>
            </View>
        );
    }

    function DropdownButton(selectedItem, isOpen) {
        if (selectedStudentID) {
            selectedItem = db.get("students", selectedStudentID);
        }

        const styles = StyleSheet.create({
            listContainer: {
                borderWidth: 1,
                borderColor: theme.colors.outline,
                borderRadius: theme.roundness,
                paddingHorizontal: 15,
                paddingVertical: 10,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "space-between"
            },
            placeholder: {
                color: theme.colors.onSurfaceVariant
            }
        });

        return (
            <View style={styles.listContainer}>
                {
                    selectedItem &&
                    <View style={{ flexDirection: "row", gap: 5 }}>
                        <Text variant="bodyLarge">{selectedItem.name}</Text>
                        <Text variant="bodyLarge">{selectedItem.surname}</Text>
                    </View>
                }
                {
                    !selectedItem &&
                    <Text variant="bodyLarge" style={styles.placeholder}>Wybierz ucznia</Text>
                }
                <Icon source={isOpen ? "arrow-left-drop-circle-outline" : "arrow-down-drop-circle-outline"} size={20} />
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps="handled">

            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Uczeń:</Text>
                {
                    students.length != 0 &&
                    <SelectDropdown
                        data={students}
                        onSelect={(sel) => setSelectedStudentID(sel.id)}
                        renderButton={DropdownButton}
                        renderItem={DropdownItem}
                    />
                }
                {
                    students.length == 0 &&
                    <Text style={{ fontSize: 16, borderRadius: theme.roundness, ...styles.input, borderWidth: 1, borderColor: theme.colors.outline, paddingVertical: 10, paddingHorizontal: 15 }}>Brak uczniów</Text>
                }
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Przedmiot:</Text>
                <AutocompleteTextInput
                    label="Przedmiot"
                    containerStyle={styles.input}
                    onChangeText={setSubject}
                    suggestions={["Matematyka", "Fizyka", "Informatyka"]}
                    value={subject}
                    renderSuggestion={(item, index) => {
                        return (
                            <Text key={index} style={{ borderWidth: 1, borderColor: theme.colors.outline, padding: 10 }}>{item}</Text>
                        );
                    }}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Poziom:</Text>
                <AutocompleteTextInput
                    label="Poziom"
                    containerStyle={styles.input}
                    onChangeText={setLevel}
                    suggestions={["Szkoła podstawowa", "Szkoła średnia - PP", "Szkoła średnia - PR"]}
                    value={level}
                    renderSuggestion={(item, index) => {
                        return (
                            <Text key={index} style={{ borderWidth: 1, borderColor: theme.colors.outline, padding: 10 }}>{item}</Text>
                        );
                    }}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Czas trwania:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Czas trwania"
                    value={duration}
                    onChangeText={setDuration}
                    right={<TextInput.Affix text="h" />}
                    keyboardType="decimal-pad"
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Cena:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Cena"
                    value={price}
                    onChangeText={setPrice}
                    right={<TextInput.Affix text="zł" />}
                    keyboardType="decimal-pad"
                />
            </View>

            {/* one lesson or regulary */}
            {
                !lessonID &&
                <View style={styles.row}>
                    <Text style={styles.label} pointerEvents="none">Tryb:</Text>
                    <ToggleChipGroup
                        style={styles.chipContainer}
                        value={mode}
                        onSelect={setMode}
                        chips={possibleLessonsAddMode}
                    />
                </View>
            }


            {
                mode == 0 &&  // one-lesson
                <>
                    <View style={styles.row}>
                        <Text style={styles.label} pointerEvents="none">Data:</Text>
                        <Button
                            onPress={() => setShowCalendar_oneLess(!showCalendar_oneLess)}
                            mode="outlined"
                            style={{ borderRadius: theme.roundness, ...styles.input }}
                        >
                            {String(date_oneLess.getDate()).padStart(2, '0')}.{String(date_oneLess.getMonth() + 1).padStart(2, '0')}.{date_oneLess.getFullYear()}
                        </Button>
                        <DatePickerModal
                            locale="pl"
                            mode="single"
                            animationType="slide"
                            date={date_oneLess}
                            startWeekOnMonday={true}
                            visible={showCalendar_oneLess}
                            onDismiss={() => setShowCalendar_oneLess(false)}
                            onConfirm={({ date }) => { setDate_oneLess(date); setShowCalendar_oneLess(false) }}
                            label="Wybierz datę"
                            saveLabel="Zapisz"
                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label} pointerEvents="none">Godzina:</Text>
                        <Button
                            onPress={() => setShowTime_oneLess(!showTime_oneLess)}
                            mode="outlined"
                            style={{ borderRadius: theme.roundness, ...styles.input }}
                        >
                            {hour_oneLess.hours}:{String(hour_oneLess.minutes).padStart(2, '0')}
                        </Button>
                        <TimePickerModal
                            visible={showTime_oneLess}
                            onConfirm={(hmin) => { setHour_oneLess(hmin); setShowTime_oneLess(false); }}
                            onDismiss={() => setShowTime_oneLess(false)}
                            label="Wybierz godzinę"
                            locale="pl"
                            hours={hour_oneLess.hours}
                            minutes={hour_oneLess.minutes}
                            confirmLabel="Zapisz"
                            use24HourClock={true}
                            animationType="slide"
                            cancelLabel="Anuluj"
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label} pointerEvents="none">Status:</Text>
                        <ToggleChipGroup
                            style={styles.chipContainer}
                            value={status}
                            onSelect={setStatus}
                            chips={statuses}
                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label} pointerEvents="none">Temat:</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.input}
                            label="Temat"
                            value={topic}
                            onChangeText={setTopic}
                        />
                    </View>
                </>
            }

            {
                mode == 1 &&
                <>
                    <View style={styles.row}>
                        <Text style={styles.label} pointerEvents="none">Data:</Text>
                        <Button
                            onPress={() => setShowCalendar_regulary(!showCalendar_oneLess)}
                            mode="outlined"
                            style={{ borderRadius: theme.roundness, ...styles.input }}
                        >
                            {String(dateRange_regulary.startDate.getDate()).padStart(2, '0')}.{String(dateRange_regulary.startDate.getMonth() + 1).padStart(2, '0')}.{dateRange_regulary.startDate.getFullYear()} {"-"} {String(dateRange_regulary.endDate.getDate()).padStart(2, '0')}.{String(dateRange_regulary.endDate.getMonth() + 1).padStart(2, '0')}.{dateRange_regulary.endDate.getFullYear()}
                        </Button>
                        <DatePickerModal
                            locale="pl"
                            mode="range"
                            animationType="slide"
                            startDate={dateRange_regulary.startDate}
                            endDate={dateRange_regulary.endDate}
                            startWeekOnMonday={true}
                            visible={showCalendar_regulary}
                            onDismiss={() => setShowCalendar_regulary(false)}
                            onConfirm={({ startDate, endDate }) => {
                                setShowCalendar_regulary(false);
                                setDateRange_regulary({ startDate, endDate });
                            }}
                            label="Wybierz datę"
                            saveLabel="Zapisz"
                        />
                    </View>
                    {
                        weekDays.map((value, dayIndex) => {
                            return (
                                <View style={styles.row} key={`d${dayIndex}`}>
                                    <Text style={styles.label} pointerEvents="none">{value}:</Text>
                                    <View style={styles.chipHoursWeekDays}>
                                        <Chip onPress={() => {
                                            setShowTimeWeekDay(true);
                                            setPressedDayIndex(dayIndex);
                                        }}>
                                            <Text>+</Text>
                                        </Chip>
                                        {
                                            timesPerDay_regulary[dayIndex].map((item, index) => {
                                                return (
                                                    <Chip
                                                        key={`0${index}`}
                                                        onPress={() => {
                                                            let buf = [...timesPerDay_regulary];
                                                            buf[dayIndex] = timesPerDay_regulary[dayIndex].filter((v, ind) => ind != index);
                                                            setTimesPerDay_regulary(buf);
                                                        }}
                                                        icon={"close"}
                                                    >
                                                        {hourToHHMM(item)}
                                                    </Chip>
                                                );
                                            })
                                        }
                                    </View>
                                </View>
                            );
                        })
                    }
                    <TimePickerModal
                        visible={showTimeWeekDay}
                        onConfirm={(hmin) => {
                            let buf = [...timesPerDay_regulary];
                            buf[pressedDayIndex].push(hmin)
                            setTimesPerDay_regulary(buf);
                            setShowTimeWeekDay(false);
                        }}
                        onDismiss={() => setShowTimeWeekDay(false)}
                        label={`Wybierz godzinę (${weekDays[pressedDayIndex]})`}
                        locale="pl"
                        hours={12}
                        minutes={0}
                        confirmLabel="Zapisz"
                        use24HourClock={true}
                        animationType="slide"
                        cancelLabel="Anuluj"
                    />
                </>
            }


            <Button
                mode="contained"
                icon={"content-save"}
                disabled={loading}
                loading={loading}
                onPress={chooseSaveMone}
            >
                Zapisz
            </Button>
        </KeyboardAwareScrollView>
    );
}