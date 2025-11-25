import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Chip, Icon, Searchbar, Switch, Text, TextInput, useTheme } from "react-native-paper";
import { possibleForms, studentsOrder } from "../../constants/const";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import SelectDropdown from "react-native-select-dropdown";

export default function FilterStudentsScreen({ navigation, route }) {
    const theme = useTheme();
    const { setFilter, activeFilter } = route.params;

    const [order, setOrder] = useState(studentsOrder[0]);
    const [contain, setContain] = useState("");
    const [selectedForms, setSelectedForms] = useState([]);
    const [platform, setPlatform] = useState("");
    const [city, setCity] = useState("");
    const [incomes, setIncomes] = useState({ min: null, max: null });
    const [isSthUnpaid, setIsSthUnpaid] = useState(false);
    const [isSthPlanned, setIsSthPlanned] = useState(false);
    const [totalTime, setTotalTime] = useState({ min: null, max: null });

    const toggleForm = (val) => {
        let buff = [...selectedForms];
        if (buff.includes(val)) {
            buff = buff.filter(x => x != val);
        }
        else {
            buff.push(val);
        }
        setSelectedForms(buff);
    };

    useEffect(() => {
        setOrder(activeFilter.order);
        setContain(activeFilter.contain);
        setSelectedForms(activeFilter.forms);
        setPlatform(activeFilter.platform);
        setCity(activeFilter.city);
        setIncomes({
            min: activeFilter.incomesRange.min ?
                String(activeFilter.incomesRange.min) : "",
            max: activeFilter.incomesRange.max ?
                String(activeFilter.incomesRange.max) : ""
        });
        setIsSthUnpaid(activeFilter.unpaid);
        setIsSthPlanned(activeFilter.planned);
        setTotalTime({
            min: activeFilter.totalTimeRange.min ?
                String(activeFilter.totalTimeRange.min) : "",
            max: activeFilter.totalTimeRange.max ?
                String(activeFilter.totalTimeRange.max) : ""
        });
    }, [activeFilter]);


    const DropdownItem = (item, index, isSelected) => {
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
                <Text variant="bodyLarge">{order.label}</Text>
                <Icon source={isOpen ? "arrow-left-drop-circle-outline" : "arrow-down-drop-circle-outline"} size={20} />
            </View>
        );
    }


    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Sortuj:</Text>
                <SelectDropdown
                    data={studentsOrder}
                    onSelect={(sel) => setOrder(sel)}
                    renderButton={DropdownButton}
                    renderItem={DropdownItem}
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
                <Text style={styles.label} pointerEvents="none">Miejscowość:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Miejscowość"
                    value={city}
                    onChangeText={setCity}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Platforma:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Platforma"
                    value={platform}
                    onChangeText={setPlatform}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Zarobki:</Text>

                <View style={{ ...styles.input, flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                        mode="outlined"
                        style={{ flex: 1 }}
                        label="Od"
                        value={incomes.min ?? ""}
                        onChangeText={(val) => setIncomes({ ...incomes, min: val })}
                        keyboardType="decimal-pad"
                    />
                    <Text style={{ width: 50, textAlign: "center" }}>{"\u2014"}</Text>
                    <TextInput
                        mode="outlined"
                        style={{ flex: 1 }}
                        label="Do"
                        value={incomes.max ?? ""}
                        onChangeText={(val) => setIncomes({ ...incomes, max: val })}
                        keyboardType="decimal-pad"
                    />
                    <Text style={{ width: 30, textAlign: "center" }}>zł</Text>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Czas zajęć:</Text>
                <View style={{ ...styles.input, flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                        mode="outlined"
                        style={{ flex: 1 }}
                        label="Od"
                        value={totalTime.min ?? ""}
                        onChangeText={(val) => setTotalTime({ ...totalTime, min: val })}
                        keyboardType="decimal-pad"
                    />
                    <Text style={{ width: 50, textAlign: "center" }}>{"\u2014"}</Text>
                    <TextInput
                        mode="outlined"
                        style={{ flex: 1 }}
                        label="Do"
                        value={totalTime.max ?? ""}
                        onChangeText={(val) => setTotalTime({ ...totalTime, max: val })}
                        keyboardType="decimal-pad"
                    />
                    <Text style={{ width: 30, textAlign: "center" }}>h</Text>
                </View>
            </View>
            <View style={{ ...styles.row, gap: 30 }}>
                <View style={styles.switchInputContainer}>
                    <Text style={styles.label} pointerEvents="none">Niepłacone zajęcia:</Text>
                    <Switch
                        value={isSthUnpaid}
                        onValueChange={(val) => setIsSthUnpaid(val ? true : null)}
                    />
                </View>
                <View style={styles.switchInputContainer}>
                    <Text style={styles.label} pointerEvents="none">Zaplanowane zajęcia:</Text>
                    <Switch
                        value={isSthPlanned}
                        onValueChange={(val) => setIsSthPlanned(val ? true : null)}
                    />
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Forma:</Text>
                <View style={{ flex: 1, alignItems: "center" }}>

                    {
                        possibleForms.map(({ value, label, icon }) => {
                            const selected = selectedForms.includes(value);
                            return (
                                <Chip key={`chip${value}`}
                                    selected={selected}
                                    onPress={() => toggleForm(value)}
                                    style={{
                                        margin: 2,
                                        backgroundColor: selected ? theme.colors.primaryContainer : theme.colors.surfaceVariant
                                    }}
                                    icon={icon}
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
                            order: studentsOrder[0],
                            contain: null,
                            forms: [],
                            platform: null,
                            city: null,
                            incomesRange: { min: null, max: null },
                            unpaid: null,
                            planned: null,
                            totalTimeRange: { min: null, max: null }
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
                            active: !!(contain || selectedForms.length != 0 || platform ||
                                city || incomes.min || incomes.max ||
                                isSthPlanned || isSthUnpaid || totalTime.min ||
                                totalTime.max),
                            order: order,
                            contain: contain ?? null,
                            forms: selectedForms ?? null,
                            platform: platform ?? null,
                            city: city ?? null,
                            incomesRange: { min: incomes.min ? parseInt(incomes.min) : null, max: incomes.max ? parseInt(incomes.max) : null },
                            unpaid: isSthUnpaid ?? null,
                            planned: isSthPlanned ?? null,
                            totalTimeRange: { min: totalTime.min ? parseFloat(totalTime.min) : null, max: totalTime.max ? parseFloat(totalTime.max) : null },
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