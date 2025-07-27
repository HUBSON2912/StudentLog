import { Image, StyleSheet, View } from "react-native";
import { theme } from "../theme";
import { Text } from "react-native-paper";
import { bullet, mail, phone } from "../functions/getUnicodeItems";
import { useState } from "react";

function getForm(form) {
    switch (form) {
        case 0:
            return "Zdalnie";
        case 1:
            return "Stacjonarnie";
        case 2:
            return "Mieszanie";
        default:
            break;
    }
}

export function Student({ item }) {

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




    return (
        <View style={theme.styles.section}>
            <Text style={styles.text}>{item.name} {item.surname}</Text>
            <Text style={[styles.description, { display: (printPhone ? "flex" : "none") }]}>{phoneNum}</Text>
            <Text style={[styles.description, { display: (printEmail ? "flex" : "none"), paddingLeft: 3 }]}>{email}</Text>
            <Text style={[styles.description, { display: (printRemotelyData ? "flex" : "none") }]}>{remotelyPlatformNick}</Text>
            <Text style={[styles.description, { display: (printHomeAdress ? "flex" : "none") }]}>
                {
                    homeAdress
                }
            </Text>

            <View style={styles.icon}>
                <Image
                    source={formImages[item.form]}
                    style={{ width: 80, height: 80 }}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    description: {
        color: theme.light.text.gray,
        fontSize: 16
    },
    icon: {
        position: "absolute",
        top: 10,
        right: 10
    },
    text: {
        fontSize: 20,
        color: theme.light.text.black,
    },
});

/**
 * https://www.iconarchive.com/show/fluentui-emoji-flat-icons-by-microsoft/House-With-Garden-Flat-icon.html domek link
 * https://www.iconarchive.com/show/fluentui-emoji-flat-icons-by-microsoft/Desktop-Computer-Flat-icon.html komp link
 * https://www.iconarchive.com/show/fluentui-emoji-flat-icons-by-microsoft/Shuffle-Tracks-Button-Flat-icon.html mixed link
 */