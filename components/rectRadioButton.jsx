import { TouchableOpacity, View } from "react-native";
import { theme } from "../theme";
import { Text } from "react-native-paper";

export default function RectangleRadioButton({ text = "", onSelect = () => { }, isSelected = false }) {
    return (
        <View style={{ flex: 1, borderColor: theme.border, borderWidth: 1, borderRadius: 5, paddingVertical: 5, backgroundColor: (isSelected ? theme.primaryPale : theme.background) }}>

            <TouchableOpacity
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                onPress={onSelect}
            >
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <Text style={{ textAlign: "center", flex: 1, padding: 3, color: theme.text.default }}>{text}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}