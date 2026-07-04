// =====================================
// Socket Connection
// =====================================

const socket = io();

// =====================================
// HTML Elements
// =====================================

const documentInput = document.getElementById("documentName");
const createBtn = document.getElementById("createBtn");
const documentList = document.getElementById("documentList");

// =====================================
// Request Documents
// =====================================

socket.on("connect", () => {

    console.log("Connected");

    socket.emit("get-documents");

});

// =====================================
// Create Document
// =====================================

createBtn.addEventListener("click", () => {

    const roomId = documentInput.value.trim();

    if (!roomId) {

        alert("Enter document name");

        return;

    }

    socket.emit("create-document", roomId);

    documentInput.value = "";

});

// =====================================
// Document Created
// =====================================

socket.on("document-created", () => {

    socket.emit("get-documents");

});

// =====================================
// Receive Document List
// =====================================

socket.on("documents-list", (documents) => {

    renderDocuments(documents);

});

// =====================================
// Render Documents
// =====================================

function renderDocuments(documents) {

    documentList.innerHTML = "";

    if (documents.length === 0) {

        documentList.innerHTML = "<p>No documents available.</p>";

        return;

    }

    documents.forEach(room => {

        const card = document.createElement("div");

        card.className = "document-card";

        card.innerHTML = `
            <h3>${room}</h3>
            <button>Open</button>
        `;

        card.querySelector("button")
            .addEventListener("click", () => {

                window.location.href =
                    `editor.html?room=${encodeURIComponent(room)}`;

            });

        documentList.appendChild(card);

    });

}