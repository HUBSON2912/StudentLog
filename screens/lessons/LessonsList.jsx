import { useContext, useEffect, useState } from "react";
import { Appbar, Button, Card, Chip, Dialog, FAB, Icon, IconButton, Text, useTheme } from "react-native-paper";
import { DatabaseContext } from "../../App";
import { FlatList, RefreshControl, StyleSheet, useColorScheme, View } from "react-native";
import { lessonsOrder, possibleStatuses } from "../../constants/const";
import { DDMMYYYYToDate } from "../../functions/misc/date";

let db = null;
let statuses = [];

function LessonTile({ lesson, deleteAction = (id) => { }, editAction = (id) => { }, detailsAction = (id) => { } }) {
    const theme = useTheme();

    const student = db.get("students", lesson.student_id);

    const status = statuses[lesson.status];

    return (
        <>
            <Card mode="contained" style={{ marginVertical: 10, paddingRight: 15 }} theme={theme}>
                <Card.Title title={student.name + " " + student.surname}
                    titleStyle={{ fontSize: 22 }}
                    right={() => <Chip style={{
                        backgroundColor: status.colors.background,
                    }}
                        // change status on long press
                        onLongPress={() => {
                            lesson.status++;
                            lesson.status %= 3;
                            db.update("lessons", lesson, lesson.id);
                        }}
                    >
                        <Text variant={"bodySmall"} style={{ color: status.colors.onBackground }}>{status.label}</Text>
                    </Chip>}
                />
                <Card.Content>
                    <View style={styles.dataContainer}>
                        <Icon size={16} source={"cash"} />
                        <Text style={styles.text}>{lesson.price} zł</Text>
                    </View>
                    <View style={styles.dataContainer}>
                        <Icon size={16} source={"clock"} />
                        <Text style={styles.text}>{lesson.date} {"\u2022"} {lesson.hour}</Text>
                    </View>
                    <View style={styles.dataContainer}>
                        <Icon size={16} source={"school"} />
                        <Text style={styles.text}>{lesson.subject} {"\u2022"} {lesson.level}</Text>
                    </View>
                    <View style={styles.dataContainer}>
                        <Icon size={16} source={"notebook"} />
                        <Text style={{ ...styles.text, color: lesson.topic ? theme.colors.onBackground : theme.colors.error }}>{(!!lesson.topic) ? lesson.topic : "Brak tematu"}</Text>
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


    const [filter, setFilter] = useState({
        active: false,
        order: lessonsOrder[0],
        contain: null,
        student: null,
        subject: null,
        level: null,
        dateRange: { since: null, to: null },
        priceRange: { min: null, max: null },
        durationRange: { min: null, max: null },
        status: [],
    });

    const doFilter = (_stud) => {
        if (!_stud) {
            return [];
        }

        _stud.sort((a, b) => {
            const params = filter.order.paramName;
            for (let i = 0; i < params.length; i++) {
                if (a[params[i]] < b[params[i]]) {
                    return -1;
                } else if (a[params[i]] > b[params[i]]) {
                    return 1;
                }
            }
            return 0;
        });
        if (!filter.order.ascending) {
            _stud.reverse();
        }
        if (!filter.active) {
            return _stud;
        }

        if (filter.contain) {
            _stud = _stud.filter(x => JSON.stringify(x).toUpperCase().includes(filter.contain.toUpperCase()));
        }

        if (filter.subject) {
            _stud = _stud.filter(x => x.subject.toUpperCase().includes(filter.subject.toUpperCase()));
        }
        if (filter.level) {
            _stud = _stud.filter(x => x.level.toUpperCase().includes(filter.level.toUpperCase()));
        }
        if (filter.status.length!=0) {
            _stud = _stud.filter(x => filter.status.includes(x.status));
        }
        if (filter.student) {
            _stud = _stud.filter(x => x.student_id==filter.student);
        }
        if (filter.dateRange.since) {
            _stud = _stud.filter(x => DDMMYYYYToDate(x.date).valueOf()>=filter.dateRange.since.valueOf());
        }
        if (filter.dateRange.to) {
            _stud = _stud.filter(x => DDMMYYYYToDate(x.date).valueOf()<=filter.dateRange.to.valueOf());
        }
        if (filter.priceRange.min) {
            _stud = _stud.filter(x => x.price>=filter.priceRange.min);
        }
        if (filter.priceRange.max) {
            _stud = _stud.filter(x => x.price<=filter.priceRange.max);
        }
        if (filter.durationRange.min) {
            _stud = _stud.filter(x => x.duration>=filter.durationRange.min);
        }
        if (filter.durationRange.max) {
            _stud = _stud.filter(x => x.duration<=filter.durationRange.max);
        }
        

        return _stud;
    }

    return (
        <>
            <Appbar style={{ backgroundColor: theme.colors.background }}>
                <Appbar.Content title={`Zarobki: ${doFilter(db.lessons).reduce((prev, curr) => prev + (curr.status == 2 ? curr.price : 0), 0)} zł`} />
                <Appbar.Action icon={filter.active ? "filter-check" : "filter"} onPress={() => navigation.navigate("FilterLessons", { setFilter: setFilter, activeFilter: filter })} size={28} />
            </Appbar>


            <View style={styles.constainer}>
                {
                    doFilter(db.lessons).length == 0 &&
                    <Text variant="displaySmall" style={styles.noDataText}>Brak lekcji</Text>
                }

                {
                    doFilter(db.lessons).length != 0 &&
                    <FlatList
                        data={doFilter(db.lessons)}
                        renderItem={({ item }) => <LessonTile lesson={item}
                            deleteAction={(id) => {
                                setSelectedLesson(db.get("lessons", id));
                                setDeleteDialogVisiable(true);
                            }}
                            detailsAction={(id) => {
                                setSelectedLesson(db.get("lessons", id));
                                setDetailsDialogVisiable(true);
                            }}
                            editAction={(id) => {
                                navigation.navigate("EditLesson", { lessonID: id });
                            }}
                        />}
                    />
                }
                <FAB
                    icon={"plus"}
                    style={{ ...styles.plusButton }}
                    customSize={48}
                    onPress={() => navigation.navigate("EditLesson")}
                />

                {/* delete dialog */}
                <Dialog visible={isDeleteDialogVisiable}
                    theme={theme}
                    dismissable={true}
                    dismissableBackButton={true}
                    onDismiss={dismissDialog}
                >
                    <Dialog.Title>Czy na pewno chcesz usunąć wpis?</Dialog.Title>
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

                            <View style={styles.detailsContainer}>
                                <Text variant="bodyMedium">ID:</Text>
                                <Text variant="bodyMedium">{selectedLesson.id}</Text>
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text variant="bodyMedium">ID ucznia:</Text>
                                <Text variant="bodyMedium">{selectedLesson.student_id}</Text>
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text variant="bodyMedium">Data:</Text>
                                <Text variant="bodyMedium">{selectedLesson.date}</Text>
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text variant="bodyMedium">Godzina:</Text>
                                <Text variant="bodyMedium">{selectedLesson.hour}</Text>
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text variant="bodyMedium">Czas trwania:</Text>
                                <Text variant="bodyMedium">{selectedLesson.duration}</Text>
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text variant="bodyMedium">Przedmiot:</Text>
                                <Text variant="bodyMedium">{selectedLesson.subject}</Text>
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text variant="bodyMedium">Poziom:</Text>
                                <Text variant="bodyMedium">{selectedLesson.level}</Text>
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text variant="bodyMedium">Cena:</Text>
                                <Text variant="bodyMedium">{selectedLesson.price}</Text>
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text variant="bodyMedium">Status:</Text>
                                <Text variant="bodyMedium">{statuses[selectedLesson.status].label}</Text>
                            </View>
                        </Dialog.Content>
                    }
                    <Dialog.Actions>
                        <Button onPress={dismissDialog}>Cofnij</Button>
                    </Dialog.Actions>
                </Dialog>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        paddingHorizontal: 20
    },
    dataContainer: {
        flexDirection: "row",
        gap: 10,
        alignContent: "center",
        alignItems: "center"
    },
    text: {
        fontSize: 15
    },
    plusButton: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    noDataText: {
        flex: 1,
        textAlign: "center",
        marginVertical: 50
    },
    detailsContainer: {
        flexDirection: "row",
        gap: 5
    }
});