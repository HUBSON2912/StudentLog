import { KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { AnimatedFAB, Button, Icon, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";
import { ToggleChipGroup } from "../../components/toggleChipGroup";
import { possibleLessonsAddMode, possibleStatuses } from "../../constants/const";
import { useContext, useState } from "react";
import { DatabaseContext } from "../../App";
import SelectDropdown from "react-native-select-dropdown";
import { AutocompleteTextInput } from "../../components/autocompleteTextInput";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { dateToDDMMYYYY, hourToHHMM } from "../../functions/misc/date";

let theme;

function DropdownButton(selectedItem, isOpen) {
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
                <Text variant="bodyLarge">{selectedItem.name} {selectedItem.surname}</Text>
            }
            {
                !selectedItem &&
                <Text variant="bodyLarge" style={styles.placeholder}>Wybierz ucznia</Text>
            }
            <Icon source={isOpen ? "arrow-left-drop-circle-outline" : "arrow-down-drop-circle-outline"} size={20} />
        </View>
    );
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
        }
    });

    return (
        <View style={styles.elementContainer}>
            <Text>{item.id}</Text>
            <Text variant="bodyLarge">{item.name} {item.surname}</Text>
        </View>
    );
}


export default function EditLessonScreen({ navigation }) {
    theme = useTheme();
    const db = useContext(DatabaseContext);
    const statuses = useColorScheme() == "dark" ? possibleStatuses.dark : possibleStatuses.light;

    const styles = StyleSheet.create({
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
        }
    });

    const [showCalendar_oneLess, setShowCalendar_oneLess] = useState(false);
    const [showTime_oneLess, setShowTime_oneLess] = useState(false);

    const students = db.students;

    const [selectedStudentID, setSelectedStudentID] = useState();
    const [subject, setSubject] = useState("");
    const [level, setLevel] = useState("");
    const [duration, setDuration] = useState("1");
    const [price, setPrice] = useState("");
    const [mode, setMode] = useState(0);
    const [date_oneLess, setDate_oneLess] = useState(new Date());
    const [hour_oneLess, setHour_oneLess] = useState({ hours: new Date().getHours(), minutes: new Date().getMinutes() });
    const [topic, setTopic] = useState("");
    const [status, setStatus] = useState(0);

    const [loading, setLoading] = useState(false);

    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={StatusBar.currentHeight + 5}>
            <ScrollView
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingHorizontal: 20 }}
            >
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
                <View style={styles.row}>
                    <Text style={styles.label} pointerEvents="none">Tryb:</Text>
                    <ToggleChipGroup
                        style={styles.chipContainer}
                        value={mode}
                        onSelect={setMode}
                        chips={possibleLessonsAddMode}
                    />
                </View>

                {/* button with text */}
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
                        visible={showCalendar_oneLess}
                        onDismiss={() => setShowCalendar_oneLess(false)}
                        onConfirm={({ date }) => { setDate_oneLess(date); setShowCalendar_oneLess(false) }}
                        label="Wybierz datę"
                        saveLabel="Zapisz"
                    />
                </View>

                {/* button with text */}
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


                <Button
                    mode="contained"
                    icon={"content-save"}
                    disabled={loading}
                    loading={loading}
                    onPress={() => {
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
                        }
                        db.insert("lessons", newLesson);
                        setLoading(false);
                        navigation.pop();
                    }}
                >
                    Zapisz
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}