import { useColorScheme, View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import { possibleStatuses } from "../constants/const";

export function StatusChip({ value, onPress = () => { }, style = {}, selected = false }) {
    const theme = useTheme();
    const __possStatuses = useColorScheme() == "dark" ? possibleStatuses.dark : possibleStatuses.light;
    const thisStatus = __possStatuses[value];
    return (
        <View style={style}>
            <Chip
                onPress={() => { onPress(value) }}
                selected={selected}
                selectedColor={thisStatus.colors.onBackground}
                style={{
                    backgroundColor: thisStatus.colors.background
                }}
            >
                <Text style={{
                    color: thisStatus.colors.onBackground
                }}>
                    {thisStatus.label ? thisStatus.label : thisStatus.value}
                </Text>
            </Chip>

        </View>
    );
}