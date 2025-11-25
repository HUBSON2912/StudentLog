import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput, useTheme } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { ToggleChipGroup } from "../../components/toggleChipGroup";
import { AutocompleteTextInput } from '../../components/autocompleteTextInput';
import { possibleForms, remotelyForm, stationaryForm, suggestedPlatforms } from "../../constants/const";
import { DatabaseContext } from "../../App";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

export default function EditStudentScreen({ navigation, route }) {
    const theme = useTheme();
    const db = useContext(DatabaseContext);
    const { studentID } = route.params ?? { studentID: null };

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [form, setForm] = useState(0);
    const [platform, setPlatform] = useState("");
    const [nick, setNick] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");


    useEffect(() => {
        if (!studentID) {
            return;
        }

        navigation.setOptions({ title: `Edytuj ucznia (${studentID})` })

        const studentData = db.get("students", studentID);
        setName(studentData.name);
        setSurname(studentData.surname);
        setPhoneNumber(studentData.phone);
        setEmail(studentData.email);
        setForm(studentData.form);
        setPlatform(studentData.platform);
        setNick(studentData.nick);
        setCity(studentData.city);
        setAddress(studentData.address);
    }, [])

    const [loading, setLoading] = useState(false);


    // input errors
    const [inputErrors, setInputErrors] = useState({
        name: false,
        surname: false,
        phone: false,
        platform: false,
        nick: false,
        city: false,
        address: false
    });

    const areInputsGood = async () => {
        let errors = {
            name: !name,
            surname: !surname,
            phone: !phoneNumber,
        };
        if (remotelyForm.includes(form)) {
            errors.platform = !platform;
            errors.nick = !nick;
        }
        if (stationaryForm.includes(form)) {
            errors.city = !city;
            errors.address = !address;
        }

        setInputErrors({ ...inputErrors, ...errors });

        if (Object.values(errors).includes(true)) {
            return false;
        }
        return true;
    };

    const handleSaveInsert = async () => {
        const inpErr = await areInputsGood();
        if (!inpErr) {
            return;
        }
        setLoading(true);
        const newStudent = {
            name: name,
            surname: surname,
            phone: phoneNumber,
            email: email,
            form: form,
            platform: platform,
            nick: nick,
            city: city,
            address: address
        };
        await db.insert("students", newStudent);
        setLoading(false);
        navigation.pop();
    };

    const handleSaveUpdate = async () => {
        const inpErr = await areInputsGood();
        if (!inpErr) {
            return;
        }
        setLoading(true);
        const newStudent = {
            name: name,
            surname: surname,
            phone: phoneNumber,
            email: email,
            form: form,
            platform: platform,
            nick: nick,
            city: city,
            address: address
        };
        await db.update("students", newStudent, studentID);
        setLoading(false);
        navigation.pop();
    };

    return (
        <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Imię:</Text>
                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        label="Imię"
                        value={name}
                        onChangeText={(value) => { setName(value); setInputErrors({ ...inputErrors, name: !value }); }}
                        error={inputErrors.name}
                    />
                    <HelperText visible={inputErrors.name} type="error" style={{ display: inputErrors.name ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Nazwisko:</Text>
                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        label="Nazwisko"
                        value={surname}
                        onChangeText={(value) => { setSurname(value); setInputErrors({ ...inputErrors, surname: !value }); }}
                        error={inputErrors.surname}
                    />
                    <HelperText visible={inputErrors.surname} type="error" style={{ display: inputErrors.surname ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Numer telefonu:</Text>
                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        label="Numer telefonu"
                        value={phoneNumber}
                        onChangeText={(value) => { setPhoneNumber(value); setInputErrors({ ...inputErrors, phone: !value }); }}
                        error={inputErrors.phone}
                        keyboardType="phone-pad"
                    />
                    <HelperText visible={inputErrors.phone} type="error" style={{ display: inputErrors.phone ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Email:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Forma:</Text>
                <ToggleChipGroup
                    style={styles.chipContainer}
                    value={form}
                    onSelect={setForm}
                    chips={possibleForms}
                />
            </View>

            {
                (form == 0 || form == 2) &&  // if remotely or mixed
                <>
                    <View style={styles.row}>
                        <Text style={styles.label} pointerEvents="none">Platforma:</Text>
                        <View style={styles.input}>
                            <AutocompleteTextInput
                                containerStyle={styles.input}
                                textInputStyle={styles.input}
                                label="Platforma"
                                suggestions={suggestedPlatforms}
                                value={platform}
                                onChangeText={(value) => { setPlatform(value); setInputErrors({ ...inputErrors, platform: !value }); }}
                                error={inputErrors.platform}
                                renderSuggestion={(item, index) => {
                                    return (
                                        <Text key={index} style={{ borderWidth: 1, borderColor: theme.colors.outline, padding: 10 }}>{item}</Text>
                                    );
                                }}
                            />
                            <HelperText visible={inputErrors.platform} type="error" style={{ display: inputErrors.platform ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label} pointerEvents="none">Nick:</Text>
                        <View style={styles.input}>
                            <TextInput
                                mode="outlined"
                                style={styles.input}
                                label="Nick"
                                value={nick}
                                onChangeText={(value) => { setNick(value); setInputErrors({ ...inputErrors, nick: !value }); }}
                                error={inputErrors.nick}
                            />
                            <HelperText visible={inputErrors.nick} type="error" style={{ display: inputErrors.nick ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                        </View>
                    </View>
                </>
            }


            {
                (form == 1 || form == 2) &&  // stationary or mixed
                <>
                    <View style={styles.row}>
                        <Text style={styles.label} pointerEvents="none">Miejscowość:</Text>
                        <View style={styles.input}>
                            <TextInput
                                mode="outlined"
                                style={styles.input}
                                label="Miejscowość"
                                value={city}
                                onChangeText={(value) => { setCity(value); setInputErrors({ ...inputErrors, city: !value }); }}
                                error={inputErrors.city}
                            />
                            <HelperText visible={inputErrors.city} type="error" style={{ display: inputErrors.city ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label} pointerEvents="none">Adres:</Text>
                        <View style={styles.input}>
                            <TextInput
                                mode="outlined"
                                style={styles.input}
                                label="Adres"
                                value={address}
                                onChangeText={(value) => { setAddress(value); setInputErrors({ ...inputErrors, address: !value }); }}
                                error={inputErrors.address}
                            />
                            <HelperText visible={inputErrors.address} type="error" style={{ display: inputErrors.address ? "flex" : "none" }}>To pole jest wymagane.</HelperText>
                        </View>
                    </View>
                </>
            }
            <Button
                mode="contained"
                icon={"content-save"}
                onPress={studentID ? handleSaveUpdate : handleSaveInsert}
                loading={loading}
                disabled={loading}
                buttonColor={loading ? theme.colors.primaryDisabled : theme.colors.primary}
                textColor={loading ? theme.colors.onPrimaryDisabled : theme.colors.onPrimary}
                style={{ marginBottom: 10 }}
            >
                Zapisz
            </Button>
        </KeyboardAwareScrollView>
    );
}

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
});