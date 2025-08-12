import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Checkbox, Text } from "react-native-paper";
import { getWeekDayName } from "../functions/date";
import { theme } from "../theme";

export default function CheckboxDayTime({ dayIndex = 0, onSelect}) {
    const [checked, setChecked] = useState(false);

    const handleCheck = () => {
        setChecked(!checked);
        onSelect(dayIndex);
    };

    return (
        <View style={styles.container}>
            <View>
                <Checkbox
                    status={checked ? "checked" : "unchecked"}
                    onPress={handleCheck}
                />
            </View>
            <TouchableOpacity
                onPress={handleCheck}
                style={{ flex: 1, alignItems: "center" }}
            >
                <Text style={[theme.styles.text]}>
                    {getWeekDayName(dayIndex)}
                </Text>
            </TouchableOpacity>
            <Button
                disabled={!checked}
            >
                12:40
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center"
    }
});