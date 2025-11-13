import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export async function createTableL() {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })
        db.executeSql(
            `CREATE TABLE IF NOT EXISTS lessons (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             student_id INTEGER,
             subject TEXT,
             level TEXT,
             duration REAL,
             price INTEGER,
             date TEXT,
             hour TEXT,
             status INTEGER,
             topic TEXT
             );`
        );
    } catch (error) {
        // console.error(`Cannot create the students table: ${JSON.stringify(error)}`);
        return error;
    }
}

export async function insertL(lesson) {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const insertRes = await db.executeSql(
            `INSERT INTO lessons
            (student_id, subject, level, duration, price, date, hour, status, topic)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                lesson.student_id,
                lesson.subject,
                lesson.level,
                lesson.duration,
                lesson.price,
                lesson.date,
                lesson.hour,
                lesson.status,
                lesson.topic
            ]
        );
        return insertRes[0].insertId;
    } catch (error) {
        // console.error(`Error while inserting a new student: ${JSON.stringify(error)}`);
        return error;
    }
}

export async function getAllL() {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const lessons = await db.executeSql(
            `SELECT * FROM lessons`
        );

        let results = [];
        for (let i = 0; i < lessons[0].rows.length; i++) {
            results.push({ ...lessons[0].rows.item(i) });
        }

        return results;
    } catch (error) {
        // console.error(`Error while selecting all students: ${JSON.stringify(error)}`);
        return error;
    }
}

export async function deleteL(id) {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const del = await db.executeSql(
            `DELETE FROM lessons WHERE id=${id}`
        );
    } catch (error) {
        return error;
    }
}

export async function updateL(lesson, id) {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const res = await db.executeSql(
            `UPDATE lessons
            SET student_id=${lesson.student_id},
                subject="${lesson.subject}",
                level="${lesson.level}",
                duration=${lesson.duration},
                price=${lesson.price},
                date="${lesson.date}",
                hour="${lesson.hour}",
                status=${lesson.status},
                topic="${lesson.topic}"
            WHERE id=${id}`
        );
    } catch (error) {
        // console.error(`Error while inserting a new student: ${JSON.stringify(error)}`);
        return error;
    }
}
