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

                    return (
                        <Chip
                            key={index}
                            icon={x.icon}
                            selectedColor={selected ?
                                (colors && colors.onBackgroundSelected ? colors.onBackgroundSelected : theme.colors.onPrimaryContainer) :
                                (colors && colors.onBackground ? colors.onBackground : theme.colors.onPrimary)}
                            onPress={() => { onSelect(x.value) }}
                            selected={selected}
                            style={{
                                backgroundColor: selected ?
                                    (colors && colors.backgroundSelected ? colors.backgroundSelected : theme.colors.primaryContainer) :
                                    (colors && colors.background ? colors.background : theme.colors.inversePrimary)

                            }}
                        >
                            <Text style={{
                                color: selected ?
                                    (colors && colors.onBackgroundSelected ? colors.onBackgroundSelected : theme.colors.onPrimaryContainer) :
                                    (colors && colors.onBackground ? colors.onBackground : theme.colors.onPrimary)
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