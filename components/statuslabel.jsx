import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../theme";

export const possibleStatus = [
    { id: 0, name: "Zaplanowane" },
    { id: 1, name: "Wykonane" },
    { id: 2, name: "Opłacone" }
]

export function StatusLabel(status, style = {}) {
    switch (status) {
        case 0:
            return (<View style={[styles.statusLabel, { backgroundColor: theme.status.planned, borderRadius: 10 }, style]}>
                <Text style={{ color: theme.status.planned_text }}>Zaplanowane</Text>
            </View>);
        case 1:
            return (<View style={[styles.statusLabel, { backgroundColor: theme.status.done, borderRadius: 10 }, style]}>
                <Text style={{ color: theme.status.done_text }}>Wykonane</Text>
            </View>);
        case 2:
            return (<View style={[styles.statusLabel, { backgroundColor: theme.status.paid, borderRadius: 10 }, style]}>
                <Text style={{ color: theme.status.paid_text }}>Opłacone</Text>
            </View>);

        default:
            break;
    }
}

const styles = StyleSheet.create({
    statusLabel: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        paddingHorizontal: 7,
        paddingVertical: 5,
        borderRadius: 10
    },
});