import { StyleSheet, View } from "react-native";
import { Card, Icon, Switch, Text, TextInput, useTheme } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";

const possibleTypes = [
    "navigate",  // small arrow on the right side
    "switch",  // on/off switch
    "select",  // dropdown list, default value is the first element
    "text",  // small text on the right side
    "text-input",  // there is way to write something
]

export default function ActionTile({
    label,
    type = "navigate",
    value = null,
    active = true,
    icon = null,
    iconSize = 24,

    keyboardType = "default",
    placeholder = null,

    text = null,

    selectData = null,

    onPress = () => { },
    onLongPress = () => { },
    onSelect = () => { },
    onChangeText = () => { },
}) {
    

    const theme = useTheme();
    const styles = StyleSheet.create({
        card: {
            borderColor: theme.colors.surfaceVariant,
            borderWidth: 1
        },
        cardInnerContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 15
        },
        dropdownItem: {
            padding: 7,
            borderBottomColor: theme.colors.surfaceVariant,
            borderBottomWidth: 1
        },
        dropdownButton: {
            borderWidth: 1,
            borderColor: theme.colors.outline,
            borderRadius: theme.roundness,
            minWidth: 100,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 5
        },
        textAndArrowContainer: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        },
    });

    if (!possibleTypes.includes(type)) {
        type = "navigate";
    }

    if (!active) {
        onPress = () => { };
        onLongPress = () => { };
    }

    return (
        <Card theme={theme} style={styles.card} onPress={onPress} onLongPress={onLongPress} mode="contained">
            <Card.Content style={styles.cardInnerContainer}>
                {
                    icon &&
                    <Icon source={icon} size={iconSize} />
                }
                <View style={styles.textAndArrowContainer}>
                    <Text variant="bodyLarge">{label}</Text>

                    {
                        type == "navigate" &&
                        <Icon source={"chevron-right"} size={24} />
                    }

                    {
                        type == "switch" &&
                        <Switch onChange={onPress} value={value} />
                    }

                    {
                        type == "text" &&
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceDisabled }}>{text}</Text>
                    }

                    {
                        type == "select" &&
                        <SelectDropdown
                            data={selectData}
                            onSelect={onSelect}
                            renderButton={(selected, isOpen) => {
                                return (
                                    <View style={styles.dropdownButton}>
                                        <Text>{value ? value : selectData[0]}</Text>
                                        <Icon source={"chevron-down"} size={18} color={theme.colors.outline} />
                                    </View>
                                );
                            }}
                            renderItem={(item, index) => {
                                let isSelected = (item == value)
                                return (
                                    <View style={[styles.dropdownItem, { backgroundColor: (isSelected ? theme.colors.surfaceVariant : theme.colors.surface) }]}>
                                        <Text theme={theme}>{item}</Text>
                                    </View>
                                );
                            }}
                        />
                    }

                    {
                        type == "text-input" &&
                        <TextInput
                            value={value}
                            onChangeText={onChangeText}
                            mode="outlined"
                            placeholder={placeholder}
                            keyboardType={keyboardType}
                            style={{ backgroundColor: theme.colors.surfaceVariant, minWidth: 100 }}
                        />
                    }
                </View>
            </Card.Content>
        </Card>
    );
}