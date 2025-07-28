import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Switch, Text } from "react-native-paper";
import { theme } from "../theme";
import { use, useState } from "react";
import { arrowDown } from "../functions/getUnicodeItems";
import SelectDropdown from "react-native-select-dropdown";

export default function SettingsMainScreen({ navigation }) {

    const languages = ["Polski", "English", "Espanol"];

    const [selectedLanguage, setSelectedLanguage] = useState("Polski");
    const [isDarkMode, setDarkMode] = useState(false);
    const [showMoney, setShowMoney]=useState(false);
    const [usePriceList, setUsePriceList] = useState(false);

    /**
     * TODO:
     * useEfect() for changing the language and for the darkmode and price list
     * price list screen
     */



    const switchDarkMode = () => {
        setDarkMode(!isDarkMode);
    }

    const switchUsagePriceList = () => {
        setUsePriceList(!usePriceList);
    }

    const switchShowMoney = () => {
        setShowMoney(!showMoney);
    }

    const renderDropdownButton = (sel, isOpen) => {
        return (
            <View style={[styles.optionValue]}>
                <Text style={styles.text}>{(selectedLanguage)}</Text>
                <Text style={styles.arrowDown}>{arrowDown()}</Text>
            </View>
        );
    };

    const renderDropdownItem = (item, index, isSelected) => {
        return (
            <View style={[
                styles.dropdownItem,
                isSelected && { backgroundColor: theme.light.primaryPale }
            ]}>
                <Text style={styles.text}>{item}</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>

                <View style={[theme.styles.section, styles.optionContainer]}>
                    <Text style={[styles.text, styles.label]}>Język</Text>
                    <SelectDropdown
                        data={languages}
                        onSelect={(sel, index) => {
                            setSelectedLanguage(sel);
                        }}
                        renderButton={renderDropdownButton}
                        renderItem={renderDropdownItem}
                        defaultValue={selectedLanguage}
                    />
                </View>
                <View style={[theme.styles.section, styles.optionContainer]}>
                    <Text style={[styles.text, styles.label]}>Waluta</Text>
                    <Text style={[styles.text, { textAlign: "center", textAlignVertical: "center", flex: 3 }]}>złoty</Text>
                </View>
                <View style={[theme.styles.section, styles.optionContainer]}>
                    <Text style={[styles.text, styles.label]}>Tryb ciemny</Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={switchDarkMode}
                        color={theme.light.primary}

                    />
                </View>
                <View style={[theme.styles.section, styles.optionContainer]}>
                    <Text style={[styles.text, styles.label]}>Pokaż zarobki</Text>
                    <Switch
                        value={showMoney}
                        onValueChange={switchShowMoney}
                        color={theme.light.primary}

                    />
                </View>
                <View style={[theme.styles.section, styles.optionContainer]}>
                    <Text style={[styles.text, styles.label]}>Pierwsza lekcja darmowa</Text>
                    <Switch
                        value={showMoney}
                        onValueChange={switchShowMoney}
                        color={theme.light.primary}

                    />
                </View>
                <View style={[theme.styles.section, { alignItems: "center" }]}>
                    <View style={styles.optionContainer}>

                        <Text style={[styles.text, styles.label]}>Zastosuj cennik</Text>
                        <Switch
                            value={usePriceList}
                            onValueChange={switchUsagePriceList}
                            color={theme.light.primary}
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
                </View>
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => { console.log("TODO") }}
                >
                    <Text style={styles.buttonLabel}>
                        Eksportuj bazę danych
                    </Text>
                </Button>
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => { console.log("TODO") }}
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
        position: "absolute",
        color: theme.light.text.black,
        right: 5
    },
    button: {
        backgroundColor: theme.light.primaryHalf,
        marginVertical: 5
    },
    buttonLabel: {
        color: theme.light.text.white,
        fontWeight: "bold",
        letterSpacing: 1
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
        flex: 0,
        justifyContent: "center",
    },
    optionValue: {
        flex: 3,
        alignItems: "center"
    },
    text: {
        color: theme.light.text.black,
        textAlignVertical: "center"
    }
});