import { ScrollView, View } from "react-native";
import ActionTile from "../components/actionTile";
import { useContext, useState } from "react";
import { getVersion } from "../functions/version";
import SectionWithIcon from "../components/sectionWithIcon";
import { possibleLanguages } from "../constants/const";
import DismissKeyboard from "../components/dismissKeyboard";
import { Snackbar } from "react-native-paper";
import { createFile } from "../functions/manageFiles";
import { dateUniqueString } from "../functions/date";
import { DatabaseContext } from "../App";

let RNFS = require('react-native-fs');

export default function SettingsScreen() {
    const db = useContext(DatabaseContext);
    const currencies = Object.values(require("../constants/currency.json"));

    const [language, setLanguage] = useState(possibleLanguages[0]);
    const [currency, setCurrency] = useState(currencies[0]);
    const [showIncomes, setShowIncomes] = useState(true);
    const [showStudentNumber, setShowStudentNumber] = useState(true);

    const possibleRoundingMode = [{ id: 0, label: "w górę" }, { id: 1, label: "w dół" }, { id: 2, label: "matematycznie" }, { id: 3, label: "nie zaokrąglaj" },]

    const [applyPriceList, setApplyPriceList] = useState(true);
    const [firstDiscount, setFirstDiscount] = useState("100");
    const [roundingMode, setRoundingMode] = useState(possibleRoundingMode[0])

    const [applyNotifications, setApplyNotifications] = useState(true);
    const [notifUnknowTopic, setNotifUnknowTopic] = useState(true);
    const [notifUnpaidLessons, setNotifUnpaidLessons] = useState(true);
    const [notifTodayLessons, setNotifTodayLessons] = useState(true);

    const [snackbarVisiable, setSnackbarVisiable] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    return (
        <DismissKeyboard style={{ flex: 1 }}>
            <ScrollView>

                {/* interface */}
                <SectionWithIcon icon={"land-plots"} label={"Interfejs"}>
                    <ActionTile label={"Język"} type="select" selectData={possibleLanguages} value={language} onSelect={(value) => setLanguage(value)} />
                    <ActionTile label={"Waluta"} type="select" selectData={currencies} value={currency} itemProperty={"code"} onSelect={(val) => setCurrency(val)} />
                    <ActionTile label={"Pokaż zarobki"} type="switch" value={showIncomes} onPress={() => setShowIncomes(!showIncomes)} />
                    <ActionTile label={"Pokaż ilość uczniów"} type="switch" value={showStudentNumber} onPress={() => setShowStudentNumber(!showStudentNumber)} />
                </SectionWithIcon>

                {/* cennik */}
                <SectionWithIcon icon={"cash-multiple"} label={"Cennik"}>
                    <ActionTile label={"Zastosuj cennik"} type="switch" value={applyPriceList} onPress={() => setApplyPriceList(!applyPriceList)} />
                    <ActionTile label={"Edytuj cennik"} onPress={() => { console.log("todo");/** todo navigate to pricelist */ }} active={applyPriceList} />
                    <ActionTile label={"Pierwsza zniżka"} type="text-input" active={applyPriceList} placeholder={"%"} onChangeText={(val) => setFirstDiscount(val)} value={firstDiscount} />
                    <ActionTile label={"Sposób zaokrąglania"} type="select" active={applyPriceList} selectData={possibleRoundingMode} itemProperty={"label"} value={roundingMode} onSelect={(val) => setRoundingMode(val)} />
                </SectionWithIcon>

                {/* imprt i eksport */}
                <SectionWithIcon icon={"database-import"} label={"Import/eksport"}>
                    <ActionTile label={"Zapisz do pliku"} onPress={async () => {
                        const res = await createFile(`studentlog_db_${dateUniqueString(new Date())}`, JSON.stringify(db), "application/json");
                        setSnackbarMessage(res.message);
                        setSnackbarVisiable(true);
                    }} />
                    <ActionTile label={"Wczytaj z pliku"} onPress={() => {/**todo import */ }} />
                </SectionWithIcon>

                {/* powiadomienia */}
                <SectionWithIcon icon={"alert-circle"} label={"Powiadomienia"}>
                    <ActionTile label={"Włącz powiadomienia"} type="switch" value={applyNotifications} onPress={() => setApplyNotifications(!applyNotifications)} />
                    <ActionTile label={"Nieznany temat"} type="switch" active={applyNotifications} value={notifUnknowTopic} onPress={() => setNotifUnknowTopic(!notifUnknowTopic)} />
                    <ActionTile label={"Nieopłacone zajęcia"} type="switch" active={applyNotifications} value={notifUnpaidLessons} onPress={() => setNotifUnpaidLessons(!notifUnpaidLessons)} />
                    <ActionTile label={"Dzisiejsze zajęcia"} type="switch" active={applyNotifications} value={notifTodayLessons} onPress={() => setNotifTodayLessons(!notifTodayLessons)} />
                </SectionWithIcon>

                {/* inne */}
                <SectionWithIcon icon={"dots-horizontal"} label={"Inne"}>
                    <ActionTile label={"O aplikacji"} onPress={() => {/**todo as alert */ }} />
                    <ActionTile label={"O autorze"} onPress={() => {/**todo as alert */ }} />
                    <ActionTile label={"Licencja"} onPress={() => {/**todo as text */ }} />
                    <ActionTile label={"Wersja"} type="text" text={getVersion()} />
                </SectionWithIcon>
            </ScrollView>

            <Snackbar visible={snackbarVisiable} onDismiss={() => setSnackbarVisiable(false)}>
                {snackbarMessage}
            </Snackbar>
        </DismissKeyboard>
    );
}