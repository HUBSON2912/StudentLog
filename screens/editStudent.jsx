import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { theme } from "../theme";
import { useContext, useEffect, useState } from "react";
import { arrowDown } from "../functions/getUnicodeItems";
import SelectDropdown from "react-native-select-dropdown";
import { dropDBStudent, getByIDStudents, insertIntoStudents, updateIDStudents } from "../functions/dbStudents";
import Section from "../components/section";
import { getLanguage } from "../functions/settingsStorage";
import { DatabaseContext } from "../App";

const REMOTELY_FORM = 0;
const STATIONARY_FORM = 1;
const MIXED_FORM = 2;

export default function EditStudent({ navigation, route }) {

    const database = useContext(DatabaseContext);

    const { studentID } = route.params;

    const [studentData, setStudentData] = useState({});

    const [error, setError] = useState("");

    const [dictionary, setDictionary] = useState({});
    const [haveIsetTheDefFrom, setHaveISetTheDefForm] = useState(false);
    useEffect(() => {
        const fetchStudentData = async () => {
            if (studentID !== null) {
                setStudentData(database.getByID.student);
            }
            getLanguage().then((val) => {
                setDictionary(val.file);
            })
        };
        fetchStudentData();
    });

    const possibleForms = [
        { id: REMOTELY_FORM, title: dictionary.remotely },
        { id: STATIONARY_FORM, title: dictionary.stationary },
        { id: MIXED_FORM, title: dictionary.mixed },
    ];

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phoneNum, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [form, setForm] = useState({});
    const [platform, setPlatform] = useState("");
    const [nick, setNick] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [houseNr, setHouseNr] = useState("");
    const [flatNr, setFlatNr] = useState("");

    if (Object.keys(form).length < 1 && Object.keys(dictionary).length > 0) {
        setForm(possibleForms[0]);
    }


    let [done, setDone] = useState(false);

    useEffect(() => {
        if (!done && studentID !== null && studentData && Object.keys(studentData).length > 0 && Object.keys(dictionary).length > 0) {
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
            <View style={[
                styles.optionValue,
                {
                    borderRadius: 5,
                    paddingVertical: 5,
                    justifyContent: "center",
                    borderColor: theme.border,
                    borderWidth: 1,
                    backgroundColor: theme.backgroundInput
                }]}>
                <Text style={styles.text}>{form.title}</Text>
                <Text style={styles.arrowDown}>{arrowDown()}</Text>
            </View>
        );
    };

    const renderDropdownItem = (item, index, isSelected) => {
        return (
            <View style={[
                styles.dropdownItem,
                { backgroundColor: (isSelected ? theme.primaryPale : theme.backgroundSection) }
            ]}>
                <Text style={styles.text}>{item.title}</Text>
            </View>
        );
    }

    const handleSaveButton = () => {
        if (
            !name ||
            !surname ||
            !(phoneNum || email) ||
            !form
        ) {
            setError(dictionary.key_in_all_data);
            return;
        }

        if (form.id != STATIONARY_FORM) {
            if (
                !platform ||
                !nick
            ) {
                setError(dictionary.key_in_all_data);
                return;
            }
        }

        if (form.id != REMOTELY_FORM) {
            if (
                !city ||
                !houseNr
                // you can skip street and flat number
            ) {
                setError(dictionary.key_in_all_data);
                return;
            }
        }

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
            flat_nr: flatNr,
            money: !studentData.money ? 0 : studentData.money,
            lessons_amount: !studentData.lessons_amount ? 0 : studentData.lessons_amount
        };

        if (!studentID) {
            // insertIntoStudents(newStudentData);
            database.insert.student(newStudentData);
        }
        else {
            // updateIDStudents(studentID, newStudentData);
            database.update.student(studentID, newStudentData);
        }
        navigation.pop();
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                <KeyboardAvoidingView>
                    <Section style={styles.optionContainer}>
                        <Text style={[styles.text, styles.label]}>{dictionary.first_name}</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder={dictionary.first_name}
                            value={name}
                            onChangeText={setName}
                            activeOutlineColor={theme.primaryHalf}
                            contentStyle={styles.text}
                            textContentType="name"
                        />
                    </Section>
                    <Section style={styles.optionContainer}>
                        <Text style={[styles.text, styles.label]}>{dictionary.last_name}</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder={dictionary.last_name}
                            value={surname}
                            onChangeText={setSurname}
                            activeOutlineColor={theme.primaryHalf}
                            contentStyle={styles.text}
                            textContentType="familyName"
                        />
                    </Section>
                    <Section style={styles.optionContainer}>
                        <Text style={[styles.text, styles.label]}>{dictionary.phone_nr}</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder={dictionary.phone_nr}
                            value={phoneNum}
                            onChangeText={setPhoneNumber}
                            activeOutlineColor={theme.primaryHalf}
                            contentStyle={styles.text}
                            keyboardType="number-pad"
                        />
                    </Section>
                    <Section style={styles.optionContainer}>
                        <Text style={[styles.text, styles.label]}>{dictionary.email_address}</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder={dictionary.email_address}
                            value={email}
                            onChangeText={setEmail}
                            activeOutlineColor={theme.primaryHalf}
                            contentStyle={styles.text}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                        />
                    </Section>
                    <Section style={styles.optionContainer}>
                        <Text style={[styles.text, styles.label]}>{dictionary.form}</Text>
                        <SelectDropdown
                            data={possibleForms}
                            onSelect={(sel, index) => setForm(sel)}
                            renderButton={renderDropdownButton}
                            renderItem={renderDropdownItem}
                            defaultValue={form}
                        />
                    </Section>

                    {/* fix optimize fetching students */}

                    {form.id != STATIONARY_FORM &&   //if the form is setted as "stationary" then do not print the inputs for remotely teaching
                        <>
                            <Section style={styles.optionContainer}>
                                <Text style={[styles.text, styles.label]}>{dictionary.platform}</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder={dictionary.platform}
                                    value={platform}
                                    onChangeText={setPlatform}
                                    activeOutlineColor={theme.primaryHalf}
                                    contentStyle={styles.text}
                                />
                            </Section>
                            <Section style={styles.optionContainer}>
                                <Text style={[styles.text, styles.label]}>{dictionary.nickname}</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder={dictionary.nickname_placeholder}
                                    value={nick}
                                    onChangeText={setNick}
                                    activeOutlineColor={theme.primaryHalf}
                                    contentStyle={styles.text}
                                    textContentType="nickname"
                                />
                            </Section>
                        </>}


                    {form.id != REMOTELY_FORM &&   // address is printed if only form is NOT "remotely"
                        <>
                            <Section style={styles.optionContainer}>
                                <Text style={[styles.text, styles.label]}>{dictionary.city}</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder={dictionary.city}
                                    value={city}
                                    onChangeText={setCity}
                                    activeOutlineColor={theme.primaryHalf}
                                    contentStyle={styles.text}
                                />
                            </Section>
                            <Section style={styles.optionContainer}>
                                <Text style={[styles.text, styles.label]}>{dictionary.street}</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder={dictionary.street}
                                    value={street}
                                    onChangeText={setStreet}
                                    activeOutlineColor={theme.primaryHalf}
                                    contentStyle={styles.text}
                                />
                            </Section>
                            <Section style={styles.optionContainer}>
                                <Text style={[styles.text, styles.label]}>{dictionary.house_nr}</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder={dictionary.house_nr}
                                    value={houseNr}
                                    onChangeText={setHouseNr}
                                    activeOutlineColor={theme.primaryHalf}
                                    contentStyle={styles.text}
                                />
                            </Section>
                            <Section style={styles.optionContainer}>
                                <Text style={[styles.text, styles.label]}>{dictionary.flat_nr}</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder={dictionary.flat_nr}
                                    value={flatNr}
                                    onChangeText={setFlatNr}
                                    activeOutlineColor={theme.primaryHalf}
                                    contentStyle={styles.text}
                                />
                            </Section>
                        </>}
                </KeyboardAvoidingView>
                <Text style={styles.errorMessage}>{error}</Text>
                <View style={styles.buttonPanel}>
                    {/* cancel button */}
                    <Button
                        mode="contained"
                        style={[styles.button, { backgroundColor: theme.error }]}
                        onPress={() => navigation.pop()}
                    >
                        <Text style={styles.buttonLabel}>{dictionary.cancel}</Text>
                    </Button>


                    {/* save button */}
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={handleSaveButton}
                    >
                        <Text style={styles.buttonLabel}>{dictionary.save}</Text>
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    arrowDown: {
        position: "absolute",
        color: theme.text.default,
        right: 10
    },
    button: {
        backgroundColor: theme.primary,
        marginVertical: 5,
        flex: 1
    },
    buttonLabel: {
        color: theme.text.buttonLabel,
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
        backgroundColor: theme.background,
    },
    dropdownItem: {
        backgroundColor: "red",
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomColor: theme.text.gray,
        borderBottomWidth: 1
    },
    errorMessage: {
        color: theme.error,
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
    text: {
        color: theme.text.default,
        textAlignVertical: "center",
        fontSize: 16,
    },
    textInput: {
        flex: 4,
        backgroundColor: theme.background,
    }
});