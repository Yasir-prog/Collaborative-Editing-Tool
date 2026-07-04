const fs = require("fs");
const path = require("path");

const DOCUMENT_FOLDER = path.join(__dirname, "../documents");

/*
Create documents folder if it doesn't exist
*/

if (!fs.existsSync(DOCUMENT_FOLDER)) {
    fs.mkdirSync(DOCUMENT_FOLDER);
}

/*
Get full file path
*/

function getFilePath(roomId) {

    return path.join(DOCUMENT_FOLDER, `${roomId}.json`);

}

/*
Save document
*/

function saveDocument(roomId, document) {

    const filePath = getFilePath(roomId);

    fs.writeFileSync(
        filePath,
        JSON.stringify(document, null, 2)
    );

}

/*
Load document
*/

function loadDocument(roomId) {

    const filePath = getFilePath(roomId);

    if (!fs.existsSync(filePath)) {

        return null;

    }

    const data = fs.readFileSync(
        filePath,
        "utf8"
    );

    return JSON.parse(data);

}

/*
Delete document
*/

function deleteDocument(roomId) {

    const filePath = getFilePath(roomId);

    if (fs.existsSync(filePath)) {

        fs.unlinkSync(filePath);

    }

}

/*
========================================
Get All Documents
========================================
*/

function getAllDocuments() {

    const files = fs.readdirSync(DOCUMENT_FOLDER);

    return files
        .filter(file => file.endsWith(".json"))
        .map(file => file.replace(".json", ""));

}

module.exports = {

    saveDocument,

    loadDocument,

    deleteDocument,
    getAllDocuments

};