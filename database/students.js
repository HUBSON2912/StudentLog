import SQLite from 'react-native-sqlite-storage';
import { possibleTableNames } from '../constants/const';

SQLite.enablePromise(true);



export async function createTable(name) {
    try {
        if (!(name in possibleTableNames)) {
            throw new Error("Unknown table name");
        }

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
    } catch (error) {
        console.error("Cannot create the students table", JSON.stringify(error));
        return error;
    }
}