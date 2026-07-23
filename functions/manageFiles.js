import { pick, saveDocuments } from "@react-native-documents/picker";

let RNFS = require('react-native-fs');

export async function createFile(fileName, extension, textContent, mimeType = "text/plain") {
    try {        
        const tempFile = `${RNFS.CachesDirectoryPath}/temp_${fileName}.${extension}`;
        
        fileName = `${fileName}.${extension}`;
        await RNFS.writeFile(tempFile, textContent, "utf8");
        const res = await saveDocuments({
            sourceUris: [`file://${tempFile}`],
            mimeType: mimeType,
            copy: false,
            fileName: fileName
        });
        await RNFS.unlink(tempFile);
        return { success: true, message: "Zapisano pomyślnie" };
    } catch (e) {
        return { success: false, message: "Wystąpił nieoczekiwany błąd" }
    }
}

export async function selectFile() {
    try {
        let res = await pick();
        let content = await RNFS.readFile(res[0].uri);

        return {success: true, message: "", content: content};
    } catch (err) {
        return { success: false, message: "Nie udało się wczytać pliku", error: err};
    }
}