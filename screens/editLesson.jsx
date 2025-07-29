import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { theme } from "../theme";
import { useEffect, useState } from "react";
import { arrowDown } from "../functions/getUnicodeItems";
import SelectDropdown from "react-native-select-dropdown";
import { getByIDStudents, insertIntoStudents, updateIDStudents } from "../functions/database";

// possible tables name
const students = "students";
const lessons = "lessons";
const priceList = "price_list";

export default function EditLesson({ navigation, route }) {

    const { lessonID } = route.params;

    const possibleForms = [
        { id: 0, title: "Zdalnie" },
        { id: 1, title: "Stacjonarnie" },
        { id: 2, title: "Mieszana" },
    ];

    const lessonData={};

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phoneNum, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [form, setForm] = useState(possibleForms[0]);
    const [platform, setPlatform] = useState("");
    const [nick, setNick] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [houseNr, setHouseNr] = useState("");
    const [flatNr, setFlatNr] = useState("");

    let [haveISetTheData, setAreDataSet] = useState(false);

    useEffect(() => {
        if (!haveISetTheData && lessonID !== null && lessonData && Object.keys(lessonData).length > 0) {
            setName(lessonData.name || "");
            setSurname(lessonData.surname || "");
            setPhoneNumber(lessonData.phone || "");
            setEmail(lessonData.email || "");
            setForm(possibleForms[lessonData.form] || possibleForms[0]);
            setPlatform(lessonData.platform || "");
            setNick(lessonData.nick || "");
            setCity(lessonData.city || "");
            setStreet(lessonData.street || "");
            setHouseNr(lessonData.house_nr || "");
            setFlatNr(lessonData.flat_nr || "");
            setAreDataSet(true);
        }
    }, [lessonData, lessonID]);

    const renderDropdownButton = (sel, isOpen) => {
        return (
            <View style={[styles.optionValue, {borderRadius: 5, paddingVertical: 5, justifyContent: "center", borderColor: theme.light.border, borderWidth: 1}]}>
                <Text style={theme.styles.text}>{form.title}</Text>
                <Text style={styles.arrowDown}>{arrowDown()}</Text>
            </View>
        );
    };

    const renderDropdownItem = (item, index, isSelected) => {
        return (
            <View style={[
                styles.dropdownItem,
                { backgroundColor: (isSelected?theme.light.primaryPale: "white") }
            ]}>
                <Text style={theme.styles.text}>{item.title}</Text>
            </View>
        );
    }

    const handleSaveButton = () => {
        const newStudentData = {
            name: name,
            surname: surname,
            phone: phoneNum,
            email: email,
            form: form.id,
            platform: platform,
            nick: nick,
            city: city,
            street: street,
            house_nr: houseNr,
            flat_nr: flatNr
        };

        if (!lessonID) {
            insertIntoStudents(newStudentData);
        }
        else {
            updateIDStudents(lessonID, newStudentData);
        }
        navigation.pop();
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                <KeyboardAvoidingView>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Uczeń</Text>
                        <SelectDropdown
                            data={possibleForms}
                            onSelect={(sel, index) => setForm(sel)}
                            renderButton={renderDropdownButton}
                            renderItem={renderDropdownItem}
                            defaultValue={form}
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Przedmiot</Text>

                        {/* if there is price list you can use SelectDropdown */}

                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Przedmiot"
                            value={surname}
                            onChangeText={setSurname}
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
                            value={phoneNum}
                            onChangeText={setPhoneNumber}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Tryb dodawania</Text>
                        {/* rectangles like radiobuttons: add one, add every second/third ... day, add every monday */}
                        {/* if add one then just set one date but in the other case start date and the end date and show the set lessons at the bottom */}
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Poziom"
                            value={phoneNum}
                            onChangeText={setPhoneNumber}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Data i godzina</Text>
                        {/* open DatePicker mode date and when closed then open datePicker mode time */}
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Data i godzina"
                            value={email}
                            onChangeText={setEmail}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Temat</Text>
                        {/* possible iff you are in "add one" mode */}
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Temat"
                            value={email}
                            onChangeText={setEmail}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Czas trwania</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Czas trwania"
                            value={email}
                            onChangeText={setEmail}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Cena</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Cena"
                            value={email}
                            onChangeText={setEmail}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                        />
                        {/* <Button mode="outlined">Auto</Button> */}
                    </View>


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
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
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