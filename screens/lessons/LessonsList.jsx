import { useContext, useState } from "react";
import { Button, Card, Chip, Dialog, Icon, IconButton, Text, useTheme } from "react-native-paper";
import { DatabaseContext } from "../../App";
import { FlatList, StyleSheet, useColorScheme, View } from "react-native";
import { possibleStatuses } from "../../constants/const";
import { FloatingIconButton } from "../../components/floatingIconButton";

let db = null;
let statuses = [];

function LessonTile({ lesson, deleteAction = (id) => { }, editAction = (id) => { }, detailsAction = (id) => { } }) {
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

    const student = db.get("students", lesson.student_id);
    const status = statuses[lesson.status];

    return (
        <>
            <Card mode="contained" style={{ marginVertical: 10, paddingRight: 15 }} theme={theme}>
                <Card.Title title={student.name + " " + student.surname}
                    titleStyle={{ fontSize: 26 }}
                    right={() => <Chip style={{
                        backgroundColor: status.colors.background
                    }}
                        // change status on long press
                        onLongPress={() => {
                            lesson.status++;
                            lesson.status %= 3;
                            db.update("lessons", lesson, lesson.id);
                        }}
                    >
                        <Text style={{ color: status.colors.onBackground }}>{status.label}</Text>
                    </Chip>}
                />
                <Card.Content>
                    <View style={styles.dataContainer}>
                        <Icon size={20} source={"clock"} />
                        <Text style={styles.text}>{lesson.date} {"\u2022"} {lesson.hour}</Text>
                    </View>
                    <View style={styles.dataContainer}>
                        <Icon size={20} source={"school"} />
                        <Text style={styles.text}>{lesson.subject} {"\u2022"} {lesson.level}</Text>
                    </View>
                    <View style={styles.dataContainer}>
                        <Icon size={20} source={"notebook"} />
                        <Text style={styles.text}>{lesson.topic}</Text>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <IconButton icon={"delete"} iconColor={theme.colors.error} onPress={() => { deleteAction(lesson.id) }} />
                    <IconButton icon={"dots-horizontal-circle-outline"} mode="outlined" onPress={() => { detailsAction(lesson.id) }} />
                    <IconButton icon={"text-box-edit"} mode="outlined" onPress={() => editAction(lesson.id)} />
                </Card.Actions>
            </Card>
        </>
    );
}

export default function LessonsListScreen({ navigation }) {
    const theme = useTheme();
    db = useContext(DatabaseContext);
    statuses = useColorScheme() == "dark" ? possibleStatuses.dark : possibleStatuses.light;

    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isDeleteDialogVisiable, setDeleteDialogVisiable] = useState(false);
    const [isDetailsDialogVisiable, setDetailsDialogVisiable] = useState(false);

    const handleDelete = () => {
        db.remove("lessons", selectedLesson.id);
        setDeleteDialogVisiable(false);
    };

    const dismissDialog = () => {
        setDeleteDialogVisiable(false);
        setDetailsDialogVisiable(false);
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {
                db.lessons.length == 0 &&
                <Text variant="displaySmall" style={{ flex: 1, textAlign: "center", marginVertical: 50 }}>Brak lekcji</Text>
            }

            {
                db.lessons.length != 0 &&
                <FlatList
                    data={db.lessons}
                    renderItem={({ item }) =>
                        <LessonTile lesson={item}
                            deleteAction={(id) => {
                                setSelectedLesson(db.get("lessons", id));
                                setDeleteDialogVisiable(true);
                            }}
                            detailsAction={(id) => {
                                setSelectedLesson(db.get("lessons", id));
                                setDetailsDialogVisiable(true);
                            }}
                            editAction={(id) => {
                                navigation.navigate("EditLesson", { studentID: id });
                            }}
                        />
                    }
                />
            }

            <FloatingIconButton
                icon={"plus"}
                onPress={() => navigation.navigate("EditLesson")}
                right={20}
                bottom={20}
            />

            {/* delete dialog */}
            <Dialog visible={isDeleteDialogVisiable}
                theme={theme}
                dismissable={true}
                dismissableBackButton={true}
                onDismiss={dismissDialog}
            >
                <Dialog.Title>Czy na pewno chcesz usunąć ucznia?</Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={dismissDialog}>Anuluj</Button>
                    <Button onPress={handleDelete}>Potwierdź</Button>
                </Dialog.Actions>
            </Dialog>

            {/* details action */}
            <Dialog visible={isDetailsDialogVisiable}
                theme={theme}
                dismissable={true}
                dismissableBackButton={true}
                onDismiss={dismissDialog}
            >
                <Dialog.Title>Szczegóły</Dialog.Title>
                {

                    selectedLesson &&
                    <Dialog.Content>

                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text variant="bodyMedium">ID:</Text>
                            <Text variant="bodyMedium">{selectedLesson.id}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text variant="bodyMedium">ID ucznia:</Text>
                            <Text variant="bodyMedium">{selectedLesson.student_id}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text variant="bodyMedium">Data:</Text>
                            <Text variant="bodyMedium">{selectedLesson.date}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text variant="bodyMedium">Godzina:</Text>
                            <Text variant="bodyMedium">{selectedLesson.hour}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text variant="bodyMedium">Czas trwania:</Text>
                            <Text variant="bodyMedium">{selectedLesson.duration}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text variant="bodyMedium">Przedmiot:</Text>
                            <Text variant="bodyMedium">{selectedLesson.subject}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text variant="bodyMedium">Poziom:</Text>
                            <Text variant="bodyMedium">{selectedLesson.level}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text variant="bodyMedium">Cena:</Text>
                            <Text variant="bodyMedium">{selectedLesson.price}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text variant="bodyMedium">Status:</Text>
                            <Text variant="bodyMedium">{possibleStatuses[selectedLesson.status].label}</Text>
                        </View>
                    </Dialog.Content>
                }
                <Dialog.Actions>
                    <Button onPress={dismissDialog}>Cofnij</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
}