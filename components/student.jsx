import { Alert, Image, View } from "react-native";
import { theme } from "../theme";
import { Text } from "react-native-paper";
import { bullet, mail, phone } from "../functions/getUnicodeItems";
import { useNavigation } from "@react-navigation/native";
import { deleteIDStudent } from "../functions/dbStudents";
import Section from "./section";
import { useState } from "react";

export function Student({ item }) {

    const navigation = useNavigation();

    let email = "";
    let printEmail = false;
    if (item.email != "" && item.email != null && item.email != undefined) {
        email = mail() + " " + item.email;
        printEmail = true;
    }

    let phoneNum = "";
    let printPhone = false;
    if (item.phone != "" && item.phone != null && item.phone != undefined) {
        phoneNum = phone() + " " + item.phone;
        printPhone = true;
    }

    const formImages = {
        0: require("../assets/images/form/0.png"),
        1: require("../assets/images/form/1.png"),
        2: require("../assets/images/form/2.png"),
    };

    let remotelyPlatformNick = "";
    let printRemotelyData = false;

    let homeAdress = "";
    let printHomeAdress = false;

    //remotely or mixed
    if (item.form === 0 || item.form === 2) {
        remotelyPlatformNick = item.platform + " " + bullet() + " " + item.nick;
        printRemotelyData = true;
    }

    //home or mixed
    if (item.form === 1 || item.form === 2) {
        printHomeAdress = true;
        homeAdress = item.city + " " + bullet();
        if (item.street != "" && item.street != null && item.street != undefined)
            homeAdress += " " + item.street + " " + bullet();
        homeAdress += " " + item.house_nr;
        if (item.flat_nr != "" && item.flat_nr != null && item.flat_nr != undefined)
            homeAdress += "/" + item.flat_nr;
    }


    const handleEditing = () => {
        navigation.navigate("EditStudent", { studentID: item.id });
    };

    const handleDelete = () => {
        Alert.alert("Potwierdzenie",
            `Czy na pewno chcesz usunąć tego ucznia? Spowoduje to usunięcie wszystkich lekcji przypisanych do tego ucznia. \n\nID: ${item.id} \nImię: ${item.name} \nNazwisko: ${item.surname}`,
            [
                { text: "Tak", onPress: () => { deleteIDStudent(item.id) } },
                { text: "Nie", onPress: () => { } }
            ],
            { cancelable: true }
        )
    };

    const [expand, setExpand] = useState(false);
    const onPress = () => {
        setExpand(!expand);
    }

    return (
        <Section onPressBehaviour="scale"
            onLongPress={() => {
                Alert.alert("Co zamierzasz zrobić", `Wybierz co zamierzasz zrobić z tym rekordem. \n\nID: ${item.id} \nImię: ${item.name} \nNazwisko: ${item.surname}`,
                    [
                        { text: "Anuluj", onPress: () => { }, style: "cancel" },
                        { text: "Edytuj", onPress: handleEditing },
                        { text: "Usuń", onPress: handleDelete },
                    ],
                    { cancelable: true }
                )
            }}
            style={{ flexDirection: "row", alignItems: "stretch" }}
            onPress={onPress}
        >
            <View style={{ flex: 1, }}>
                <Text style={theme.styles.h2}>{item.name} {item.surname}</Text>
                <Text style={[theme.styles.description, { display: (printPhone ? "flex" : "none") }]}>{phoneNum}</Text>
                <Text style={[theme.styles.description, { display: (printEmail ? "flex" : "none"), paddingLeft: 3 }]} numberOfLines={expand ? 10 : 1}>{email}</Text>
                <Text style={[theme.styles.description, { display: (printRemotelyData ? "flex" : "none") }]} numberOfLines={expand ? 10 : 1}>{remotelyPlatformNick}</Text>
                <Text style={[theme.styles.description, { display: (printHomeAdress ? "flex" : "none") }]} numberOfLines={expand ? 10 : 1}>{homeAdress}</Text>
                <Text style={[theme.styles.description, { display: (expand ? "flex" : "none") }]}>{!item.money ? 0 : item.money} zł {bullet()} {item.lessons_amount} lekcji opłaconych</Text>
            </View>

            <View style={{ justifyContent: "center" }}>
                <Image
                    source={formImages[item.form]}
                    style={{ width: 80, height: 80 }}
                    resizeMode="contain"
                />
            </View>
        </Section>
    );
}