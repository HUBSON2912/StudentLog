import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const priceList = "price_list";

export async function insertIntoPriceList(newElement) {
    try {

        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
        await db.executeSql(
            `CREATE TABLE IF NOT EXISTS ${priceList} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT,
            level TEXT,
            price INTEGER
        );`);

        const insertRes = await db.executeSql(`INSERT INTO ${priceList} 
                            (subject, level, price)
                            VALUES (?, ?, ?)`,
            [
                newElement.subject,
                newElement.level,
                newElement.price
            ]
        );
        return insertRes[0].insertId;
    }
    catch (error) {
        console.error('Error inserting lesson:', error);
    }
}

export async function updateIDPriceList(id, data) {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
        await db.executeSql(
            `CREATE TABLE IF NOT EXISTS ${priceList} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT,
            level TEXT,
            price INTEGER
        );`);
        return await db.executeSql(
            `UPDATE ${priceList} SET 
            subject = ?,
            level = ?,
            price = ?
            WHERE id = ?`,
            [
                data.subject,
                data.level,
                data.price,
                id
            ]
        );
    } catch (error) {
        console.error(error);
    }
}

export async function getAllPriceList() {
    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${priceList} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT,
            level TEXT,
            price INTEGER
        );`);
    const [rows] = await db.executeSql(`SELECT * FROM ${priceList}`);
    const result = [];

    for (let i = 0; i < rows.rows.length; i++)
        result.push(rows.rows.item(i));

    return result;
}


export async function getByIDPriceList(id) {
    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${priceList} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT,
            level TEXT,
            price INTEGER
        );`);
    const [rows] = await db.executeSql(`SELECT * FROM ${priceList} WHERE id=${id}`);
    const result = rows.rows.item(0);
    return result;
}

export async function deleteIDPriceList(id) {
    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${priceList} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT,
            level TEXT,
            price INTEGER
        );`);
    const [rows] = await db.executeSql(`DELETE FROM ${priceList} WHERE id = ${id};`);
}

export async function dropDBPriceList() {
    const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' });
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${priceList} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT,
            level TEXT,
            price INTEGER
        );`);
    const [rows] = await db.executeSql(`DROP TABLE ${priceList};`);
}