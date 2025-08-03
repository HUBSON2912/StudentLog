import { TouchableOpacity, View } from "react-native";
import { theme } from "../theme";
import { Text } from "react-native-paper";

export default function RectangleRadioButton({ text = "", onSelect = () => { }, isSelected = false }) {
    return (
        <View style={{ flex: 1, borderColor: theme.light.border, borderWidth: 1, borderRadius: 5, paddingVertical: 5, backgroundColor: (isSelected ? theme.light.primaryPale : theme.light.background) }}>

            <TouchableOpacity
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                onPress={onSelect}
            >
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <Text style={[theme.styles.text, { textAlign: "center", flex: 1 }]}>{text}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}