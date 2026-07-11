import { StyleSheet, useColorScheme, View } from "react-native";
import { Button, Chip, HelperText, Icon, Text, TextInput, useTheme } from "react-native-paper";
import { ToggleChipGroup } from "../../components/toggleChipGroup";
import { POSSIBLE_LESSONS_ADD_MODE, POSSIBLE_STATUSES, ROUNDING_MODE_ID_DICT, WEEK_DAYS } from "../../constants/const";
import { useContext, useEffect, useState } from "react";
import { DatabaseContext, SettingsContext } from "../../App";
import SelectDropdown from "react-native-select-dropdown";
import { AutocompleteTextInput } from "../../components/autocompleteTextInput";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { dateToDDMMYYYY, DDMMYYYYToDate, HHMMToHour, hourToHHMM } from "../../functions/date";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { SETTINGS_KEYS } from "../../database/settings";
import { convertFloatPoint, isLikePositiveFloat } from "../../functions/validationInputs";

export default function EditLessonScreen({ navigation, route }) {
    const theme = useTheme();
    const db = useContext(DatabaseContext);
    const settings = useContext(SettingsContext);
    const statuses = useColorScheme() == "dark" ? POSSIBLE_STATUSES.dark : POSSIBLE_STATUSES.light;
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
        chipHoursWEEK_DAYS: {
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

    // load data from selected lesson
    // only for editing
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

    const [inputErrors, setInputErrors] = useState({
        student: false,
        subject: false,
        level: false,
        duration: false,
        price: false,
        timesPerDay_regulary: false
    });

    const areInputsValid = () => {
        let errors = {
            student: !selectedStudentID,
            subject: !subject,
            level: !level,
            duration: !duration,
            price: !price,
            timesPerDay_regulary: false
        }
        if (mode == 1) {
            errors.timesPerDay_regulary = (timesPerDay_regulary.filter(x => x.length == 0).length == 7);
        }

        setInputErrors(errors);

        if (Object.values(errors).includes(true)) {
            return false;
        }
        return true;
    }

    //replace ',' -> '.' in floats
    useEffect(() => {
        setDuration(prev => convertFloatPoint(prev));
        setPrice(prev => convertFloatPoint(prev));
        setInputErrors({
            ...inputErrors,
            duration: !isLikePositiveFloat(duration),
            price: !isLikePositiveFloat(price)
        });
    }, [duration, price]);

    const handleSaveInsert_oneLesson = async () => {
        setLoading(true);
        const newLesson = {
            student_id: selectedStudentID,
            subject: subject,
            level: level,
            duration: parseFloat(duration),
            price: parseFloat(price),
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
            duration: parseFloat(duration),
            price: parseFloat(price),
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
            for (let i = 0; i < timesPerDay_regulary[dayofweek].length; i++) {
                newItem = {
                    student_id: selectedStudentID,
                    subject: subject,
                    level: level,
                    duration: parseFloat(duration),
                    price: parseFloat(price),
                    date: dateToDDMMYYYY(day),
                    hour: hourToHHMM(timesPerDay_regulary[dayofweek][i]),
                    status: 0,  // defaultly planned
                    topic: ""
                };
                newLessons.push({ ...newItem });
            }
        }
        for (let i = 0; i < newLessons.length; i++) {
            db.insert("lessons", newLessons[i]);
        }
        setLoading(false);
        navigation.pop();
    }

    const chooseSaveMone = () => {
        if (!areInputsValid()) {
            return;
        }

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

    function autocompletePrice() {
        if (subject == "" || level == "") {
            return;
        }

        const pricelistItems = db.pricelist.filter(x => x.subject == subject && x.level == level);
        if (pricelistItems.length == 0) {
            setPrice("0")
        }
        else {
            let price = pricelistItems[0].price;
            let discount = parseFloat(settings.settings[SETTINGS_KEYS.discountForFirst]);

            let totalTime = db.lessons
                .filter(less => less.student_id == selectedStudentID)
                .reduce((sumTime, currLesson) => sumTime += currLesson.duration, 0);

            // discount is already taken or there is 1h-timeSpent left
            let timeWithDiscountLeft = Math.max(1 - totalTime, 0);
            let timeWithDiscountThisLesson = Math.min(timeWithDiscountLeft, parseFloat(duration));
            let priceForTimeWithDiscount = timeWithDiscountThisLesson * price * (1 - parseFloat(discount) / 100);
            let priceForTimeWithoutDiscount = (parseFloat(duration) - timeWithDiscountThisLesson) * price;
            price = priceForTimeWithDiscount + priceForTimeWithoutDiscount;

            const roundingMode = JSON.parse(settings.settings[SETTINGS_KEYS.rounding]);
            switch (roundingMode.id) {
                case ROUNDING_MODE_ID_DICT.down:
                    price = Math.floor(price);
                    break;
                case ROUNDING_MODE_ID_DICT.up:
                    price = Math.ceil(price);
                    break;
                case ROUNDING_MODE_ID_DICT.math:
                    price = Math.round(price);
                    break;
                default:
                    break;
            }
            setPrice(price.toString());
        }
    }

    function DropdownItem(item, index, isSelected) {
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
            },
            textColor: {
                color: !item.disabled ? theme.colors.onBackground : theme.colors.onSurfaceVariant
            }
        });

        return (
            <View style={styles.elementContainer}>
                <Text style={styles.textColor}>{item.id}</Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <Text variant="bodyLarge" style={styles.textColor}>{item.name}</Text>
                    <Text variant="bodyLarge" style={styles.textColor}>{item.surname}</Text>
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

            {/* select student */}
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Uczeń:</Text>
                {
                    students.length != 0 &&
                    <View style={styles.input}>
                        <SelectDropdown
                            data={students.sort((a, b) => {
                                if (a.disabled < b.disabled)
                                    return -1;
                                else if (a.disabled > b.disabled)
                                    return 1;
                                return (a.id < b.id ? -1 : 1);
                            })}
                            onSelect={(sel) => { setSelectedStudentID(sel.id); setInputErrors({ ...inputErrors, student: !sel }) }}
                            renderButton={DropdownButton}
                            renderItem={DropdownItem}
                        />
                        <HelperText visible={inputErrors.student} type="error" style={{ display: inputErrors.student ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                    </View>
                }
                {
                    students.length == 0 &&
                    <Text style={{ fontSize: 16, borderRadius: theme.roundness, ...styles.input, borderWidth: 1, borderColor: theme.colors.outline, paddingVertical: 10, paddingHorizontal: 15 }}>Brak uczniów</Text>
                }
            </View>

            {/* subject */}
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Przedmiot:</Text>
                <View style={styles.input}>
                    <AutocompleteTextInput
                        label="Przedmiot"
                        containerStyle={styles.input}
                        onChangeText={(value) => { setSubject(value); setInputErrors({ ...inputErrors, subject: !value }) }}
                        // suggestions are taken from pricelist
                        suggestions={(settings.settings[SETTINGS_KEYS.autocompleteInputs] === "true") ? ([...new Set(db.pricelist.map(x => x.subject))]) : []}
                        value={subject}
                        renderSuggestion={(item, index) => {
                            return (
                                <Text key={index} style={{ borderWidth: 1, borderColor: theme.colors.outline, padding: 10 }}>{item}</Text>
                            );
                        }}
                        error={inputErrors.subject}
                    />
                    <HelperText visible={inputErrors.subject} type="error" style={{ display: inputErrors.subject ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                </View>
            </View>

            {/* level */}
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Poziom:</Text>
                <View style={styles.input}>
                    <AutocompleteTextInput
                        label="Poziom"
                        containerStyle={styles.input}
                        onChangeText={(value) => { setLevel(value); setInputErrors({ ...inputErrors, level: !value }) }}
                        // suggestions are taken from pricelist
                        suggestions={(settings.settings[SETTINGS_KEYS.autocompleteInputs] === "true") ? ([...new Set(db.pricelist.filter(x => x.subject == subject).map(x => x.level))]) : []}
                        value={level}
                        renderSuggestion={(item, index) => {
                            return (
                                <Text key={index} style={{ borderWidth: 1, borderColor: theme.colors.outline, padding: 10 }}>{item}</Text>
                            );
                        }}
                        error={inputErrors.level}
                    />
                    <HelperText visible={inputErrors.level} type="error" style={{ display: inputErrors.level ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                </View>
            </View>

            {/* duration */}
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Czas trwania:</Text>
                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        label="Czas trwania"
                        value={duration}
                        onChangeText={(value) => {
                            setDuration(value);
                            setInputErrors({ ...inputErrors, duration: !isLikePositiveFloat(value) })
                        }}
                        right={<TextInput.Affix text="h" />}
                        keyboardType="decimal-pad"
                        error={inputErrors.duration}
                    />
                    <HelperText visible={inputErrors.duration} type="error" style={{ display: inputErrors.duration ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                </View>
            </View>

            {/* price */}
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Cena:</Text>
                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        label="Cena"
                        value={price}
                        onChangeText={(value) => {
                            setPrice(value);
                            setInputErrors({ ...inputErrors, price: !isLikePositiveFloat(value) });
                        }}
                        right={
                            (settings.settings[SETTINGS_KEYS.usePriceList] === "true") ?
                                <TextInput.Icon icon={"auto-fix"} onPress={autocompletePrice} /> :
                                <TextInput.Affix text={JSON.parse(settings.settings[SETTINGS_KEYS.currency]).symbol} />
                        }
                        keyboardType="decimal-pad"
                    />
                    <HelperText visible={inputErrors.price} type="error" style={{ display: inputErrors.price ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                </View>
            </View>

            {/* add mode: one lesson or regulary */}
            {
                !lessonID && // only if you add a new lesson and not editing
                <View style={styles.row}>
                    <Text style={styles.label} pointerEvents="none">Tryb:</Text>
                    <ToggleChipGroup
                        style={styles.chipContainer}
                        value={mode}
                        onSelect={setMode}
                        chips={POSSIBLE_LESSONS_ADD_MODE}
                    />
                </View>
            }


            {
                mode == 0 &&  // one-lesson
                <>
                    {/* select date */}
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

                    {/* select time */}
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

                    {/* select status */}
                    <View style={styles.row}>
                        <Text style={styles.label} pointerEvents="none">Status:</Text>
                        <ToggleChipGroup
                            style={styles.chipContainer}
                            value={status}
                            onSelect={setStatus}
                            chips={statuses}
                        />
                    </View>

                    {/* topic */}
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
                mode == 1 &&  // regulary
                <>
                    {/* select date range */}
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

                    {/* buttons for adding meetings for every day of the week */}
                    <View style={styles.input}>
                        {
                            WEEK_DAYS.map((value, dayIndex) => {
                                return (
                                    <View style={styles.row} key={`d${dayIndex}`}>
                                        <Text style={styles.label} pointerEvents="none">{value}:</Text>
                                        <View style={styles.chipHoursWEEK_DAYS}>
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
                                                                setInputErrors({ ...inputErrors, timesPerDay_regulary: (buf.filter(x => x.length == 0).length == 7) })  // every array is empty
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
                        <HelperText visible={inputErrors.timesPerDay_regulary} type="error" style={{ display: inputErrors.timesPerDay_regulary ? "flex" : "none" }}>Dodaj godziny zajęć.</HelperText>
                    </View>
                    <TimePickerModal
                        visible={showTimeWeekDay}
                        onConfirm={(hmin) => {
                            let buf = [...timesPerDay_regulary];
                            buf[pressedDayIndex].push(hmin)
                            setTimesPerDay_regulary(buf);
                            setShowTimeWeekDay(false);
                            setInputErrors({ ...inputErrors, timesPerDay_regulary: (buf.filter(x => x.length == 0).length == 7) })  // every array is empty
                        }}
                        onDismiss={() => setShowTimeWeekDay(false)}
                        label={`Wybierz godzinę (${WEEK_DAYS[pressedDayIndex]})`}
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