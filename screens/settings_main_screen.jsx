import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Switch, Text } from "react-native-paper";
import { theme } from "../theme";
import { useEffect, useState } from "react";
import { arrowDown } from "../functions/getUnicodeItems";
import SelectDropdown from "react-native-select-dropdown";
import { currencies, getCurrencySymbol } from "../functions/currency";
import { getCurrency, getShowAmountOfStudents, getShowIncomes, setCurrency, setShowAmountOfStudents, setShowIncomes } from "../functions/settingsStorage";
import Section from "../components/section";

export default function SettingsMainScreen({ navigation }) {

    const languages = ["Polski", "English"];

    const [selectedLanguage, setSelectedLanguage] = useState("Polski");
    const [showMoney, setShowMoney] = useState(false);
    const [showAmountOfStudents, setShowAmountOfStudentsLocal] = useState(false);
    const [usePriceList, setUsePriceList] = useState(false);

    /** TODO:
     * useEfect() for changing the language and price list
     * or show message like "You have to re-open your app"
     * export and import buttons
     * 
     * 
     */



    const switchUsagePriceList = () => {
        setUsePriceList(!usePriceList);
    }

    const switchShowMoney = () => {
        setShowIncomes(!showMoney);
        setShowMoney(!showMoney);
    }

    const switchShowAmountOfStudents = () => {
        setShowAmountOfStudents(!showAmountOfStudents);
        setShowAmountOfStudentsLocal(!showAmountOfStudents);
    }

    const renderLanguageButton = (sel, isOpen) => {
        return (
            <View style={[styles.optionValue, styles.dropdownButton]}>
                <Text style={[styles.text, { flex: 1, textAlign: "center" }]}>{(selectedLanguage)}</Text>
                <Text style={styles.arrowDown}>{arrowDown()}</Text>
            </View>
        );
    };

    const renderLanguageItem = (item, index, isSelected) => {
        return (
            <View style={[
                styles.dropdownItem,
                isSelected && { backgroundColor: theme.primaryPale },
                !isSelected && { backgroundColor: theme.backgroundInput },
            ]}>
                <Text style={styles.text}>{item}</Text>
            </View>
        );
    }

    // default: PLN
    const [currency, setCurrencyLocal] = useState({});
    useEffect(() => {
        const fetchSavedSettings = async () => {
            setCurrencyLocal(await getCurrency());
            setShowMoney(await getShowIncomes());
            setShowAmountOfStudentsLocal(await getShowAmountOfStudents());
        };
        fetchSavedSettings();
    })

    const renderCurrencyButton = (sel, isOpen) => {
        return (
            <View style={[styles.optionValue, styles.dropdownButton]}>
                <Text style={[styles.text, { flex: 1, textAlign: "center" }]}>{currency.__text} ({getCurrencySymbol(currency._code)})</Text>
                <Text style={styles.arrowDown}>{arrowDown()}</Text>
            </View>
        );
    }
    const renderCurrencyItem = (item, index, isSelected) => {
        return (
            <View style={[
                styles.dropdownItem,
                isSelected && { backgroundColor: theme.primaryPale },
                !isSelected && { backgroundColor: theme.backgroundInput }
            ]}>
                <Text style={[styles.text, { textAlign: "center" }]}>{item.__text} ({getCurrencySymbol(item._code)})</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                <Section style={styles.optionContainer}>
                    <Text style={[styles.text, styles.label]}>Język</Text>
                    <SelectDropdown
                        data={languages}
                        onSelect={(sel, index) => {
                            setSelectedLanguage(sel);
                        }}
                        renderButton={renderLanguageButton}
                        renderItem={renderLanguageItem}
                        defaultValue={selectedLanguage}
                    />

                </Section>

                <Section style={styles.optionContainer}>
                    <Text style={[styles.text, styles.label]}>Waluta</Text>
                    <SelectDropdown
                        data={currencies}
                        onSelect={(sel) => {
                            setCurrencyLocal(sel);
                            setCurrency(sel);
                        }}
                        renderButton={renderCurrencyButton}
                        renderItem={renderCurrencyItem}
                        defaultValue={currency}
                        dropdownStyle={{ backgroundColor: theme.backgroundInput }}
                        disableAutoScroll
                        search={true}
                        searchInputStyle={{ backgroundColor: theme.backgroundInput, borderBottomWidth: 3, borderBottomColor: theme.text.gray }}
                        searchInputTxtColor={theme.text.default}
                        searchPlaceHolder="Szukaj"
                    />
                </Section>
                <Section style={styles.optionContainer}>
                    <Text style={[styles.text, styles.label]}>Pokaż zarobki</Text>
                    <Switch
                        value={showMoney}
                        onValueChange={switchShowMoney}
                        color={theme.primary}
                    />
                </Section>
                <Section style={styles.optionContainer}>
                    <Text style={[styles.text, styles.label]}>Pokaż ilość uczniów</Text>
                    <Switch
                        value={showAmountOfStudents}
                        onValueChange={switchShowAmountOfStudents}
                        color={theme.primary}
                    />
                </Section>
                <Section style={{ alignItems: "center" }}>
                    <View style={styles.optionContainer}>

                        <Text style={[styles.text, styles.label]}>Zastosuj cennik</Text>
                        <Switch
                            value={usePriceList}
                            onValueChange={switchUsagePriceList}
                            color={theme.primary}
                        />


                    </View>
                    <View style={[styles.optionContainer, { display: (usePriceList ? "flex" : "none") }]}>
                        {/* todo change into "discount for the first lesson [%] defaultly 100%" */}
                        <Text style={[styles.text, styles.label]}>Pierwsza lekcja darmowa</Text>
                        <Switch
                            value={showMoney}
                            onValueChange={switchShowMoney}
                            color={theme.primary}

                        />
                    </View>
                    <Button
                        mode="contained"
                        style={[
                            styles.button,
                            { display: (usePriceList ? "flex" : "none") }
                        ]}
                        onPress={() => { navigation.navigate("PriceList") }}
                    >
                        <Text style={styles.buttonLabel}>
                            Edytuj cennik
                        </Text>
                    </Button>
                </Section>
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => { /* TODO export */ }}
                >
                    <Text style={styles.buttonLabel}>
                        Eksportuj bazę danych
                    </Text>
                </Button>
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => { /* TODO import */ }}
                >
                    <Text style={styles.buttonLabel}>
                        Importuj bazę danych
                    </Text>
                </Button>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    arrowDown: {
        color: theme.text.default,
    },
    button: {
        backgroundColor: theme.primaryHalf,
        marginVertical: 5
    },
    buttonLabel: {
        color: theme.text.buttonLabel,
        fontWeight: "bold",
        letterSpacing: 1
    },
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    dropdownButton: {
        borderRadius: 10,
        borderColor: theme.border,
        borderWidth: 1,
        padding: 5,
        alignItems: "center",
        flexDirection: "row"
    },
    dropdownItem: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomColor: theme.text.gray,
        borderBottomWidth: 1
    },
    label: {
        flex: 2
    },
    optionContainer: {
        flexDirection: "row",
        flex: 0,
        justifyContent: "center",
    },
    optionValue: {
        flex: 3,
        alignItems: "center"
    },
    text: {
        color: theme.text.default,
        textAlignVertical: "center",
        fontSize: 16,
    }
});