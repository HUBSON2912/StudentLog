import { saveDocuments } from "@react-native-documents/picker";

let RNFS = require('react-native-fs');

export async function createFile(fileName, textContent, mimeType="text/plain") {
    try {
        const tempFile = `${RNFS.CachesDirectoryPath}/example.txt`;
        await RNFS.writeFile(tempFile, textContent, "utf8");
        const res = await saveDocuments({
            sourceUris: [`file://${tempFile}`],
            mimeType: mimeType,
            copy: false,
            fileName: fileName
        });
        return { success: true, message: "Zapisano pomyślnie" };
    } catch (e) {
        return { success: false, message: "Wystąpił nieoczekiwany błąd" }
    }
}