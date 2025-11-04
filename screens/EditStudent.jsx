import { Platform, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useState } from "react";
import { ToggleChipGroup } from "../components/toggleChipGroup";
import { AutocompleteTextInput } from '../components/autocompleteTextInput';
import { possibleForms, suggestedPlatforms } from "../constants/const";

export default function EditStudentScreen() {
    const theme = useTheme();
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
        },
    });

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [form, setForm] = useState(0);
    const [platform, setPlatform] = useState("");
    const [nick, setNick] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setLoading(false);
    }

    return (
        <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Imię:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Imię"
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Nazwisko:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Nazwisko"
                    value={surname}
                    onChangeText={setSurname}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Numer telefonu:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Numer telefonu"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label} pointerEvents="none">Email:</Text>
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
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
                        <AutocompleteTextInput
                            containerStyle={styles.input}
                            textInputStyle={styles.input}
                            label="Platforma"
                            suggestions={suggestedPlatforms}
                            value={platform}
                            onChangeText={setPlatform}
                            renderSuggestion={(item, index) => {
                                return (
                                    <Text key={index} style={{ borderWidth: 1, borderColor: theme.colors.outline, padding: 10 }}>{item}</Text>
                                );
                            }}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label} pointerEvents="none">Nick:</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.input}
                            label="Nick"
                            value={nick}
                            onChangeText={setNick}
                        />
                    </View>
                </>
            }


            {
                (form == 1 || form == 2) &&  // stationary or mixed
                <>
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
                        <Text style={styles.label} pointerEvents="none">Adres:</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.input}
                            label="Adres"
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>
                </>
            }
            <Button
                mode="contained"
                icon={"content-save"}
                onPress={handleSave}
                loading={loading}
                disabled={false}
                buttonColor={loading ? theme.colors.primaryDisabled : theme.colors.primary}
                textColor={loading ? theme.colors.onPrimaryDisabled : theme.colors.onPrimary}
            >
                Zapisz
            </Button>
        </ScrollView>
    );
}