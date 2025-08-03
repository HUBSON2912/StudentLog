import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { theme } from "../theme";
import { useEffect, useState } from "react";
import { arrowDown } from "../functions/getUnicodeItems";
import SelectDropdown from "react-native-select-dropdown";
import { getByIDStudents, insertIntoStudents, updateIDStudents } from "../functions/dbStudents";

// possible tables name
const students = "students";
const lessons = "lessons";
const priceList = "price_list";

export default function EditStudent({ navigation, route }) {

    const { studentID } = route.params;

    let studentData = {};

    if (studentID !== null)
        studentData = getByIDStudents(studentID);

    const possibleForms = [
        { id: 0, title: "Zdalnie" },
        { id: 1, title: "Stacjonarnie" },
        { id: 2, title: "Mieszana" },
    ];

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

    let [done, setDone] = useState(false);

    useEffect(() => {
        if (!done && studentID !== null && studentData && Object.keys(studentData).length > 0) {
            setName(studentData.name || "");
            setSurname(studentData.surname || "");
            setPhoneNumber(studentData.phone || "");
            setEmail(studentData.email || "");
            setForm(possibleForms[studentData.form] || possibleForms[0]);
            setPlatform(studentData.platform || "");
            setNick(studentData.nick || "");
            setCity(studentData.city || "");
            setStreet(studentData.street || "");
            setHouseNr(studentData.house_nr || "");
            setFlatNr(studentData.flat_nr || "");
            setDone(true);
        }
    }, [studentData, studentID]);

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

        if (!studentID) {
            insertIntoStudents(newStudentData);
        }
        else {
            updateIDStudents(studentID, newStudentData);
        }
        navigation.pop();
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                <KeyboardAvoidingView>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Imię</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Imię"
                            value={name}
                            onChangeText={setName}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            textContentType="name"
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Nazwisko</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Nazwisko"
                            value={surname}
                            onChangeText={setSurname}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            textContentType="familyName"
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Numer telefonu</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Numer telefonu"
                            value={phoneNum}
                            onChangeText={setPhoneNumber}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Adres email</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder="Adres email"
                            value={email}
                            onChangeText={setEmail}
                            activeOutlineColor={theme.light.primaryHalf}
                            contentStyle={theme.styles.text}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                        />
                    </View>
                    <View style={[theme.styles.section, styles.optionContainer]}>
                        <Text style={[theme.styles.text, styles.label]}>Forma</Text>
                        <SelectDropdown
                            data={possibleForms}
                            onSelect={(sel, index) => setForm(sel)}
                            renderButton={renderDropdownButton}
                            renderItem={renderDropdownItem}
                            defaultValue={form}
                        />
                    </View>


                    {form.id != 1 &&   //if the form is setted as "stationary" then do not print the inputs for remotely teaching
                        <>
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Platforma</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder="Platforma"
                                    value={platform}
                                    onChangeText={setPlatform}
                                    activeOutlineColor={theme.light.primaryHalf}
                                    contentStyle={theme.styles.text}
                                />
                            </View>
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Nazwa użytkownika</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder="Nick"
                                    value={nick}
                                    onChangeText={setNick}
                                    activeOutlineColor={theme.light.primaryHalf}
                                    contentStyle={theme.styles.text}
                                    textContentType="nickname"
                                />
                            </View>
                        </>}


                    {form.id != 0 &&   // adress is printed if only form is NOT "remotely"
                        <>
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Miejscowość</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder="Miejscowość"
                                    value={city}
                                    onChangeText={setCity}
                                    activeOutlineColor={theme.light.primaryHalf}
                                    contentStyle={theme.styles.text}
                                />
                            </View>
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Ulica</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder="Ulica"
                                    value={street}
                                    onChangeText={setStreet}
                                    activeOutlineColor={theme.light.primaryHalf}
                                    contentStyle={theme.styles.text}
                                />
                            </View>
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Numer domu</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder="Numer domu"
                                    value={houseNr}
                                    onChangeText={setHouseNr}
                                    activeOutlineColor={theme.light.primaryHalf}
                                    contentStyle={theme.styles.text}
                                />
                            </View>
                            <View style={[theme.styles.section, styles.optionContainer]}>
                                <Text style={[theme.styles.text, styles.label]}>Numer mieszkania</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder="Numer mieszkania"
                                    value={flatNr}
                                    onChangeText={setFlatNr}
                                    activeOutlineColor={theme.light.primaryHalf}
                                    contentStyle={theme.styles.text}
                                />
                            </View>
                        </>}
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