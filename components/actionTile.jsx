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
    itemProperty = null,

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
            borderColor: active ? theme.colors.outline : theme.colors.surfaceDisabled,
            borderRadius: theme.roundness,
            minWidth: 110,
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
        onChangeText = () => { };
        onSelect = () => { };
    }

    return (
        <Card theme={theme} style={styles.card} onPress={onPress} onLongPress={onLongPress} mode="contained" disabled={!active}>
            <Card.Content style={styles.cardInnerContainer}>
                {
                    icon &&
                    <Icon source={icon} size={iconSize} />
                }
                <View style={styles.textAndArrowContainer}>
                    <Text variant="bodyLarge" style={{ color: active ? theme.colors.onSurfaceVariant : theme.colors.surfaceDisabled }}>{label}</Text>

                    {
                        type == "navigate" &&
                        <Icon source={"chevron-right"} size={24} color={active ? theme.colors.onSurfaceVariant : theme.colors.surfaceDisabled} />
                    }

                    {
                        type == "switch" &&
                        <Switch onChange={onPress} value={value} disabled={!active} />
                    }

                    {
                        type == "text" &&
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceDisabled }}>{text}</Text>
                    }

                    {
                        type == "select" &&
                        <SelectDropdown
                            disabled={!active}
                            data={selectData}
                            onSelect={onSelect}
                            disableAutoScroll
                            renderButton={(selected, isOpen) => {
                                return (
                                    <View style={styles.dropdownButton}>
                                        <Text style={{ color: active ? theme.colors.onSurfaceVariant : theme.colors.surfaceDisabled }}>
                                            {value ? (itemProperty ? value[itemProperty] : value) : selectData[0]}
                                        </Text>
                                        <Icon source={"chevron-down"} size={18} color={active ? theme.colors.outline : theme.colors.surfaceDisabled} />
                                    </View>
                                );
                            }}
                            renderItem={(item, index) => {
                                let isSelected = false;
                                if (itemProperty)
                                    isSelected = (item[itemProperty] == value[itemProperty])
                                else
                                    isSelected = (item == value);
                                return (
                                    <View style={[styles.dropdownItem, { backgroundColor: (isSelected ? theme.colors.surfaceVariant : theme.colors.surface) }]}>
                                        <Text theme={theme}>{itemProperty ? item[itemProperty] : item}</Text>
                                    </View>
                                );
                            }}
                        />
                    }

                    {
                        type == "text-input" &&
                        <View style={{ borderColor: theme.colors.outline, borderWidth: 1, borderRadius: theme.roundness }}>
                            <TextInput
                                value={value}
                                onChangeText={onChangeText}
                                mode="outlined"
                                disabled={!active}
                                outlineColor={theme.colors.outlineVariant}
                                placeholder={placeholder}
                                keyboardType={keyboardType}
                                style={{ backgroundColor: theme.colors.surfaceVariant, minWidth: 100 }}
                            />
                        </View>
                    }
                </View>
            </Card.Content>
        </Card>
    );
}