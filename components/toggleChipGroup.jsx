import { View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";

export function ToggleChipGroup({ onSelect = () => { }, style = {}, chips = [], value = 0 }) {
    const theme = useTheme();

    return (
        <View style={style}>
            {
                chips.map((x, index) => {
                    const selected = (value == x.value);
                    const colors = x.colors ?? null;

                    const bgColor = selected ? ((colors && colors.background) ? colors.background : theme.colors.primaryContainer) : theme.colors.inversePrimary;
                    const txColor = selected ? ((colors && colors.onBackground) ? colors.onBackground : theme.colors.onPrimaryContainer) : theme.colors.onBackground;

                    return (
                        <Chip
                            key={index}
                            icon={x.icon}
                            onPress={() => { onSelect(x.value) }}
                            selected={selected}
                            selectedColor={txColor}
                            style={{
                                backgroundColor: bgColor
                            }}
                        >
                            <Text style={{
                                color: txColor
                            }}>
                                {x.label ? x.label : x.value}
                            </Text>
                        </Chip>
                    );
                })
            }
        </View>
    );
}