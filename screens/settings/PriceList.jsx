import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, DataTable, Dialog, FAB, Snackbar, Text, TextInput, useTheme } from "react-native-paper";
import { DatabaseContext } from "../../App";

export default function PriceListScreen() {
    const theme = useTheme();
    const db = useContext(DatabaseContext);

    // const [db.pricelist, setSubjectLevelPrice] = useState([]);

    const [selectedRow, setSelectedRow] = useState({ id: undefined, subject: "", level: "", price: "" });
    const [dialogShown, setDialogShows] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

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
        },
        dialogTextInput: {
            backgroundColor: theme.colors.elevation.level3
        },
        noDataText: {
            flex: 1,
            textAlign: "center",
            marginVertical: 50
        },
    });

    function clearSelectedRow() {
        setSelectedRow({ id: undefined, subject: "", level: "", price: "" });
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
            let buff = db.pricelist;
            return (buff.filter(x => x.subject == subject && x.level == level).length != 0);
        }

        if (!isInputCorrect()) {
            setSnackbarMessage("Uzupełnij wszystkie dane. Cena może zawierać wyłącznie cyfry.");
            dialogDismiss();
            return;
        }


        if (selectedRow.id === undefined) {
            if (isDuplicate()) {
                setSnackbarMessage("Już istnieje taki wpis.");
                dialogDismiss();
                return;
            }
            db.insert("pricelist", selectedRow);
        }
        else {
            db.update("pricelist", selectedRow, selectedRow.id)
        }
        dialogDismiss();
    }

    function dialogDelete() {
        if (selectedRow.id === undefined)
            return;
        db.remove("pricelist", selectedRow.id);
        dialogDismiss();
    }

    return (
        <View style={styles.container}>
            {
                db.pricelist.length == 0 &&
                <Text variant="displaySmall" style={styles.noDataText}>Brak danych</Text>
            }
            {
                db.pricelist.length != 0 &&
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Przedmiot</DataTable.Title>
                            <DataTable.Title>Poziom</DataTable.Title>
                            <DataTable.Title numeric>Cena /h</DataTable.Title>
                        </DataTable.Header>

                        {
                            db.pricelist.map(({ id, subject, level, price }) => (
                                <DataTable.Row key={id} onPress={() => {
                                    setSelectedRow({ id: id, subject: subject, level: level, price: price.toString() });
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
            }

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
                        style={styles.dialogTextInput}
                    />
                    <TextInput
                        label={"Poziom"}
                        value={selectedRow.level}
                        mode="outlined"
                        onChangeText={(value) => setSelectedRow(prev => { return { ...prev, level: value } })}
                        style={styles.dialogTextInput}
                    />
                    <TextInput
                        label={"Cena /h"}
                        value={selectedRow.price.toString()}
                        mode="outlined"
                        onChangeText={(value) => setSelectedRow(prev => { return { ...prev, price: value } })}
                        idboardType="number-pad"
                        style={styles.dialogTextInput}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={dialogDismiss}>Anuluj</Button>
                    {
                        !(selectedRow.id === undefined) &&
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