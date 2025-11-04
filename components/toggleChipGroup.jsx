import { View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

export function ToggleChipGroup({ onSelect = () => { }, style = {}, chips = [], value = 0 }) {
    const theme = useTheme();
    return (
        <View style={style}>
            {
                chips.map((x, index) => {
                    const selected = (value == x.value);
                    return (
                        <Chip
                            key={index}
                            icon={x.icon}
                            onPress={() => { onSelect(x.value) }}
                            selected={selected}
                            style={{ backgroundColor: selected ? theme.colors.inversePrimary : theme.colors.primaryContainer }}
                        >
                            {x.label ? x.label : x.value}
                        </Chip>
                    );
                })
            }
        </View>
    );
}