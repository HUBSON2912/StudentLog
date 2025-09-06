import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const lessons = "lessons";
export const students = "students";

export async function insertIntoLessons(lesson) {
    console.log(lesson);
    try {

        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
        await db.executeSql(
            `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            year INTEGER,
            month INTEGER,
            day INTEGER,
            hour INTEGER,
            minute INTEGER,
            topic TEXT,
            duration INTEGER,
            price INTEGER,
            status INTEGER
        );`);

        const insertRes = await db.executeSql(`INSERT INTO ${lessons} 
                            (student_id, subject, level, year, month, day, hour, minute, topic, duration, price, status)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                lesson.student_id,
                lesson.subject,
                lesson.level,
                lesson.year,
                lesson.month,
                lesson.day,
                lesson.hour,
                lesson.minute,
                lesson.topic,
                lesson.duration,
                lesson.price,
                lesson.status
            ]
        );
        return insertRes[0].insertId;
    }
    catch (error) {
        console.error('Error inserting lesson:', error);
    }
}

export async function updateIDLessons(id, data) {
    try {

        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })
        await db.executeSql(
            `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            year INTEGER,
            month INTEGER,
            day INTEGER,
            hour INTEGER,
            minute INTEGER,
            topic TEXT,
            duration INTEGER,
            price INTEGER,
            status INTEGER
            );`);
        return await db.executeSql(
            `UPDATE ${lessons} SET 
            student_id = ?,
            subject = ?,
            level = ?,
            year = ?,
            month = ?,
            day = ?,
            hour = ?,
            minute = ?,
            topic = ?,
            duration = ?,
            price = ?,
            status = ?
            WHERE id = ?`,
            [
                data.student_id,
                data.subject,
                data.level,
                data.year,
                data.month,
                data.day,
                data.hour,
                data.minute,
                data.topic,
                data.duration,
                data.price,
                data.status,
                id
            ]
        );
    } catch (error) {
        console.error(error);
    }
}

export async function getAllLessons() {

    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            year INTEGER,
            month INTEGER,
            day INTEGER,
            hour INTEGER,
            minute INTEGER,
            topic TEXT,
            duration INTEGER,
            price INTEGER,
            status INTEGER
        );`);

    const [rows] = await db.executeSql(`SELECT ${lessons}.id, ${lessons}.student_id, ${lessons}.subject, ${lessons}.level, ${lessons}.year, ${lessons}.month, ${lessons}.day, ${lessons}.hour, ${lessons}.minute, ${lessons}.topic, ${lessons}.duration, ${lessons}.price, ${lessons}.status, ${students}.name, ${students}.surname FROM ${lessons} INNER JOIN ${students} ON ${students}.id=${lessons}.student_id;`);
    const result = [];

    for (let i = 0; i < rows.rows.length; i++)
        result.push(rows.rows.item(i));

    return result;
}


export async function getByIDLessons(id) {

    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            year INTEGER,
            month INTEGER,
            day INTEGER,
            hour INTEGER,
            minute INTEGER,
            topic TEXT,
            duration INTEGER,
            price INTEGER,
            status INTEGER
        );`)
    const [rows] = await db.executeSql(`SELECT * FROM ${lessons} WHERE id=${id}`);
    const result = rows.rows.item(0);
    return result;
}

export async function deleteIDLessons(id) {
    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            year INTEGER,
            month INTEGER,
            day INTEGER,
            hour INTEGER,
            minute INTEGER,
            topic TEXT,
            duration INTEGER,
            price INTEGER,
            status INTEGER
        );`)
    const [rows] = await db.executeSql(`DELETE FROM ${lessons} WHERE id = ${id};`);
}

export async function deleteStudentsLessons(student_id) {
    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            year INTEGER,
            month INTEGER,
            day INTEGER,
            hour INTEGER,
            minute INTEGER,
            topic TEXT,
            duration INTEGER,
            price INTEGER,
            status INTEGER
        );`)
    const [rows] = await db.executeSql(`DELETE FROM ${lessons} WHERE student_id = ${student_id};`);
}

export async function getTotalEarning() {
    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            year INTEGER,
            month INTEGER,
            day INTEGER,
            hour INTEGER,
            minute INTEGER,
            topic TEXT,
            duration INTEGER,
            price INTEGER,
            status INTEGER
        );`)
    // status=2 means that I got the money for the lesson (look: possibleStatus in statuslabel.jsx)
    const [rows] = await db.executeSql(`SELECT Sum(price) AS earnings FROM ${lessons} WHERE status=2`);
    const result = rows.rows.item(0);
    return result.earnings ? result.earnings : 0;
}

export async function dropDBLessons() {
    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            year INTEGER,
            month INTEGER,
            day INTEGER,
            hour INTEGER,
            minute INTEGER,
            topic TEXT,
            duration INTEGER,
            price INTEGER,
            status INTEGER
        );`)
    const [rows] = await db.executeSql(`DROP TABLE ${lessons};`);
}

export async function getEarningsPerStudent() {

    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${lessons} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject TEXT,
            level TEXT,
            year INTEGER,
            month INTEGER,
            day INTEGER,
            hour INTEGER,
            minute INTEGER,
            topic TEXT,
            duration INTEGER,
            price INTEGER,
            status INTEGER
        );`);

    const [rows] = await db.executeSql(
        `SELECT s.id AS student_id, Sum(l.price) AS money, Count(l.id) AS lessons_amount 
        FROM students s 
        LEFT JOIN lessons l ON l.student_id = s.id AND l.status = 2
        GROUP BY s.id;`
    );
    const result = [];

    for (let i = 0; i < rows.rows.length; i++)
        result.push(rows.rows.item(i));

    return result;
}