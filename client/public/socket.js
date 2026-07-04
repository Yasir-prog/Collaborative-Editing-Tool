// =======================================
// Socket Connection
// =======================================

const socket = io();

// Current room
let currentRoom = null;

// =======================================
// Connection
// =======================================

socket.on("connect", () => {

    console.log("Connected");
    console.log("Socket ID:", socket.id);

});

socket.on("disconnect", () => {

    console.log("Disconnected");

});

// =======================================
// Join Document
// =======================================

// =======================================
// Join Document
// =======================================

function joinDocument(roomId, username) {

    currentRoom = roomId;

    socket.emit("join-document", {

        roomId,

        username

    });

}

// =======================================
// Send Text Changes
// =======================================

function sendChange(delta) {

    if (!currentRoom) return;

    socket.emit("text-change", {

        roomId: currentRoom,

        delta

    });

}

// =======================================
// Save Document
// =======================================

function saveDocument() {

    if (!currentRoom) return;

    socket.emit("save-document", {

        roomId: currentRoom

    });

}

// =======================================
// Leave Room
// =======================================

function leaveDocument() {

    if (!currentRoom) return;

    socket.emit("leave-document", currentRoom);

}

// =======================================
// Export
// =======================================

// These are global because editor.js is loaded after socket.js
window.socket = socket;
window.joinDocument = joinDocument;
window.sendChange = sendChange;
window.saveDocument = saveDocument;
window.leaveDocument = leaveDocument;