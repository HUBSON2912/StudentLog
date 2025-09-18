import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { theme } from "../theme";
import { useContext, useEffect, useState } from "react";
import Section from "../components/section";
import { DatabaseContext } from "../App";

const REMOTELY_FORM = 0;
const STATIONARY_FORM = 1;
const MIXED_FORM = 2;

export default function EditPriceList({ navigation, route }) {
    // fix: dictionary.[...] not just fixed text
    const database = useContext(DatabaseContext);

    const [subject, setSubject] = useState("");
    const [level, setLevel] = useState("");
    const [price, setPrice] = useState("");
    const [error, setError] = useState("");

    const handleSaveButton = () => {
        const isDuplicate = database.priceList.filter((x) => x.subject == subject && x.level == level);
        if (!subject || !level || !price)
            setError("Uzupełnij wszystkie dane");
        else if (isDuplicate.length != 0) {
            setError("Już istnieje taki wpis");
        }
        else {
            const newData = {
                subject: subject,
                level: level,
                price: parseInt(price)
            }
            database.insert.priceList(newData);
            navigation.pop();
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                <KeyboardAvoidingView>
                    <Section style={styles.optionContainer}>
                        <Text style={[styles.text, styles.label]}>Przedmiot</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder={"Przedmiot"}
                            value={subject}
                            onChangeText={setSubject}
                            activeOutlineColor={theme.primaryHalf}
                            contentStyle={styles.text}
                        />
                    </Section>
                    <Section style={styles.optionContainer}>
                        <Text style={[styles.text, styles.label]}>Poziom</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder={"Poziom"}
                            value={level}
                            onChangeText={setLevel}
                            activeOutlineColor={theme.primaryHalf}
                            contentStyle={styles.text}
                        />
                    </Section>
                    <Section style={styles.optionContainer}>
                        <Text style={[styles.text, styles.label]}>Cena</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.textInput}
                            placeholder={"Cena"}
                            value={price}
                            onChangeText={setPrice}
                            activeOutlineColor={theme.primaryHalf}
                            contentStyle={styles.text}
                        />
                    </Section>
                </KeyboardAvoidingView>
                <Text style={styles.errorMessage}>{error}</Text>
                <View style={styles.buttonPanel}>
                    {/* cancel button */}
                    <Button
                        mode="contained"
                        style={[styles.button, { backgroundColor: theme.error }]}
                        onPress={() => navigation.pop()}
                    >
                        <Text style={styles.buttonLabel}>{"Anuluj"}</Text>
                    </Button>


                    {/* save button */}
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={handleSaveButton}
                    >
                        <Text style={styles.buttonLabel}>{"Zapisz"}</Text>
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