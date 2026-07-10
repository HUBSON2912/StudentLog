import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, DataTable, Dialog, FAB, Snackbar, Text, TextInput, useTheme } from "react-native-paper";

export default function PriceListScreen() {
    const theme = useTheme();

    const [subjectLevelPrice, setSubjectLevelPrice] = useState([
        {
            key: 1,
            subject: "Matematyka",
            level: "Szkoła podstawowa",
            price: 50
        },
        {
            key: 2,
            subject: "Matematyka",
            level: "Szkoła średnia - PP",
            price: 60
        },
        {
            key: 3,
            subject: "Matematyka",
            level: "Szkoła średnia - PR",
            price: 65
        },
        {
            key: 4,
            subject: "Fizyka",
            level: "Szkoła podstawowa",
            price: 55
        },
        {
            key: 5,
            subject: "Fizyka",
            level: "Szkoła średnia - PP",
            price: 65
        },
        {
            key: 6,
            subject: "Fizyka",
            level: "Szkoła średnia - PR",
            price: 70
        },
        {
            key: 7,
            subject: "Informatyka",
            level: "Szkoła średnia - PP",
            price: 65
        },
        {
            key: 8,
            subject: "Informatyka",
            level: "Szkoła średnia - PR",
            price: 70
        },
    ]);

    const [selectedRow, setSelectedRow] = useState({ key: undefined, subject: "", level: "", price: "" });
    const [dialogShown, setDialogShows] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    function clearSelectedRow() {
        setSelectedRow({ key: undefined, subject: "", level: "", price: "" });
    }

    function dialogDismiss() {
        setDialogShows(false);
        clearSelectedRow();
    }


    function dialogSave() {
        // new values are stored in selectedRow
        function isInt(val) {
            const regex = /^[0-9]*$/gm
            let matched = val.match(regex);
            return !(!(matched))
        }
        function isInputCorrect() {
            return !(selectedRow.subject == "" || selectedRow.level == "" || selectedRow.price == "" || !isInt(selectedRow.price));
        }

        function isDuplicate() {
            const subject = selectedRow.subject;
            const level = selectedRow.level;
            let buff = subjectLevelPrice;
            return (buff.filter(x => x.subject == subject && x.level == level).length != 0);
        }

        if (!isInputCorrect()) {
            setSnackbarMessage("Uzupełnij wszystkie dane. Cena może zawierać wyłącznie cyfry.");
            dialogDismiss();
            return;
        }

        if (isDuplicate()) {
            setSnackbarMessage("Już istnieje taki wpis.");
            dialogDismiss();
            return;
        }

        if (selectedRow.key === undefined) {
            let buff = selectedRow;
            buff.key = subjectLevelPrice[subjectLevelPrice.length - 1].key + 1;
            setSubjectLevelPrice(prev => [...prev, buff]);
        }
        else {
            let buff = subjectLevelPrice;
            buff = buff.map(x => {
                if (x.key != selectedRow.key)
                    return x;

                x.subject = selectedRow.subject;
                x.level = selectedRow.level;
                x.price = (selectedRow.price == "") ? 0 : parseInt(selectedRow.price);
                return x;
            });
            setSubjectLevelPrice(buff);
        }
        dialogDismiss();
    }

    function dialogDelete() {
        if (selectedRow.key === undefined)
            return;
        let buff = subjectLevelPrice;
        buff = buff.filter(x => x.key != selectedRow.key);
        setSubjectLevelPrice(buff);
        dialogDismiss();
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Przedmiot</DataTable.Title>
                        <DataTable.Title>Poziom</DataTable.Title>
                        <DataTable.Title numeric>Cena /h</DataTable.Title>
                    </DataTable.Header>

                    {
                        subjectLevelPrice.map(({ key, subject, level, price }) => (
                            <DataTable.Row key={key} onPress={() => {
                                setSelectedRow({ key: key, subject: subject, level: level, price: price.toString() });
                                setDialogShows(true);
                            }}>
                                <DataTable.Cell>{subject}</DataTable.Cell>
                                <DataTable.Cell>{level}</DataTable.Cell>
                                <DataTable.Cell numeric>{price}</DataTable.Cell>
                            </DataTable.Row>
                        ))
                    }
                </DataTable>
            </ScrollView>

            <FAB
                icon={"plus"}
                style={styles.addNewButton}
                customSize={48}
                onPress={() => setDialogShows(true)}
            />


            {/* dialog for editing and add new */}
            <Dialog visible={dialogShown} dismissable onDismiss={dialogDismiss} >
                <Dialog.Content style={styles.dialogContainer}>
                    <TextInput
                        label={"Przedmiot"}
                        value={selectedRow.subject}
                        mode="outlined"
                        onChangeText={(value) => setSelectedRow(prev => { return { ...prev, subject: value } })}
                    />
                    <TextInput
                        label={"Poziom"}
                        value={selectedRow.level}
                        mode="outlined"
                        onChangeText={(value) => setSelectedRow(prev => { return { ...prev, level: value } })}
                    />
                    <TextInput
                        label={"Cena"}
                        value={selectedRow.price.toString()}
                        mode="outlined"
                        onChangeText={(value) => setSelectedRow(prev => { return { ...prev, price: value } })}
                        keyboardType="number-pad"
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={dialogDismiss}>Anuluj</Button>
                    {
                        !(selectedRow.key === undefined) &&
                        <Button onPress={dialogDelete}>Usuń</Button>
                    }

                    <Button onPress={dialogSave}>Zapisz</Button>
                </Dialog.Actions>
            </Dialog>
            <Snackbar visible={snackbarMessage.length != 0} onDismiss={() => setSnackbarMessage("")}>
                <Text style={{ color: theme.colors.inverseOnSurface }}>{snackbarMessage}</Text>
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContainer: {
        gap: 20
    },
    dialogContainer: {
        gap: 5
    },
    addNewButton: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
});