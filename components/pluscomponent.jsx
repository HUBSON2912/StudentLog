import { decode } from "html-entities";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../theme";
import { plus } from "../functions/getUnicodeItems";

export function PlusComponent() {
    
    return (
        <View style={styles.plusView}>
            <Text style={styles.plus}>{plus()}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    plus: {
        fontSize: 45, 
        marginTop: '-14%', 
        color: "white"
    },
    plusView: {
        position: 'absolute',
        backgroundColor: theme.light.primary,
        width: 50,
        height: 50,
        bottom: 20,
        right: 20,
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});