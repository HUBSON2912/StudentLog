import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export async function createTableS() {
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
             address TEXT
             );`
        );
    } catch (error) {
        // console.error(`Cannot create the students table: ${JSON.stringify(error)}`);
        return error;
    }
}

export async function insertS(student) {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const insertRes = await db.executeSql(
            `INSERT INTO students 
            (name, surname, phone, email, form, platform, nick, city, address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                student.name,
                student.surname,
                student.phone,
                student.email,
                student.form,
                student.platform,
                student.nick,
                student.city,
                student.address
            ]
        );
        return insertRes[0].insertId;
    } catch (error) {
        // console.error(`Error while inserting a new student: ${JSON.stringify(error)}`);
        return error;
    }
}

export async function getAllS() {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const students = await db.executeSql(
            `SELECT * FROM students`
        );

        let results = [];
        for (let i = 0; i < students[0].rows.length; i++) {
            results.push({ ...students[0].rows.item(i) });
        }

        return results;
    } catch (error) {
        // console.error(`Error while selecting all students: ${JSON.stringify(error)}`);
        return error;
    }
}

export async function deleteS(id) {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const del = await db.executeSql(
            `DELETE FROM students WHERE id=${id}`
        );
    } catch (error) {
        return error;
    }
}

export async function updateS(student, id) {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const res = await db.executeSql(
            `UPDATE students
            SET name=${student.name},
                surname=${student.surname},
                phone=${student.phone},
                email=${student.email},
                form=${student.form},
                platform=${student.platform},
                nick=${student.nick},
                city=${student.city},
                address=${student.address}
            WHERE id=${id}`
        );
    } catch (error) {
        // console.error(`Error while inserting a new student: ${JSON.stringify(error)}`);
        return error;
    }
}
