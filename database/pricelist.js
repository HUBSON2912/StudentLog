import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export async function createTablePL() {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })
        db.executeSql(
            `CREATE TABLE IF NOT EXISTS pricelist (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             subject TEXT,
             level TEXT,
             price INTEGER
             );`
        );
    } catch (error) {
        // console.error(`Cannot create the students table: ${JSON.stringify(error)}`);
        return error;
    }
}

export async function insertPL(pricelist_item) {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const insertRes = await db.executeSql(
            `INSERT INTO pricelist
            (subject, level, price)
            VALUES (?, ?, ?)`,
            [
                pricelist_item.subject,
                pricelist_item.level,
                pricelist_item.price
            ]
        );
        return insertRes[0].insertId;
    } catch (error) {
        // console.error(`Error while inserting a new student: ${JSON.stringify(error)}`);
        return error;
    }
}

export async function getAllPL() {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const pricelist = await db.executeSql(
            `SELECT * FROM pricelist`
        );

        let results = [];
        for (let i = 0; i < pricelist[0].rows.length; i++) {
            results.push({ ...pricelist[0].rows.item(i) });
        }

        return results;
    } catch (error) {
        // console.error(`Error while selecting all students: ${JSON.stringify(error)}`);
        return error;
    }
}

export async function deletePL(id) {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const del = await db.executeSql(
            `DELETE FROM pricelist WHERE id=${id}`
        );
    } catch (error) {
        return error;
    }
}

export async function updatePL(pricelist_item, id) {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })

        const res = await db.executeSql(
            `UPDATE pricelist
            SET subject="${pricelist_item.subject}",
                level="${pricelist_item.level}",
                price=${pricelist_item.price}
            WHERE id=${id}`
        );
    } catch (error) {
        // console.error(`Error while inserting a new student: ${JSON.stringify(error)}`);
        return error;
    }
}

export async function dropTablePL() {
    try {
        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })
        db.executeSql(
            `DROP TABLE IF EXISTS pricelist;`
        );
    } catch (error) {
        // console.error(`Cannot create the students table: ${JSON.stringify(error)}`);
        return error;
    }
}

export async function importPL(array) {
    try {
        await dropTablePL();
        await createTablePL();

        const db = await SQLite.openDatabase({ name: 'studentlog.db', location: 'default' })
        const items=array.map(x=>`(${x.id}, "${x.subject}", "${x.level}", ${x.price})`).join(",");
        const insertRes = await db.executeSql(
            `INSERT INTO pricelist
            (id, subject, level, price)
            VALUES ${items}`);
    } catch (error) {
        return error;
    }
}