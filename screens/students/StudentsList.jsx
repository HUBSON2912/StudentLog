import { useContext, useState } from "react";
import { Avatar, Button, Card, Dialog, Icon, Text, useTheme } from "react-native-paper";
import { DatabaseContext } from "../../App";
import { FlatList, StyleSheet, View } from "react-native";
import { possibleForms, remotelyForm, stationaryForm } from "../../constants/const";
import { FloatingIconButton } from "../../components/floatingIconButton";

function StudentTile({ student, deleteAction = (id) => { }, editAction = (id) => { } }) {
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
                    <Button textColor={theme.colors.error} onPress={() => { deleteAction(student.id) }}>Usuń</Button>
                    <Button>Edytuj</Button>
                </Card.Actions>
            </Card>
        </>
    );
}

export default function StudentsListScreen() {
    const theme = useTheme();
    const db = useContext(DatabaseContext);

    const students = db.students;
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDeleteDialogVisiable, setDeleteDialogVisiable] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            {
                students.length == 0 &&
                <Text variant="displaySmall" style={{flex:1, textAlign: "center", marginVertical: 50}}>Brak uczniów</Text>
            }

            {
                students.length != 0 &&
                <FlatList
                    data={students}
                    renderItem={({ item }) =>
                        <StudentTile student={item}
                            deleteAction={(id) => {
                                setSelectedStudent(db.get("students", id));
                                setDeleteDialogVisiable(true);
                            }} />
                    }
                />
            }
            <FloatingIconButton icon={"plus"} onPress={()=>{console.log("aaa")}} right={0} bottom={20}/>

            {/* delete dialog */}
            <Dialog visible={isDeleteDialogVisiable} theme={theme} dismissable={true} dismissableBackButton={true} onDismiss={() => setDeleteDialogVisiable(false)}>
                <Dialog.Title>Czy na pewno chcesz usunąć ucznia?</Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={() => setDeleteDialogVisiable(false)}>Anuluj</Button>
                    <Button onPress={() => {
                        db.remove("students", selectedStudent.id);
                        setDeleteDialogVisiable(false)
                    }}>Potwierdź</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
}