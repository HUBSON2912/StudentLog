import { useContext, useState } from "react";
import { Button, Card, Dialog, Icon, Text, useTheme } from "react-native-paper";
import { DatabaseContext } from "../../App";
import { FlatList, StyleSheet, View } from "react-native";
import { possibleForms, remotelyForm, stationaryForm } from "../../constants/const";

function StudentTile({ student }) {
    const theme = useTheme();
    const styles = StyleSheet.create({
        dataContainer: {
            flexDirection: "row",
            gap: 10,
            alignContent: "center",
            alignItems: "center"
        },
        text: {
            fontSize: 18
        },
    });

    const [isDeleteDialogVisiable, setDeleteDialogVisiable] = useState(false);

    return (
        <>
            <Card mode="contained" style={{ marginVertical: 10, paddingRight: 15 }} theme={theme}>
                <Card.Title title={student.name + " " + student.surname}
                    titleStyle={{ fontSize: 26 }}
                    right={() => <Icon size={50} source={possibleForms[student.form].icon}
                        color={theme.colors.primary} />}
                />
                <Card.Content>
                    <View style={styles.dataContainer}>
                        <Icon size={20} source={"phone"} />
                        <Text style={styles.text}>{student.phone}</Text>
                    </View>
                    <View style={styles.dataContainer}>
                        <Icon size={20} source={"email-outline"} />
                        <Text style={styles.text}>{student.email}</Text>
                    </View>
                    {
                        remotelyForm.includes(student.form) &&
                        <>
                            <View style={styles.dataContainer}>
                                <Icon size={20} source={"laptop"} />
                                <Text style={styles.text}>{student.platform} {"\u2022"} {student.nick}</Text>
                            </View>
                        </>
                    }
                    {
                        stationaryForm.includes(student.form) &&
                        <>
                            <View style={styles.dataContainer}>
                                <Icon size={20} source={"home"} />
                                <Text style={styles.text}>{student.city} {"\u2022"} {student.address}</Text>
                            </View>
                        </>
                    }
                </Card.Content>
                <Card.Actions>
                    <Button textColor={theme.colors.error} onPress={() => setDeleteDialogVisiable(true)}>Usuń</Button>
                    <Button>Edytuj</Button>
                </Card.Actions>
            </Card>

            {/* fix wrong place for dialog */}
            <Dialog visible={isDeleteDialogVisiable} theme={theme}>
                <Dialog.Title>Tytuł</Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={() => setDeleteDialogVisiable(false)}>Anuluj</Button>
                </Dialog.Actions>
            </Dialog>
        </>
    );
}
/**
 const newStudent = {
            form: form,
            platform: platform,
            nick: nick,
            city: city,
            address: address
        };
 */

export default function StudentsListScreen() {
    const theme = useTheme();
    const db = useContext(DatabaseContext);

    const students = db.students;

    return (
        <View style={{ flex: 1 }}>
            {
                <FlatList
                    data={students}
                    renderItem={({ item }) => <StudentTile student={item} />}
                />
            }
        </View>
    );
}