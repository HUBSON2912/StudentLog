import { useContext, useEffect, useRef, useState } from "react";
import { Appbar, Avatar, Button, Card, Dialog, Icon, IconButton, Modal, Portal, Searchbar, Text, useTheme } from "react-native-paper";
import { DatabaseContext } from "../../App";
import { Animated, FlatList, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { possibleForms, remotelyForm, stationaryForm } from "../../constants/const";
import { FloatingIconButton } from "../../components/floatingIconButton";


function StudentTile({ student, deleteAction = (id) => { }, editAction = (id) => { }, detailsAction = (id) => { } }) {
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
        container: {
            marginVertical: 10,
            paddingRight: 15
        }
    });

    return (
        <>
            <Card mode="contained" style={styles.container} theme={theme}>
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
                    <IconButton icon={"delete"} iconColor={theme.colors.error} onPress={() => { deleteAction(student.id) }} />
                    <IconButton icon={"dots-horizontal-circle-outline"} mode="outlined" onPress={() => { detailsAction(student.id) }} />
                    <IconButton icon={"text-box-edit"} mode="outlined" onPress={() => editAction(student.id)} />
                </Card.Actions>
            </Card>
        </>
    );
}

export default function StudentsListScreen({ navigation }) {
    const theme = useTheme();
    const db = useContext(DatabaseContext);

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDeleteDialogVisiable, setDeleteDialogVisiable] = useState(false);
    const [isDetailsDialogVisiable, setDetailsDialogVisiable] = useState(false);
    const [studentDetails, setStudentDetails] = useState(null);

    const handleDelete = () => {
        db.remove("students", selectedStudent.id);
        setDeleteDialogVisiable(false);
    };

    const dismissDialog = () => {
        setDeleteDialogVisiable(false);
        setDetailsDialogVisiable(false);
    };

    // filters
    const [filter, setFilter] = useState({
        active: false,
        contain: null,
        forms: [],
        platform: null,
        city: null,
        incomesRange: { min: null, max: null },
        unpaid: null,
        planned: null,
        totalTimeRange: { min: null, max: null }
    });

    const doFilter = (_stud) => {
        if (!filter.active) {
            return _stud;
        }

        if (filter.contain) {
            _stud = _stud.filter(item =>
                Object.values(item)
                    .map(x => String(x))
                    .map(x => x.toLowerCase())
                    .reduce((res, val) => { return res.concat(val).concat("__"); }, "")
                    .includes(filter.contain.toLowerCase())
            );
        }
        if (filter.city) {
            _stud = _stud.filter(item => item.city.toLowerCase().includes(filter.city.toLowerCase()));
        }
        if (filter.platform) {
            _stud = _stud.filter(item => item.platform.toLowerCase().includes(filter.platform.toLowerCase()));
        }
        if (filter.incomesRange.min) {
            _stud = _stud.filter(item => db.getDetails("students", item.id).totalMoney >= filter.incomesRange.min);
        }
        if (filter.incomesRange.max) {
            _stud = _stud.filter(item => db.getDetails("students", item.id).totalMoney <= filter.incomesRange.max);
        }
        if (filter.totalTimeRange.min) {
            _stud = _stud.filter(item => db.getDetails("students", item.id).totalTime >= filter.totalTimeRange.min);
        }
        if (filter.totalTimeRange.max) {
            _stud = _stud.filter(item => db.getDetails("students", item.id).totalTime <= filter.totalTimeRange.max);
        }
        if(filter.unpaid) {
            _stud = _stud.filter(item => db.getDetails("students", item.id).lessonsAmount.done != 0);
        }
        if(filter.planned) {
            _stud = _stud.filter(item => db.getDetails("students", item.id).lessonsAmount.planned != 0);
        }
        if(filter.forms.length!=0) {
            _stud = _stud.filter(item => filter.forms.includes(item.form));
        }
        return _stud;
    }

    useEffect(() => {
        console.log(filter);
    }, [filter]);

    return (
        <>
            {/* header */}
            <Appbar style={{ backgroundColor: theme.colors.background }}>
                <Appbar.Content title={`Liczba uczniów: ${doFilter(db.students).length}`} />
                <Appbar.Action icon={filter.active ? "filter-check" : "filter"} onPress={() => navigation.navigate("FilterStudents", { setFilter: setFilter, activeFilter: filter })} size={28} />
                <Appbar.Action icon={"swap-vertical"} onPress={() => console.log("sort")} size={28} />
            </Appbar>

            {/* content */}
            <View style={styles.container}>
                {
                    doFilter(db.students).length == 0 &&
                    <Text variant="displaySmall" style={{ flex: 1, textAlign: "center", marginVertical: 50 }}>Brak uczniów</Text>
                }

                {
                    doFilter(db.students).length != 0 &&
                    <>
                        <FlatList
                            data={doFilter(db.students)}
                            renderItem={({ item }) =>
                                <StudentTile student={item}
                                    deleteAction={(id) => {
                                        setSelectedStudent(db.get("students", id));
                                        setDeleteDialogVisiable(true);
                                    }}
                                    detailsAction={(id) => {
                                        setSelectedStudent(db.get("students", id));
                                        setStudentDetails(db.getDetails("students", id));
                                        setDetailsDialogVisiable(true);
                                    }}
                                    editAction={(id) => {
                                        navigation.navigate("EditStudent", { studentID: id });
                                    }}
                                />
                            }
                        />
                    </>
                }

                <FloatingIconButton
                    icon={"plus"}
                    onPress={() => navigation.navigate("EditStudent")}
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
                    <Dialog.Content>
                        <Text variant="bodyMedium">Spowoduje to usunięcie wszystkich zapisanych lekcji z tym uczniem.</Text>
                    </Dialog.Content>
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
                        selectedStudent &&
                        <Dialog.Content>
                            <View style={styles.detailContainer}>
                                <Text variant="bodyMedium">ID:</Text>
                                <Text variant="bodyMedium">{selectedStudent.id}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text variant="bodyMedium">Imię:</Text>
                                <Text variant="bodyMedium">{selectedStudent.name}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text variant="bodyMedium">Nazwisko:</Text>
                                <Text variant="bodyMedium">{selectedStudent.surname}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text variant="bodyMedium">Telefon:</Text>
                                <Text variant="bodyMedium">{selectedStudent.phone}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text variant="bodyMedium">Email:</Text>
                                <Text variant="bodyMedium">{selectedStudent.email}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text variant="bodyMedium">Forma: </Text>
                                <Text variant="bodyMedium">{possibleForms[selectedStudent.form].label}</Text>
                            </View>
                            {
                                remotelyForm.includes(selectedStudent.form) &&
                                <>
                                    <View style={styles.detailContainer}>
                                        <Text variant="bodyMedium">Platforma:</Text>
                                        <Text variant="bodyMedium">{selectedStudent.platform}</Text>
                                    </View>
                                    <View style={styles.detailContainer}>
                                        <Text variant="bodyMedium">Nick:</Text>
                                        <Text variant="bodyMedium">{selectedStudent.nick}</Text>
                                    </View>
                                </>
                            }
                            {
                                stationaryForm.includes(selectedStudent.form) &&
                                <>
                                    <View style={styles.detailContainer}>
                                        <Text variant="bodyMedium">Miejscowość:</Text>
                                        <Text variant="bodyMedium">{selectedStudent.city}</Text>
                                    </View>
                                    <View style={styles.detailContainer}>
                                        <Text variant="bodyMedium">Adres:</Text>
                                        <Text variant="bodyMedium">{selectedStudent.address}</Text>
                                    </View>
                                </>
                            }
                            {
                                studentDetails &&
                                <>
                                    <View style={{ ...styles.detailContainer, marginTop: 10 }}>
                                        <Text variant="bodyMedium">Ilość zajęć Z/W/O:</Text>
                                        <Text variant="bodyMedium">{studentDetails.lessonsAmount.planned}/{studentDetails.lessonsAmount.done}/{studentDetails.lessonsAmount.paid}</Text>
                                    </View>
                                    <View style={styles.detailContainer}>
                                        <Text variant="bodyMedium">Całkowity czas zajęć:</Text>
                                        <Text variant="bodyMedium">{studentDetails.totalTime} h</Text>
                                    </View>
                                    <View style={styles.detailContainer}>
                                        <Text variant="bodyMedium">Zarobki:</Text>
                                        <Text variant="bodyMedium">{studentDetails.totalMoney}</Text>
                                    </View>
                                </>
                            }
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
    container: {
        flex: 1,
        paddingHorizontal: 20
    },
    detailContainer: {
        flexDirection: "row",
        gap: 5
    }
})