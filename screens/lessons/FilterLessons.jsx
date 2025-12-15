import { useContext, useEffect, useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { Button, Chip, Icon, Searchbar, Switch, Text, TextInput, useTheme } from "react-native-paper";
import { lessonsOrder, possibleForms, possibleStatuses, studentsOrder } from "../../constants/const";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import SelectDropdown from "react-native-select-dropdown";
import { DatabaseContext } from "../../App";
import { AutocompleteTextInput } from "../../components/autocompleteTextInput";
import { DatePickerModal } from "react-native-paper-dates";
import { dateToDDMMYYYY } from "../../functions/misc/date";

export default function FilterLessonsScreen({ navigation, route }) {
    const theme = useTheme();
    const { setFilter, activeFilter } = route.params;
    const lessonStatuses = useColorScheme() == "dark" ? possibleStatuses.dark : possibleStatuses.light;
    const db = useContext(DatabaseContext);

    const [order, setOrder] = useState(lessonsOrder[0]);
    const [contain, setContain] = useState("");

    const [student, setStudent] = useState("");
    const [subject, setSubject] = useState("");
    const [level, setLevel] = useState("");
    const [dateRange, setDateRange] = useState({ since: new Date(0), to: new Date(0) });
    const [priceRange, setPriceRange] = useState({ min: null, max: null });
    const [durationRange, setDurationRange] = useState({ min: null, max: null });
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [studentData, setStudentData] = useState({});

    const toggleForm = (val) => {
        let buff = [...selectedStatuses];
        if (buff.includes(val)) {
            buff = buff.filter(x => x != val);
        }
        else {
            buff.push(val);
        }
        setSelectedStatuses(buff);
    };

    useEffect(() => {
        setOrder(activeFilter.order);
        setContain(activeFilter.contain);

        setSelectedStatuses(activeFilter.status);
        setStudent(activeFilter.student);
        setSubject(activeFilter.subject);
        setLevel(activeFilter.level);
        setDateRange({
            since: activeFilter.dateRange.since ? activeFilter.dateRange.since : new Date(0),
            to: activeFilter.dateRange.to ? activeFilter.dateRange.to : new Date(0)
        });
        setPriceRange({
            min: activeFilter.priceRange.min ?
                String(activeFilter.priceRange.min) : "",
            max: activeFilter.priceRange.max ?
                String(activeFilter.priceRange.max) : ""
        });
        setDurationRange({
            min: activeFilter.durationRange.min ?
                String(activeFilter.durationRange.min) : "",
            max: activeFilter.durationRange.max ?
                String(activeFilter.durationRange.max) : ""
        });
    }, [activeFilter]);

    const setStartDate = (value) => {
        setDateRange(prev => setDateRange({ ...prev, since: value }));
    };
    const setEndDate = (value) => {
        setDateRange(prev => setDateRange({ ...prev, to: value }));
    };

    const DropdownItemSort = (item, index, isSelected) => {
        isSelected = (item == order);
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
                <Text variant="bodyLarge">{item.label}</Text>
            </View>
        );
    }

    function DropdownButtonSort(selectedItem, isOpen) {
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
                <Text variant="bodyLarge">{order.label}</Text>
                <Icon source={isOpen ? "arrow-left-drop-circle-outline" : "arrow-down-drop-circle-outline"} size={20} />
            </View>
        );
    }

    const DropdownItemStudent = (item, index, isSelected) => {
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
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <Text variant="bodyLarge">{item.name}</Text>
                    <Text variant="bodyLarge">{item.surname}</Text>
                </View>
            </View>
        );
    }

    function DropdownButtonStudent(selectedItem, isOpen) {
        if (student) {
            selectedItem = db.get("students", student);
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

    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Sortuj:</Text>
                <SelectDropdown
                    data={lessonsOrder}
                    onSelect={(sel) => setOrder(sel)}
                    renderButton={DropdownButtonSort}
                    renderItem={DropdownItemSort}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Zawiera:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Zawiera"
                    value={contain}
                    onChangeText={setContain}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Uczeń:</Text>
                <SelectDropdown
                    data={db.students}
                    onSelect={(sel) => setStudent(sel.id)}
                    renderButton={DropdownButtonStudent}
                    renderItem={DropdownItemStudent}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Przedmiot:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Przedmiot"
                    value={subject}
                    onChangeText={setSubject}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Poziom:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Poziom"
                    value={level}
                    onChangeText={setLevel}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Data:</Text>

                <View style={{ ...styles.input, flexDirection: "row", alignItems: "center" }}>

                    <Button
                        mode="outlined"
                        style={{ flex: 1 }}
                        onPress={() => setShowCalendar(true)}
                        onLongPress={() => setDateRange({ since: new Date(0), to: new Date(0) })}
                    >
                        {(dateRange.since.getFullYear() == 1970 || dateRange.to.getFullYear() == 1970) ?
                            "Ustaw zakres" :
                            (dateToDDMMYYYY(dateRange.since) + " - " + dateToDDMMYYYY(dateRange.to))}
                    </Button>

                    {/* since */}
                    <DatePickerModal
                        locale="pl"
                        mode="range"
                        animationType="slide"
                        startDate={dateRange.since.getFullYear() == 1970 ? new Date() : dateRange.since}
                        endDate={dateRange.to.getFullYear() == 1970 ? new Date() : dateRange.to}
                        startWeekOnMonday={true}
                        visible={showCalendar}
                        onDismiss={() => setShowCalendar(false)}
                        onConfirm={({ startDate, endDate }) => {
                            setDateRange({ since: startDate, to: endDate });
                            setShowCalendar(false);
                        }}
                        label="Wybierz datę"
                        saveLabel="Zapisz"
                    />
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Cena:</Text>

                <View style={{ ...styles.input, flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                        mode="outlined"
                        style={{ flex: 1 }}
                        label="Od"
                        value={priceRange.min ?? ""}
                        onChangeText={(val) => setPriceRange({ ...priceRange, min: val })}
                        keyboardType="decimal-pad"
                    />
                    <Text style={{ width: 50, textAlign: "center" }}>{"\u2014"}</Text>
                    <TextInput
                        mode="outlined"
                        style={{ flex: 1 }}
                        label="Do"
                        value={priceRange.max ?? ""}
                        onChangeText={(val) => setPriceRange({ ...priceRange, max: val })}
                        keyboardType="decimal-pad"
                    />
                    <Text style={{ width: 30, textAlign: "center" }}>zł</Text>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Czas trwania:</Text>
                <View style={{ ...styles.input, flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                        mode="outlined"
                        style={{ flex: 1 }}
                        label="Od"
                        value={durationRange.min ?? ""}
                        onChangeText={(val) => setDurationRange({ ...durationRange, min: val })}
                        keyboardType="decimal-pad"
                    />
                    <Text style={{ width: 50, textAlign: "center" }}>{"\u2014"}</Text>
                    <TextInput
                        mode="outlined"
                        style={{ flex: 1 }}
                        label="Do"
                        value={durationRange.max ?? ""}
                        onChangeText={(val) => setDurationRange({ ...durationRange, max: val })}
                        keyboardType="decimal-pad"
                    />
                    <Text style={{ width: 30, textAlign: "center" }}>h</Text>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Status:</Text>
                <View style={{ flex: 1, alignItems: "center" }}>

                    {
                        lessonStatuses.map(({ value, label, colors }) => {
                            const selected = selectedStatuses.includes(value);
                            return (
                                <Chip key={`chip${value}`}
                                    selected={selected}
                                    onPress={() => toggleForm(value)}
                                    style={{
                                        margin: 2,
                                        backgroundColor: selected ? colors.background : theme.colors.surfaceVariant
                                    }}
                                    textStyle={{
                                        color: selected ? colors.onBackground : theme.colors.onSurfaceVariant
                                    }}
                                >
                                    {label}
                                </Chip>
                            );
                        })
                    }

                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <Button
                    mode="contained"
                    style={{ flex: 1 }}
                    onPress={() => {
                        setFilter({
                            active: false,
                            order: lessonsOrder[0],
                            contain: null,
                            student: null,
                            subject: null,
                            level: null,
                            dateRange: { since: null, to: null },
                            priceRange: { min: null, max: null },
                            durationRange: { min: null, max: null },
                            status: []
                        });
                        navigation.pop();
                    }}
                    icon={"filter-off"}
                >Wyczyść filtry</Button>
                <Button
                    mode="contained"
                    style={{ flex: 1 }}
                    onPress={() => {
                        setFilter({
                            active: !!(contain || selectedStatuses.length != 0 || student ||
                                subject || (dateRange.since.toISOString() != (new Date(0)).toISOString()) ||
                                (dateRange.to.toISOString() != (new Date(0)).toISOString()) ||
                                level || priceRange.min || priceRange.max ||
                                durationRange.max || durationRange.min),
                            order: order,
                            contain: contain ? contain : null,
                            student: student ? student : null,
                            subject: subject ? subject : null,
                            level: level ? level : null,
                            dateRange: { since: dateRange.since.getFullYear()==1970?null:dateRange.since, to: dateRange.to.getFullYear()==1970?null:dateRange.to },
                            priceRange: { min: priceRange.min ? parseInt(priceRange.min) : null, max: priceRange.max ? parseInt(priceRange.max) : null },
                            durationRange: { min: durationRange.min ? parseFloat(durationRange.min) : null, max: durationRange.max ? parseFloat(durationRange.max) : null },
                            status: selectedStatuses
                        });
                        navigation.pop();
                    }}
                    icon={"filter"}
                >Filtruj</Button>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        gap: 10,
        marginTop: 5,
        flexDirection: "row",
        marginBottom: 10
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10
    },
    label: {
        width: 100,
        fontSize: 15,
    },
    input: {
        flex: 1
    },
    switchInputContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    }
});