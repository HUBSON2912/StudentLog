import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

export default function SectionWithIcon({ icon, label, children }) {
    const theme = useTheme();
    return (
        <View style={{ margin: 15, gap: 10, marginBottom: 25 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10}}>
                <IconButton icon={icon} theme={theme} mode="contained" />
                <Text style={{fontSize: 22}}>{label}</Text>
            </View>
            {children}
        </View>
    );
}