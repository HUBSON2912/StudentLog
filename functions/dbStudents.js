import { useState } from 'react';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

// possible tables name
const students = "students";
const lessons = "lessons";
const priceList = "price_list";

export function insertIntoStudents(student) {
    SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })
        .then(db => {
            return db.executeSql(
                `CREATE TABLE IF NOT EXISTS students (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    surname TEXT,
                    phone TEXT,
                    email TEXT,
                    form INTEGER,
                    platform TEXT,
                    nick TEXT,
                    city TEXT,
                    street TEXT,
                    house_nr TEXT,
                    flat_nr TEXT
                );`
            ).then(() => db);
        })
        .then(db => {
            return db.executeSql(
                `INSERT INTO students 
                    (name, surname, phone, email, form, platform, nick, city, street, house_nr, flat_nr)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    student.name,
                    student.surname,
                    student.phone,
                    student.email,
                    student.form,
                    student.platform,
                    student.nick,
                    student.city,
                    student.street,
                    student.house_nr,
                    student.flat_nr
                ]
            );
        })
        .then(() => {
            console.log('Student inserted successfully');
        })
        .catch(error => {
            console.error('Error inserting student:', error);
        });
}

export function updateIDStudents(id, data) {
    console.log("aaa");
    SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })
        .then(db => {
            return db.executeSql(
                `CREATE TABLE IF NOT EXISTS students (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    surname TEXT,
                    phone TEXT,
                    email TEXT,
                    form INTEGER,
                    platform TEXT,
                    nick TEXT,
                    city TEXT,
                    street TEXT,
                    house_nr TEXT,
                    flat_nr TEXT
                );`
            ).then(() => db);
        })
        .then(db => {
            return db.executeSql(
                `UPDATE students SET 
                    name = ?, 
                    surname = ?, 
                    phone = ?, 
                    email = ?, 
                    form = ?, 
                    platform = ?, 
                    nick = ?, 
                    city = ?, 
                    street = ?, 
                    house_nr = ?, 
                    flat_nr = ?
                 WHERE id = ?`,
                [
                    data.name,
                    data.surname,
                    data.phone,
                    data.email,
                    data.form,
                    data.platform,
                    data.nick,
                    data.city,
                    data.street,
                    data.house_nr,
                    data.flat_nr,
                    id
                ]
            );
        })
        .then(() => {
            console.log('Student updated successfully');
        })
        .catch(error => {
            console.error('Error updating student:', error);
        });
}

async function __getAllStudents() {

    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            surname TEXT,
            phone TEXT,
            email TEXT,
            form INTEGER,
            platform TEXT,
            nick TEXT,
            city TEXT,
            street TEXT,
            house_nr TEXT,
            flat_nr TEXT
        );`);
    const [rows] = await db.executeSql('SELECT * FROM students');
    const result = [];

    for (let i = 0; i < rows.rows.length; i++)
        result.push(rows.rows.item(i));

    return result;
}

async function __getByIDStudents(id) {

    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            surname TEXT,
            phone TEXT,
            email TEXT,
            form INTEGER,
            platform TEXT,
            nick TEXT,
            city TEXT,
            street TEXT,
            house_nr TEXT,
            flat_nr TEXT
        );`);
    const [rows] = await db.executeSql(`SELECT * FROM students WHERE id=${id}`);
    const result = rows.rows.item(0);
    return result;
}

export async function deleteIDStudent(id) {
    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            surname TEXT,
            phone TEXT,
            email TEXT,
            form INTEGER,
            platform TEXT,
            nick TEXT,
            city TEXT,
            street TEXT,
            house_nr TEXT,
            flat_nr TEXT
        );`);
    const [rows] = await db.executeSql(`DELETE FROM students WHERE id = ${id};`);
}

export function getAllStudents() {
    const [students, setStudents] = useState([]);
    __getAllStudents().then(setStudents);
    return students;
}

export function getByIDStudents(id) {
    const [student, setStudent] = useState({});
    __getByIDStudents(id).then(setStudent);
    return student;
}



// db.executeSql(
//         `CREATE TABLE IF NOT EXISTS students (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             student_id INTEGER,
//             subject TEXT,
//             level TEXT,
//             date TEXT,
//             topic TEXT,
//             duration INTEGER,
//             price INTEGER
//         );`);