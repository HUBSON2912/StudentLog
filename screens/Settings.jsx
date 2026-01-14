import { ScrollView, View } from "react-native";
import ActionTile from "../components/actionTile";
import { useState } from "react";
import { getVersion } from "../functions/version";
import SectionWithIcon from "../components/sectionWithIcon";
import { possibleLanguages } from "../constants/const";

export default function SettingsScreen() {
    const [language, setLanguage]=useState(possibleLanguages[0])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>

                {/* interface */}
                <SectionWithIcon icon={"land-plots"} label={"Interfejs"}>
                    <ActionTile label={"Język"}/>
                    <ActionTile label={"Waluta"} />
                    <ActionTile label={"Pokaż zarobki"} />
                    <ActionTile label={"Pokaż ilość uczniów"} />
                    <ActionTile label={"Pokaż ilość uczniów"} />
                </SectionWithIcon>


                {/* cennik */}

                <SectionWithIcon icon={"cash-multiple"} label={"Cennik"}>
                    <ActionTile label={"Zastosuj cennik"} />
                    <ActionTile label={"Edytuj cennik"} />
                    <ActionTile label={"Zniżka na pierwsze zajęcia"} />
                </SectionWithIcon>

                {/* imprt i eksport */}
                <SectionWithIcon icon={"database-import"} label={"Import/eksport"}>
                    <ActionTile label={"Zapisz do pliku"} />
                    <ActionTile label={"Wczytaj z pliku"} />
                </SectionWithIcon>

                {/* powiadomienia */}
                <SectionWithIcon icon={"alert-circle"} label={"Powiadomienia"}>
                    <ActionTile label={"Włącz powiadomienia"} />
                    <ActionTile label={"Nieznany temat"} />
                    <ActionTile label={"Nieopłacone zajęcia"} />
                    <ActionTile label={"Przyszłe zajęcia"} />
                    <ActionTile label={"Dzisiejsze zajęcia"} />
                </SectionWithIcon>

                {/* inne */}
                <SectionWithIcon icon={"dots-horizontal"} label={"Inne"}>
                    <ActionTile label={"O aplikacji"} />
                    <ActionTile label={"O autorze"} />
                    <ActionTile label={"Licencja"} />
                    <ActionTile label={"Wersja"} type="text" text={getVersion()} />
                </SectionWithIcon>

            </ScrollView>
        </View>
    );
}