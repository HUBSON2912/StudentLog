import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Checkbox, Text } from "react-native-paper";
import { getWeekDayName } from "../functions/date";
import { theme } from "../theme";
import DatePicker from "react-native-date-picker";

export default function CheckboxDayTime({ dayIndex = 0, onSelect }) {
    const [checked, setChecked] = useState(false);

    const [time, setTime] = useState(new Date());
    const [isPickerOpen, setPickerVisiability] = useState(false);

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
                    color={theme.light.primary}
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
                onPress={()=>{
                    setPickerVisiability(true);
                }}
                textColor={theme.light.primaryHalf}
            >
                {time.getHours()}:{String(time.getMinutes()).padStart(2,'0')}
            </Button>

            <DatePicker
                date={time}
                mode="time"
                modal
                onCancel={() => { setPickerVisiability(false) }}
                onConfirm={(date) => {
                    setTime(date);
                    setPickerVisiability(false);
                }}
                open={isPickerOpen}
            />
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