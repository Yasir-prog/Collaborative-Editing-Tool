// server/services/documentService.js

const Delta = require("quill-delta");
const fileHandler = require("../utils/fileHandler");

// In-memory documents
const documents = {};


/*
Create or Load Document
*/
function createDocument(roomId) {

    // Already in memory
    if (documents[roomId]) {

        return documents[roomId];

    }

    // Try loading from file
    const savedDocument = fileHandler.loadDocument(roomId);

    if (savedDocument) {

        documents[roomId] = new Delta(savedDocument);

    } else {

        documents[roomId] = new Delta();

        fileHandler.saveDocument(
            roomId,
            documents[roomId]
        );
    }

    return documents[roomId];

}


/*
Get Document
*/
function getDocument(roomId) {

    return createDocument(roomId);

}


/*
Apply Delta
*/
function applyDelta(roomId, delta) {

    createDocument(roomId);

    documents[roomId] =
        documents[roomId].compose(
            new Delta(delta)
        );

    // Save latest version
    fileHandler.saveDocument(
        roomId,
        documents[roomId]
    );

    return documents[roomId];

}


/*
Delete Document
*/
function removeDocumentFromMemory(roomId) {

    delete documents[roomId];

}


module.exports = {

    createDocument,

    getDocument,

    applyDelta,

    removeDocumentFromMemory

};