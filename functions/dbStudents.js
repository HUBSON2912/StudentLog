import { useState } from 'react';
import SQLite from 'react-native-sqlite-storage';
import { deleteStudentsLessons, getEarningsPerStudent } from './dbLessons';

SQLite.enablePromise(true);

// possible tables name
const students = "students";
const lessons = "lessons";
const priceList = "price_list";

export async function insertIntoStudents(student) {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })
        db.executeSql(
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
        const insertRes = await db.executeSql(
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
        return insertRes[0].insertId;
    } catch(error) {
        console.log(error);
    }
}

export function updateIDStudents(id, data) {
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

export async function getAllStudents() {

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
    const [students] = await db.executeSql('SELECT * FROM students;');
    const moneyPerStudent = await getEarningsPerStudent();
    const result = [];

    for (let i = 0; i < students.rows.length; i++) {
        let newItem = { ...students.rows.item(i) };
        for (let j = 0; j < moneyPerStudent.length; j++) {
            if (newItem.id == moneyPerStudent[j].student_id) {
                newItem = {
                    ...newItem,
                    money: moneyPerStudent[j].money,
                    lessons_amount: moneyPerStudent[j].lessons_amount
                }
                result.push(newItem);
                break;
            }
        }
    }

    return result;
}

export async function getByIDStudents(id) {

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
    deleteStudentsLessons(id);
}

export async function dropDBStudent() {
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
    const [rows] = await db.executeSql(`DROP TABLE students;`);
}