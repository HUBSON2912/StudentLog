import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../theme";

export function StatusLabel(status) {
    switch (status) {
        case 0:
            return (<View style={[styles.statusLabel, { backgroundColor: theme.light.status.planned, borderRadius: 10 }]}>
                <Text style={{color: "black"}}>Zaplanowane</Text>
            </View>);
        case 2:
            return (<View style={[styles.statusLabel, { backgroundColor: theme.light.status.paid, borderRadius: 10 }]}>
                <Text style={{ color: theme.light.text.white }}>Opłacone</Text>
            </View>);
        case 1:
            return (<View style={[styles.statusLabel, { backgroundColor: theme.light.status.done, borderRadius: 10 }]}>
                <Text style={{ color: theme.light.text.white }}>Wykonane</Text>
            </View>);

        default:
            break;
    }
}

const styles=StyleSheet.create({
    statusLabel: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 10
    },
});