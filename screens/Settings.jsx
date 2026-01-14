import { ScrollView, View } from "react-native";
import ActionTile from "../components/actionTile";
import { useState } from "react";

export default function SettingsScreen() {
    const [sw, setsw] = useState(false);
    const [val, setval] = useState("1");
    const [textVal, setTextVal] = useState("");
    return (
        <View style={{ flex: 1 }}>
            <ScrollView>

                {/* interface */}
                <ActionTile label={"Motyw"}/>
                <ActionTile label={"Język"}/>
                <ActionTile label={"Waluta"}/>
                <ActionTile label={"Pokaż zarobki"} />
                <ActionTile label={"Pokaż ilość uczniów"} />
                <ActionTile label={"Pokaż ilość uczniów"} />

                {/* cennik */}
                <ActionTile label={"Zastosuj cennik"}/>
                <ActionTile label={"Edytuj cennik"} />
                <ActionTile label={"Zniżka na pierwsze zajęcia"} />

                {/* imprt i eksport */}
                <ActionTile label={"Zapisz do pliku"} />
                <ActionTile label={"Wczytaj z pliku"} />

                {/* powiadomienia */}
                <ActionTile label={"Włącz powiadomienia"} />
                <ActionTile label={"Nieznany temat"} />
                <ActionTile label={"Nieopłacone zajęcia"} />
                <ActionTile label={"Przyszłe zajęcia"} />
                <ActionTile label={"Dzisiejsze zajęcia"} />

                {/* inne */}
                <ActionTile label={"O aplikacji"} />
                <ActionTile label={"O autorze"} />
                <ActionTile label={"Licencja"} />
                <ActionTile label={"Wersja"} />

            </ScrollView>
        </View>
    );
}