import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";
import { theme } from "../theme";
import { useContext, useEffect, useState } from "react";
import { arrowDown } from "../functions/getUnicodeItems";
import SelectDropdown from "react-native-select-dropdown";
import { currencies, getCurrencySymbol } from "../functions/currency";
import { getCurrency, getDiscountForTheFirstLesson, getLanguage, getShowAmountOfStudents, getShowIncomes, getUsePriceList, setCurrency, setDiscountForTheFirstLesson, setLanguage, setShowAmountOfStudents, setShowIncomes, setUsePriceList } from "../functions/settingsStorage";
import Section from "../components/section";
import Loading from "../components/loading";

export default function SettingsMainScreen({ navigation }) {

    const languages = [
        {
            file: require("../lang/pl-pl.json"),
            name: "Polski"
        },
        {
            file: require("../lang/en-uk.json"),
            name: "English"
        }];

    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const [showMoney, setShowMoney] = useState(false);
    const [showAmountOfStudents, setShowAmountOfStudentsLocal] = useState(false);
    const [usePriceList, setUsePriceListLocal] = useState(false);
    const [discount, setDiscount] = useState("100");

    const [dictionary, setDictionary] = useState({});
    /** TODO:
     * export and import buttons
     * 
     * 
     */



    const switchUsagePriceList = () => {
        setUsePriceList(!usePriceList);
        setUsePriceListLocal(!usePriceList);
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
                <Text style={[styles.text, { flex: 1, textAlign: "center" }]}>{(selectedLanguage.name)}</Text>
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
                <Text style={styles.text}>{item.name}</Text>
            </View>
        );
    }

    // default: PLN
    const [currency, setCurrencyLocal] = useState({});

    const [allDataFetched, setIfAllDataFetched] = useState(false);

    useEffect(() => {
        const fetchSavedSettings = async () => {
            setCurrencyLocal(await getCurrency());
            setShowMoney(await getShowIncomes());
            setShowAmountOfStudentsLocal(await getShowAmountOfStudents());
            setSelectedLanguage(await getLanguage());
            setDiscount(String(await getDiscountForTheFirstLesson()));
            setUsePriceListLocal(await getUsePriceList());
            setDictionary((await getLanguage()).file);

            setIfAllDataFetched(true);
        };
        fetchSavedSettings();
    }, []);

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
        <>
            {!allDataFetched &&
                <View style={{ justifyContent: "center", flex: 1 }}>
                    <Loading />
                </View>
            }
            {
                allDataFetched &&
                <View style={styles.container}>
                    <ScrollView style={styles.container}>

                        <Section onPressBehaviour={"none"} style={styles.optionContainer}>
                            <Text style={[styles.text, styles.label]}>{dictionary.language}</Text>
                            <SelectDropdown
                                data={languages}
                                onSelect={(sel, index) => {
                                    setSelectedLanguage(sel);
                                    setLanguage(sel);
                                }}
                                renderButton={renderLanguageButton}
                                renderItem={renderLanguageItem}
                                defaultValue={selectedLanguage}
                            />

                        </Section>

                        <Section onPressBehaviour={"none"} style={styles.optionContainer}>
                            <Text style={[styles.text, styles.label]}>{dictionary.currency}</Text>
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
                        <Section onPressBehaviour={"none"} style={styles.optionContainer}>
                            <Text style={[styles.text, styles.label]}>{dictionary.show_incomes}</Text>
                            <Switch
                                value={showMoney}
                                onValueChange={switchShowMoney}
                                color={theme.primary}
                            />
                        </Section>
                        <Section onPressBehaviour={"none"} style={styles.optionContainer}>
                            <Text style={[styles.text, styles.label]}>{dictionary.show_amount_of_students}</Text>
                            <Switch
                                value={showAmountOfStudents}
                                onValueChange={switchShowAmountOfStudents}
                                color={theme.primary}
                            />
                        </Section>
                        <Section onPressBehaviour={"none"} style={{ alignItems: "center" }}>
                            <View style={styles.optionContainer}>

                                <Text style={[styles.text, styles.label]}>{dictionary.use_price_list}</Text>
                                <Switch
                                    value={usePriceList}
                                    onValueChange={switchUsagePriceList}
                                    color={theme.primary}
                                />


                            </View>
                            <View style={[styles.optionContainer, { display: (usePriceList ? "flex" : "none") }]}>
                                <Text style={[styles.text, styles.label]}>{dictionary.discount_for_the_first_lesson} [%]</Text>
                                <TextInput
                                    mode="outlined"
                                    style={styles.textInput}
                                    placeholder={"100%"}
                                    value={discount}
                                    onChangeText={(val) => {
                                        setDiscount(val);
                                        setDiscountForTheFirstLesson(parseInt(val));
                                    }}
                                    activeOutlineColor={theme.primaryHalf}
                                    contentStyle={styles.text}
                                    keyboardType="number-pad"
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
                                    {dictionary.edit_price_list}
                                </Text>
                            </Button>
                        </Section>
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={() => { /* TODO export */ }}
                        >
                            <Text style={styles.buttonLabel}>
                                {dictionary.export_database}
                            </Text>
                        </Button>
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={() => { /* TODO import */ }}
                        >
                            <Text style={styles.buttonLabel}>
                                {dictionary.import_database}
                            </Text>
                        </Button>
                    </ScrollView>
                </View>
            }
        </>
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
    },
    textInput: {
        backgroundColor: theme.background,
    },
});