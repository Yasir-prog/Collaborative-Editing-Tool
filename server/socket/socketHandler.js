const documentService = require("../services/documentService");
const roomManager = require("../services/roomManager");
const fileHandler = require("../utils/fileHandler");

module.exports = function (io) {

    io.on("connection", (socket) => {

        console.log(`Client Connected : ${socket.id}`);

        let currentRoom = null;

        /*
        ====================================
        CREATE DOCUMENT
        ====================================
        */

        socket.on("create-document", (roomId) => {

            roomId = roomId.trim();

            if (!roomId) {

                socket.emit("error-message", "Invalid document name");

                return;

            }

            documentService.createDocument(roomId);

            socket.emit("document-created");

            console.log(`Document Created : ${roomId}`);

        });

        /*
        ====================================
        GET DOCUMENTS
        ====================================
        */

        socket.on("get-documents", () => {

            const documents = fileHandler.getAllDocuments();

            socket.emit("documents-list", documents);

        });

        /*
        ====================================
        JOIN DOCUMENT
        ====================================
        */

        socket.on("join-document", ({ roomId, username }) => {

            currentRoom = roomId;

            socket.join(roomId);

            roomManager.joinRoom(
                roomId,
                socket.id,
                username
            );

            console.log(`${username} joined ${roomId}`);

            const document = documentService.getDocument(roomId);

            socket.emit("load-document", document);

            socket.emit("joined-success", {
                room: roomId
            });

            // Send updated user list to everyone
            io.to(roomId).emit(
                "users-updated",
                roomManager.getUsers(roomId)
            );

            // Notify everyone except new user
            socket.to(roomId).emit("user-joined", {
                socketId: socket.id,
                users: roomManager.getUserCount(roomId)
            });

        });

        /*
        ====================================
        TEXT CHANGE
        ====================================
        */

        socket.on("text-change", ({ roomId, delta }) => {

            documentService.applyDelta(roomId, delta);

            socket.to(roomId).emit("receive-change", delta);

        });

        /*
        ====================================
        SAVE DOCUMENT
        ====================================
        */

        socket.on("save-document", ({ roomId }) => {

            socket.emit("document-saved");

        });

        /*
        ====================================
        LEAVE DOCUMENT
        ====================================
        */

        socket.on("leave-document", (roomId) => {

            socket.leave(roomId);

            roomManager.leaveRoom(roomId, socket.id);

            io.to(roomId).emit(
                "users-updated",
                roomManager.getUsers(roomId)
            );

            socket.to(roomId).emit("user-left", {
                socketId: socket.id,
                users: roomManager.getUserCount(roomId)
            });

            if (roomManager.getUserCount(roomId) === 0) {

                documentService.removeDocumentFromMemory(roomId);
                console.log(`${roomId} removed from memory`);

            }

            currentRoom = null;

        });

        /*
        ====================================
        DISCONNECT
        ====================================
        */

        socket.on("disconnect", () => {

            console.log(`${socket.id} disconnected`);

            if (currentRoom) {

                roomManager.leaveRoom(
                    currentRoom,
                    socket.id
                );

                io.to(currentRoom).emit(
                    "users-updated",
                    roomManager.getUsers(currentRoom)
                );

                socket.to(currentRoom).emit("user-left", {
                    socketId: socket.id,
                    users: roomManager.getUserCount(currentRoom)
                });

                if (roomManager.getUserCount(currentRoom) === 0) {

                    documentService.removeDocumentFromMemory(currentRoom);
                    console.log(`${currentRoom} removed from memory`);

                }

            }

        });

    });

};