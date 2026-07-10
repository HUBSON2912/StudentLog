import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, DataTable, Dialog, Snackbar, Text, TextInput } from "react-native-paper";

export default function PriceListScreen() {
    const [subjectLevelPrice, setSubjectLevelPrice] = useState([
        {
            key: 1,
            subject: "Matematyka",
            level: "Szkoła podstawowa",
            price: 55
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
            subject: "Matematyka",
            level: "Szkoła podstawowa",
            price: 55
        },
        {
            key: 5,
            subject: "Matematyka",
            level: "Szkoła średnia - PP",
            price: 60
        },
        {
            key: 6,
            subject: "Matematyka",
            level: "Szkoła średnia - PR",
            price: 65
        },
        {
            key: 7,
            subject: "Informatyka",
            level: "Szkoła podstawowa",
            price: 55
        },
        {
            key: 8,
            subject: "Matematyka",
            level: "Szkoła średnia - PP",
            price: 60
        },
    ]);

    const [selectedRow, setSelectedRow] = useState({ key: undefined, subject: "", level: "", price: "" });
    const [dialogShown, setDialogShows] = useState(false);
    const [snackbarMessage, setSnackbarMessage]=useState("");

    function clearSelectedRow() {
        setSelectedRow({ key: undefined, subject: "", level: "", price: "" });
    }

    function dialogDismiss() {
        setDialogShows(false);
        clearSelectedRow();
    }

    function validateInt(val) {
        const regex=/^[0-9]*$/gm
        let matched=val.match(regex);
        return !(!(matched))
    }

    function dialogSave() {
        // new values are stored in selectedRow

        if (selectedRow.subject=="" || selectedRow.level=="" || selectedRow.price=="" || !validateInt(selectedRow.price)) {
            setSnackbarMessage("Uzupełnij wszystkie dane");
            dialogDismiss();
            return;
        }

        if (selectedRow.key === undefined) {
            let buff=selectedRow;
            buff.key=subjectLevelPrice[subjectLevelPrice.length-1].key+1;
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
        <View style={{flex: 1}}>
            <ScrollView>
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

                    <DataTable.Row>
                        <Button mode="contained" onPress={() => setDialogShows(true)}>
                            <Text>Press to add new</Text>
                        </Button>
                    </DataTable.Row>
                </DataTable>
            </ScrollView>

            <Dialog visible={dialogShown} dismissable onDismiss={dialogDismiss} >
                <Dialog.Content style={{ gap: 5 }}>
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
            <Snackbar visible={snackbarMessage.length!=0} onDismiss={()=>setSnackbarMessage("")}>
                <Text>{snackbarMessage}</Text>
            </Snackbar>
        </View>
    );
}