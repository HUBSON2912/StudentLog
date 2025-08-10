import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../theme";

export default function PriceLiseElement({item}) {
    /** todo
     * get the currency from asyncstorage
     */
    const currency = "zł";
    return (
        <View style={[theme.styles.section, { flexDirection: "row" }]}>
            <View style={{ flex: 3 }}>
                <Text style={theme.styles.h2}>{item.subject}</Text>
                <Text style={theme.styles.description}>{item.level}</Text>
            </View>
            <Text style={styles.priceNumber}>{item.price} {currency}</Text>
        </View>
    );
}

const styles=StyleSheet.create({
    priceNumber: {
        ...theme.styles.h2,
        flex: 1,
        textAlign: "center",
        textAlignVertical: "center"
    }
});