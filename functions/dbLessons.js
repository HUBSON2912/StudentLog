import { useState } from 'react';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const lessons = "lessons";

export function insertIntoLessons(lesson) {
    SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })
        .then(db => {
            return db.executeSql(
                `CREATE TABLE IF NOT EXISTS ${lessons} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_id INTEGER,
                    subject TEXT,
                    level TEXT,
                    date TEXT,
                    topic TEXT,
                    duration INTEGER,
                    price INTEGER
                );`).then(() => db);
        })
        .then(db => {
            return db.executeSql(
                `INSERT INTO ${lessons} 
                    (student_id, subject, level, date, topic, duration, price)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    lesson.student_id,
                    lesson.subject,
                    lesson.level,
                    lesson.date,
                    lesson.topic,
                    lesson.duration,
                    lesson.price
                ]
            );
        })
        .then(() => {
            console.log('Lesson inserted successfully');
        })
        .catch(error => {
            console.error('Error inserting lesson:', error);
        });
}

export function updateIDLessons(id, data) {
    console.log("aaa");
    SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })
        .then(db => {
            return db.executeSql(
                `CREATE TABLE IF NOT EXISTS ${lessons} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_id INTEGER,
                    subject TEXT,
                    level TEXT,
                    date TEXT,
                    topic TEXT,
                    duration INTEGER,
                    price INTEGER
                );`).then(() => db);
        })
        .then(db => {
            return db.executeSql(
                `UPDATE ${lessons} SET 
                    student_id = ?,
                    subject = ?,
                    level = ?,
                    date = ?,
                    topic = ?,
                    duration = ?,
                    price = ?
                 WHERE id = ?`,
                [
                    data.student_id,
                    data.subject,
                    data.level,
                    data.date,
                    data.topic,
                    data.duration,
                    data.price,
                    id
                ]
            );
        })
        .then(() => {
            console.log('Lesson updated successfully');
        })
        .catch(error => {
            console.error('Error while updating lesson:', error);
        });
}

async function __getAllLessons() {

    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            date TEXT,
            topic TEXT,
            duration INTEGER,
            price INTEGER
        );`);

    const [rows] = await db.executeSql(`SELECT * FROM ${lessons}`);
    const result = [];

    for (let i = 0; i < rows.rows.length; i++)
        result.push(rows.rows.item(i));

    return result;
}

async function __getByIDLessons(id) {

    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            date TEXT,
            topic TEXT,
            duration INTEGER,
            price INTEGER
        );`)
    const [rows] = await db.executeSql(`SELECT * FROM ${lessons} WHERE id=${id}`);
    const result = rows.rows.item(0);
    return result;
}

export async function deleteIDStudent(id) {
    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            date TEXT,
            topic TEXT,
            duration INTEGER,
            price INTEGER
        );`)
    const [rows] = await db.executeSql(`DELETE FROM ${lessons} WHERE id = ${id};`);
}

export function getAllLessons() {
    const [lessons, setLessons] = useState([]);
    __getAllLessons().then(setLessons);
    return lessons;
}

export function getByIDLessons(id) {
    const [student, setStudent] = useState({});
    __getByIDLessons(id).then(setStudent);
    return student;
}



