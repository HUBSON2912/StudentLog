import { FlatList, StyleSheet, View } from "react-native";
import { theme } from "../theme";
import { Button, Text } from "react-native-paper";
import PriceLiseElement from "../components/price_list_element";
import { useContext, useEffect, useState } from "react";
import { getLanguage } from "../functions/settingsStorage";
import { DatabaseContext } from "../App";
import { PlusComponent } from "../components/pluscomponent";

export default function PriceList({ navigation }) {

    const database = useContext(DatabaseContext);

    const [dictionary, setDictionary] = useState({});

    useEffect(() => {
        const fetchDict = async () => {
            setDictionary((await getLanguage()).file);
        }
        fetchDict();
    })


    const prices = database.priceList;

    return (
        <View style={styles.container}>
            {
                prices.length != 0 &&
                <FlatList
                    data={prices}
                    renderItem={({ item }) => {
                        return <PriceLiseElement item={item} />
                    }}
                />
            }
            {
                prices.length == 0 &&
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.description}>
                        Brak danych {/* todo dictionary.nodata */}
                    </Text>
                </View>

            }

            <PlusComponent onPress={()=>navigation.navigate("PriceListEdit")} />
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.primaryHalf,
        marginVertical: 5
    },
    buttonLabel: {
        color: theme.text.buttonLabel,
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
        backgroundColor: theme.background
    },
    description: {
        color: theme.text.gray,
        fontSize: 22,
        marginTop: 50
    }
});