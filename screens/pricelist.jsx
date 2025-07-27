import { FlatList, StyleSheet, View } from "react-native";
import { theme } from "../theme";
import { Button, Text } from "react-native-paper";
import PriceLiseElement from "../components/price_list_element";

export default function PriceList({ navigation }) {

    const prices = [
        {
            id: 0,
            subject: "Matematyka",
            level: "szkoła podstawowa",
            price: 50
        },
        {
            id: 1,
            subject: "Matematyka",
            level: "szkoła średnia PP",
            price: 160
        },
        {
            id: 2,
            subject: "Fizyka",
            level: "szkoła średnia PR",
            price: 70
        }
    ]

    return (
        <View style={styles.container}>
            <FlatList
                data={prices}
                renderItem={({ item }) => {
                    return <PriceLiseElement item={item} />
                }}
            />


            <View style={styles.buttonPanel}>
                <Button
                    mode="contained"
                    style={[styles.button, { backgroundColor: theme.light.error, flex: 1 }]}
                    onPress={()=> navigation.pop()}
                >
                    <Text style={styles.buttonLabel}>
                        Anuluj
                    </Text>
                </Button>
                <Button
                    mode="contained"
                    style={[styles.button, { backgroundColor: theme.light.primary, flex: 1 }]}
                    onPress={()=> {
                        console.log("TODO save prices");
                        navigation.pop()
                    }}
                >
                    <Text style={styles.buttonLabel}>
                        Zapisz
                    </Text>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.light.primaryHalf,
        marginVertical: 5
    },
    buttonLabel: {
        color: theme.light.text.white,
        fontWeight: "bold",
        letterSpacing: 1
    },
    buttonPanel: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10
    },
    container: {
        flex: 1,
        backgroundColor: theme.light.background
    }
});