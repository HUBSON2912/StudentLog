import { ScrollView } from "react-native";
import ActionTile from "../../components/actionTile";
import { useContext, useEffect, useState } from "react";
import { getVersion } from "../../functions/version";
import SectionWithIcon from "../../components/sectionWithIcon";
import { /*POSSIBLE_LANGUAGES,*/ POSSIBLE_ROUNDING_MODE } from "../../constants/const";
import DismissKeyboard from "../../components/dismissKeyboard";
import { Button, Dialog, Portal, Snackbar, Text } from "react-native-paper";
import { createFile, selectFile } from "../../functions/manageFiles";
import { dateUniqueString } from "../../functions/date";
import { DatabaseContext, SettingsContext } from "../../App";
import { importS } from "../../database/students";
import { importL } from "../../database/lessons";
import RNRestart from 'react-native-restart';
import { SETTINGS_KEYS, settingsGetAll } from "../../database/settings";
import { convertFloatPoint, isLikePositiveFloat } from "../../functions/validationInputs";
import { importPL } from "../../database/pricelist";

export default function ConfigurationScreen({ navigation }) {
    const db = useContext(DatabaseContext);
    const settings = useContext(SettingsContext);
    const currencies = Object.values(require("../../constants/currency.json"));

    // const [language, setLanguage] = useState(POSSIBLE_LANGUAGES[0]);
    const [currency, setCurrency] = useState(currencies[0]);
    const [showIncomes, setShowIncomes] = useState(true);
    const [showStudentNumber, setShowStudentNumber] = useState(true);
    const [autocompleteInputs, setAutocompleteInputs] = useState(true);

    const [applyPriceList, setApplyPriceList] = useState(true);
    const [firstDiscount, setFirstDiscount] = useState("100");
    const [roundingMode, setRoundingMode] = useState(POSSIBLE_ROUNDING_MODE[0])

    // const [applyNotifications, setApplyNotifications] = useState(true);
    // const [notifUnknowTopic, setNotifUnknowTopic] = useState(true);
    // const [notifUnpaidLessons, setNotifUnpaidLessons] = useState(true);
    // const [notifTodayLessons, setNotifTodayLessons] = useState(true);
    // const [notifWrongStatus, setNotifWrongStatus] = useState(true);

    // export and import stuff
    const handleExport = async () => {
        const saveObject = { database: db, settings: settings.settings };
        const res = await createFile(`studentlog_db_${dateUniqueString(new Date())}`, "json", JSON.stringify(saveObject), "application/json");
        setSnackbarMessage(res.message);
        setSnackbarVisiable(true);
    }
    const handleImport = async () => {
        const selected = await selectFile();
        if (!selected.success) {
            setSnackbarMessage(selected.message);
            setSnackbarVisiable(true);
            return;
        }

        try {
            const imported = JSON.parse(selected.content);
            if (!(imported.database) || !(imported.settings)) {
                throw new Error();
            }
        } catch (err) {
            setSnackbarMessage("Niepoprawny format pliku. " + err.message);
            setSnackbarVisiable(true);
            return;
        }

        setLoadedDataFromFile(selected.content);
        setDialogImportBackupVisiable(true);
    }
    const [loadedDataFromFile, setLoadedDataFromFile] = useState("");

    const loadImportedData = async () => {
        try {

            let loadObject = await JSON.parse(loadedDataFromFile);

            async function loadDatabase() {
                db.students = loadObject.database.students;
                db.lessons = loadObject.database.lessons;
                db.pricelist = loadObject.database.pricelist;
                await importS(loadObject.database.students);
                await importL(loadObject.database.lessons);
                await importPL(loadObject.database.pricelist);
            }

            async function loadSettings() {
                const keys = Object.values(SETTINGS_KEYS);
                for (let i = 0; i < keys.length; i++) {
                    await settings.set(keys[i], loadObject.settings[keys[i]]);
                }
            }
            await loadDatabase();
            await loadSettings();

            RNRestart.restart();
        } catch (err) {
            setSnackbarMessage("Nie można zaimportować danych.");
            setSnackbarVisiable(true);
            console.log(err);
        }
    }

    // load saved settings
    useEffect(() => {
        // setLanguage(settings.settings[SETTINGS_KEYS.language]);
        setCurrency(JSON.parse(settings.settings[SETTINGS_KEYS.currency]));
        setShowIncomes(settings.settings[SETTINGS_KEYS.showIncomes] === "true");
        setShowStudentNumber(settings.settings[SETTINGS_KEYS.showNumberStudents] === "true");
        setApplyPriceList(settings.settings[SETTINGS_KEYS.usePriceList] === "true");
        setFirstDiscount(settings.settings[SETTINGS_KEYS.discountForFirst]);
        setRoundingMode(JSON.parse(settings.settings[SETTINGS_KEYS.rounding]));
        setAutocompleteInputs(settings.settings[SETTINGS_KEYS.autocompleteInputs] === "true");
        // setApplyNotifications(settings.settings[SETTINGS_KEYS.notificationsOn] === "true");
        // setNotifUnknowTopic(settings.settings[SETTINGS_KEYS.notifUnknownTopic] === "true");
        // setNotifUnpaidLessons(settings.settings[SETTINGS_KEYS.notifUnpaidLesson] === "true");
        // setNotifTodayLessons(settings.settings[SETTINGS_KEYS.notifTodayLesson] === "true");
        // setNotifWrongStatus(settings.settings[SETTINGS_KEYS.notifWrongStatus] === "true");
    }, []);


    const [discountError, setDiscountError] = useState(false);
    function validateDiscount() {
        setFirstDiscount(prev => convertFloatPoint(prev));
        if (!isLikePositiveFloat(firstDiscount) || firstDiscount == "") {
            setDiscountError(true);
            return false;
        }
        else {
            setDiscountError(false);
            if (parseFloat(firstDiscount) > 100) {
                setFirstDiscount("100");
            }
            return true;
        }
    }

    // validate and save the discount
    useEffect(() => {
        if (validateDiscount()) {
            settings.set(SETTINGS_KEYS.discountForFirst, firstDiscount);
        }
    }, [firstDiscount]);

    const [snackbarVisiable, setSnackbarVisiable] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [dialogImportBackupVisiable, setDialogImportBackupVisiable] = useState(false);
    const [dialogAboutVisiable, setDialogAboutVisiable]=useState(false);

    return (
        <ScrollView>
            <DismissKeyboard style={{ flex: 1 }}>

                {/* interface */}
                <SectionWithIcon icon={"land-plots"} label={"Interfejs"}>
                    {/* <ActionTile label={"Język"} type="select" selectData={POSSIBLE_LANGUAGES} value={language} onSelect={(value) => {
                         setLanguage(value);
                         settings.set(SETTINGS_KEYS.language, value);
                     }} /> */}
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
                    <ActionTile active={applyPriceList} label={"Edytuj cennik"} onPress={() => { navigation.navigate("PriceList") }} />
                    <ActionTile label={"Pierwsza zniżka"} type="text-input"
                        active={applyPriceList}
                        placeholder={"0 - 100%"}
                        value={firstDiscount}
                        onChangeText={(val) => { setFirstDiscount(val); }}
                        helperTextVisiable={discountError}
                        helperText="Niepoprawne dane."
                        helperTextType="error"
                    />
                    <ActionTile label={"Sposób zaokrąglania"} type="select" active={applyPriceList} selectData={POSSIBLE_ROUNDING_MODE} itemProperty={"label"} value={roundingMode} onSelect={(val) => {
                        setRoundingMode(val);
                        settings.set(SETTINGS_KEYS.rounding, JSON.stringify(val));
                    }} />
                </SectionWithIcon>

                {/* imprt i eksport */}
                <SectionWithIcon icon={"database-import"} label={"Import/eksport"}>
                    <ActionTile label={"Zapisz do pliku"} onPress={handleExport} />
                    <ActionTile label={"Wczytaj z pliku"} onPress={handleImport} />
                </SectionWithIcon>

                {/* powiadomienia */}
                {/* <SectionWithIcon icon={"alert-circle"} label={"Powiadomienia"}>
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
                    <ActionTile label={"Nieaktualny status"} type="switch" active={applyNotifications} value={notifWrongStatus} onPress={() => {
                        settings.set(SETTINGS_KEYS.notifWrongStatus, (!notifWrongStatus).toString());
                        setNotifWrongStatus(!notifWrongStatus);
                    }} />
                </SectionWithIcon> */}

                {/* inne */}
                <SectionWithIcon icon={"dots-horizontal"} label={"Inne"}>
                    <ActionTile label={"O aplikacji"} onPress={() => setDialogAboutVisiable(true)} />
                    <ActionTile label={"Licencja"} type="text" text="MIT" />
                    <ActionTile label={"Wersja"} type="text" text={getVersion()} />
                </SectionWithIcon>


                {/* dialog box and snackbar */}
                <Portal>
                    <Snackbar visible={snackbarVisiable} onDismiss={() => setSnackbarVisiable(false)}>
                        {snackbarMessage}
                    </Snackbar>

                    {/* all necessary dialogs */}

                    {/* import dialog */}
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
                                await loadImportedData();
                                setDialogImportBackupVisiable(false);
                            }}>Tak</Button>
                            <Button onPress={async () => {
                                await loadImportedData();
                                setDialogImportBackupVisiable(false);
                            }}>Nie</Button>
                        </Dialog.Actions>
                    </Dialog>

                    {/* about the app dialog */}
                    <Dialog visible={dialogAboutVisiable} onDismiss={() => setDialogAboutVisiable(false)} dismissable>
                        <Dialog.Title>StudentLog</Dialog.Title>
                        <Dialog.Content>
                            <Text>
                                StudentLog to aplikacja dla korepetytorów, której celem jest zapisywanie informacji o lekcjach. Dane są zapisywane lokalnie i nie ma opcji (automatycznej) synchronizacji danych między urządzeniami. StudentLog posiada funkcje, które były potrzebne jej autorowi, natomiast nie posiada funkcji automatycznego powiadamiania uczniów o zbliżających się lekcjach (ograniczenia technologiczne). 
                            </Text>
                            <Text>
                                Niektóre elementy aplikacji zostaną rozwinięte w przyszłości, jeśli zajdzie taka potrzeba.
                            </Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>setDialogAboutVisiable(false)}>Zamknij</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </DismissKeyboard>
        </ScrollView>
    );
}