// Get Room From URL

const params = new URLSearchParams(window.location.search);

const roomId = params.get("room");

// HTML Elements

const roomTitle = document.getElementById("roomTitle");
const userCount = document.getElementById("userCount");
const userList = document.getElementById("userList");
const backBtn = document.getElementById("backBtn");

// Show Room Name
const findBtn = document.getElementById("findBtn");
const replaceBtn = document.getElementById("replaceBtn");
const replaceAllBtn = document.getElementById("replaceAllBtn");

findBtn.addEventListener("click", findText);
replaceBtn.addEventListener("click", replaceText);
replaceAllBtn.addEventListener("click", replaceAllText);

roomTitle.textContent = roomId;

// Create Quill Editor

const quill = new Quill("#editor", {

    theme: "snow",

    placeholder: "Start typing...",

    modules: {
        toolbar: "#toolbar-container"
    }

});

quill.disable();

// Join Room

// Ask user for a name
let username = prompt("Enter your name");

if (!username || username.trim() === "") {

    username = "Guest";

}

joinDocument(roomId, username);
// Load Document

socket.on("load-document", (document) => {

    quill.setContents(document);

    quill.enable();

    quill.focus();

});

// User Types

quill.on("text-change", (delta, oldDelta, source) => {

    if (source !== "user") return;

    sendChange(delta);

});

// Receive Changes

socket.on("receive-change", (delta) => {

    quill.updateContents(delta);

});

// Document Saved

socket.on("document-saved", () => {

    console.log("Document Saved");

});

// User List

socket.on("users-updated", (users) => {

    renderUsers(users);

});

// Back Button

backBtn.addEventListener("click", () => {

    leaveDocument();

    window.location.href = "index.html";

});

// Render Users

function renderUsers(users) {

    userList.innerHTML = "";

    userCount.textContent = `Users Online : ${users.length}`;

    users.forEach(user => {

        const div = document.createElement("div");

        div.className = "user";

        div.textContent = `🟢 ${user.username}`;

        userList.appendChild(div);

    });

    

}

function findText() {

    const word = prompt("Find:");

    if (!word) return;

    const text = quill.getText();

    const index = text.indexOf(word);

    if (index === -1) {

        alert("Word not found.");

        return;

    }

    quill.setSelection(index, word.length);

    quill.focus();

}

function replaceText() {

    const findWord = prompt("Find:");

    if (!findWord) return;

    const replaceWord = prompt("Replace With:");

    if (replaceWord === null) return;

    const text = quill.getText();

    const index = text.indexOf(findWord);

    if (index === -1) {

        alert("Word not found.");

        return;

    }

    quill.deleteText(index, findWord.length);

    quill.insertText(index, replaceWord);

}

function replaceAllText() {

    const findWord = prompt("Find:");

    if (!findWord) return;

    const replaceWord = prompt("Replace With:");

    if (replaceWord === null) return;

    let text = quill.getText();

    let index = text.indexOf(findWord);

    while (index !== -1) {

        quill.deleteText(index, findWord.length);

        quill.insertText(index, replaceWord);

        text = quill.getText();

        index = text.indexOf(
            findWord,
            index + replaceWord.length
        );

    }

}