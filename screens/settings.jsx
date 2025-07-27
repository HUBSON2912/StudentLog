import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Switch, Text } from "react-native-paper";
import { theme } from "../theme";
import { useState } from "react";
import { arrowDown } from "../functions/getUnicodeItems";
import SelectDropdown from "react-native-select-dropdown";

export default function SettingsScreen() {

    const languages = ["Polski", "English", "Espanol"];

    const [selectedLanguage, setSelectedLanguage] = useState("Polski");
    const [isDarkMode, setDarkMode] = useState(false);
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
                            console.log(sel, index);
                            setSelectedLanguage(sel);
                        }}
                        renderButton={renderDropdownButton}
                        renderItem={renderDropdownItem}
                        defaultValue={selectedLanguage}
                    />
                </View>
                <View style={[theme.styles.section, styles.optionContainer]}>
                    <Text style={[styles.text, styles.label]}>Tryb ciemny</Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={switchDarkMode}
                        color={theme.light.primary}

                    />
                </View>
                <View style={[theme.styles.section, { alignItems: "center" }]}>
                    <View style={styles.optionContainer}>

                        <Text style={[styles.text, styles.label]}>Używaj cennika</Text>
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
                        onPress={() => { console.log("TODO") }}
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
            <Button
                mode="contained"
                style={[styles.button, { backgroundColor: theme.light.primary }]}
            >
                <Text style={styles.buttonLabel}>
                    Zapisz
                </Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    arrowDown: {
        position: "absolute",
        color: theme.light.text.black,
        right: 0
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