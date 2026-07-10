import { ScrollView, View } from "react-native";
import ActionTile from "../components/actionTile";
import { useContext, useEffect, useState } from "react";
import { getVersion } from "../functions/version";
import SectionWithIcon from "../components/sectionWithIcon";
import { POSSIBLE_LANGUAGES, POSSIBLE_ROUNDING_MODE } from "../constants/const";
import DismissKeyboard from "../components/dismissKeyboard";
import { Button, Dialog, Portal, Snackbar, Text } from "react-native-paper";
import { createFile, selectFile } from "../functions/manageFiles";
import { dateUniqueString } from "../functions/date";
import { DatabaseContext, SettingsContext } from "../App";
import { importS } from "../database/students";
import { importL } from "../database/lessons";
import RNRestart from 'react-native-restart';
import { SETTINGS_KEYS, settingsGet, settingsGetAll, settingsSet } from "../database/settings";

export default function SettingsScreen() {
    const db = useContext(DatabaseContext);
    const settings = useContext(SettingsContext);
    const currencies = Object.values(require("../constants/currency.json"));

    const [language, setLanguage] = useState(POSSIBLE_LANGUAGES[0]);
    const [currency, setCurrency] = useState(currencies[0]);
    const [showIncomes, setShowIncomes] = useState(true);
    const [showStudentNumber, setShowStudentNumber] = useState(true);
    const [autocompleteInputs, setAutocompleteInputs] = useState(true);

    const [applyPriceList, setApplyPriceList] = useState(true);
    const [firstDiscount, setFirstDiscount] = useState("100");
    const [roundingMode, setRoundingMode] = useState(POSSIBLE_ROUNDING_MODE[0])

    const [applyNotifications, setApplyNotifications] = useState(true);
    const [notifUnknowTopic, setNotifUnknowTopic] = useState(true);
    const [notifUnpaidLessons, setNotifUnpaidLessons] = useState(true);
    const [notifTodayLessons, setNotifTodayLessons] = useState(true);

    // load saved settings
    useEffect(() => {
        // async function load() {
        setLanguage(settings.settings[SETTINGS_KEYS.language]);
        setCurrency(JSON.parse(settings.settings[SETTINGS_KEYS.currency]));
        setShowIncomes(settings.settings[SETTINGS_KEYS.showIncomes] === "true");
        setShowStudentNumber(settings.settings[SETTINGS_KEYS.showNumberStudents] === "true");
        setApplyPriceList(settings.settings[SETTINGS_KEYS.usePriceList] === "true");
        setFirstDiscount(settings.settings[SETTINGS_KEYS.discountForFirst]);
        setRoundingMode(JSON.parse(settings.settings[SETTINGS_KEYS.rounding]));
        setApplyNotifications(settings.settings[SETTINGS_KEYS.notificationsOn] === "true");
        setNotifUnknowTopic(settings.settings[SETTINGS_KEYS.notifUnknownTopic] === "true");
        setNotifUnpaidLessons(settings.settings[SETTINGS_KEYS.notifUnpaidLesson] === "true");
        setNotifTodayLessons(settings.settings[SETTINGS_KEYS.notifTodayLesson] === "true");
        setAutocompleteInputs(settings.settings[SETTINGS_KEYS.autocompleteInputs] === "true");
        // }
        // load();
    }, []);

    const [snackbarVisiable, setSnackbarVisiable] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [dialogImportBackupVisiable, setDialogImportBackupVisiable] = useState(false);

    // export and import stuff
    const handleExport = async () => {
        const res = await createFile(`studentlog_db_${dateUniqueString(new Date())}`, "stldb", JSON.stringify(db), "text/stldb");
        setSnackbarMessage(res.message);
        setSnackbarVisiable(true);
    }
    const [loadedDatabaseFile, setLoadedDatabaseFile] = useState("");

    const loadDatabase = async () => {
        try {

            let newContent = await JSON.parse(loadedDatabaseFile);
            db.students = newContent.students;
            db.lessons = newContent.lessons;
            await importS(newContent.students);
            await importL(newContent.lessons);
            RNRestart.restart();
        } catch (err) {
            setSnackbarMessage("Nie można zaimportować danych.");
            setSnackbarVisiable(true);
        }
    }

    return (
        <ScrollView>
            <DismissKeyboard style={{ flex: 1 }}>

                {/* interface */}

                {/* ------------------------- */}
                {/* info delete it later */}
                <ActionTile label="print settings" onPress={() => {
                    async function show() {
                        console.log(await settingsGetAll());
                        console.log(settings);
                    }
                    show();
                }} />
                {/* ------------------------- */}

                <SectionWithIcon icon={"land-plots"} label={"Interfejs"}>
                    <ActionTile label={"Język"} type="select" selectData={POSSIBLE_LANGUAGES} value={language} onSelect={(value) => {
                        setLanguage(value);
                        settings.set(SETTINGS_KEYS.language, value);
                    }} />
                    <ActionTile label={"Waluta"} type="select" selectData={currencies} value={currency} itemProperty={"code"} onSelect={(val) => {
                        setCurrency(val);
                        settings.set(SETTINGS_KEYS.currency, JSON.stringify(val));
                    }} />
                    <ActionTile label={"Pokaż zarobki"} type="switch" value={showIncomes} onPress={() => {
                        settings.set(SETTINGS_KEYS.showIncomes, (!showIncomes).toString());
                        setShowIncomes(prev => !prev);
                    }} />
                    <ActionTile label={"Pokaż ilość aktywnych uczniów"} type="switch" value={showStudentNumber} onPress={() => {
                        settings.set(SETTINGS_KEYS.showNumberStudents, (!showStudentNumber).toString());
                        setShowStudentNumber(prev => !prev);
                    }} />
                    <ActionTile label={"Autouzupełnianie pól"} type="switch" value={autocompleteInputs} onPress={() => {
                        settings.set(SETTINGS_KEYS.autocompleteInputs, (!autocompleteInputs).toString());
                        setAutocompleteInputs(prev => !prev);
                    }} />
                </SectionWithIcon>

                {/* cennik */}
                <SectionWithIcon icon={"cash-multiple"} label={"Cennik"}>
                    <ActionTile label={"Zastosuj cennik"} type="switch" value={applyPriceList} onPress={() => {
                        settings.set(SETTINGS_KEYS.usePriceList, (!applyPriceList).toString());
                        setApplyPriceList(!applyPriceList);
                    }} />
                    <ActionTile label={"Edytuj cennik"} onPress={() => { console.log("todo");/** todo navigate to pricelist */ }} active={applyPriceList} />
                    <ActionTile label={"Pierwsza zniżka"} type="text-input" active={applyPriceList} placeholder={"%"} value={firstDiscount} onChangeText={(val) => {
                        setFirstDiscount(val);
                        settings.set(SETTINGS_KEYS.discountForFirst, val);
                    }} />
                    <ActionTile label={"Sposób zaokrąglania"} type="select" active={applyPriceList} selectData={POSSIBLE_ROUNDING_MODE} itemProperty={"label"} value={roundingMode} onSelect={(val) => {
                        setRoundingMode(val);
                        settings.set(SETTINGS_KEYS.rounding, JSON.stringify(val));
                    }} />
                </SectionWithIcon>

                {/* imprt i eksport */}
                <SectionWithIcon icon={"database-import"} label={"Import/eksport"}>
                    <ActionTile label={"Zapisz do pliku"} onPress={handleExport} />
                    <ActionTile label={"Wczytaj z pliku"} onPress={async () => {
                        const selected = await selectFile()
                        if (!selected.success) {
                            setSnackbarMessage(selected.message);
                            setSnackbarVisiable(true);
                            return;
                        }
                        const verKey = selected.content.slice(0, 5);
                        if (verKey != "stldb") {
                            setSnackbarMessage("Niepoprawny format pliku. Plik musi być wygenerowany przez StudentLog.");
                            setSnackbarVisiable(true);
                            return;
                        }

                        setLoadedDatabaseFile(selected.content.slice(5));
                        setDialogImportBackupVisiable(true);
                    }} />
                </SectionWithIcon>

                {/* powiadomienia */}
                <SectionWithIcon icon={"alert-circle"} label={"Powiadomienia"}>
                    <ActionTile label={"Włącz powiadomienia"} type="switch" value={applyNotifications} onPress={() => {
                        settings.set(SETTINGS_KEYS.notificationsOn, (!applyNotifications).toString());
                        setApplyNotifications(!applyNotifications);
                    }} />
                    <ActionTile label={"Nieznany temat"} type="switch" active={applyNotifications} value={notifUnknowTopic} onPress={() => {
                        settings.set(SETTINGS_KEYS.notifUnknownTopic, (!notifUnknowTopic).toString());
                        setNotifUnknowTopic(!notifUnknowTopic);
                    }} />
                    <ActionTile label={"Nieopłacone zajęcia"} type="switch" active={applyNotifications} value={notifUnpaidLessons} onPress={() => {
                        settings.set(SETTINGS_KEYS.notifUnpaidLesson, (!notifUnpaidLessons).toString());
                        setNotifUnpaidLessons(!notifUnpaidLessons);
                    }} />
                    <ActionTile label={"Dzisiejsze zajęcia"} type="switch" active={applyNotifications} value={notifTodayLessons} onPress={() => {
                        settings.set(SETTINGS_KEYS.notifTodayLesson, (!notifTodayLessons).toString());
                        setNotifTodayLessons(!notifTodayLessons);
                    }} />
                </SectionWithIcon>

                {/* inne */}
                <SectionWithIcon icon={"dots-horizontal"} label={"Inne"}>
                    <ActionTile label={"O aplikacji"} onPress={() => {/**todo as alert */ }} />
                    <ActionTile label={"O autorze"} onPress={() => {/**todo as alert */ }} />
                    <ActionTile label={"Licencja"} onPress={() => {/**todo as text */ }} />
                    <ActionTile label={"Wersja"} type="text" text={getVersion()} />
                </SectionWithIcon>



                <Portal>
                    <Snackbar visible={snackbarVisiable} onDismiss={() => setSnackbarVisiable(false)}>
                        {snackbarMessage}
                    </Snackbar>

                    {/* all necessary dialogs */}
                    <Dialog visible={dialogImportBackupVisiable} onDismiss={() => setDialogImportBackupVisiable(false)} dismissable>
                        <Dialog.Title>Czy zapisać dane?</Dialog.Title>
                        <Dialog.Content>
                            <Text>
                                Ta operacja usunie dotychczas zapisane dane. Jeśli będziesz kontynuował utracisz je wszystkie. Czy chcesz utworzyć kopię zapasową tych danych?
                            </Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={async () => {
                                await handleExport();
                                await loadDatabase();
                                setDialogImportBackupVisiable(false);
                            }}>Tak</Button>
                            <Button onPress={async () => {
                                await loadDatabase();
                                setDialogImportBackupVisiable(false);
                            }}>Nie</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </DismissKeyboard>
        </ScrollView>
    );
}