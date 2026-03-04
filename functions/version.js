export function getVersion() {
    const packageFile=require("../package.json");
    return packageFile.version;
}