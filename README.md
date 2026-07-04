# Real-Time Collaborative Text Editor

## Project Overview

The **Real-Time Collaborative Text Editor** is a web application that allows multiple users to edit the same text document simultaneously over a local network. Any changes made by one user are instantly reflected on all connected users' screens.

The application uses **Socket.IO** for real-time communication, **Quill.js** as the rich text editor, and **Node.js + Express** as the backend server. The edited document is automatically saved to the server after users finish editing.

---

# Objectives

* Allow multiple users to edit the same document simultaneously.
* Synchronize edits in real time.
* Handle concurrent edits safely.
* Automatically save the document to disk.
* Support multiple computers connected to the same Wi-Fi/router.
* Build a scalable architecture for future enhancements.

---

# Features

* Real-time collaborative editing
* Rich text editing using Quill.js
* Multiple users connected simultaneously
* Automatic document synchronization
* Automatic file saving
* Document loading on user join
* Room-based collaboration
* Conflict handling for simultaneous edits

---

# Technology Stack

## Frontend

* HTML
* CSS
* JavaScript
* Quill.js
* Socket.IO Client

## Backend

* Node.js
* Express.js
* Socket.IO

## Storage

* Local text files (.txt)

---

# System Architecture

```
             Client A
        (Quill Editor)
               |
        Socket.IO Client
               |
               |
        -----------------
        |               |
        |    Server     |
        |               |
        | Socket.IO     |
        | Room Manager  |
        | File Manager  |
        -----------------
               |
        Document Storage
          (document.txt)
               |
        Socket.IO Client
               |
         Quill Editor
             Client B
```

---

# Workflow

1. User opens the application.
2. User joins a document room.
3. Server loads the document.
4. User edits the document.
5. Quill generates a Delta.
6. Delta is sent to the server.
7. Server updates the document.
8. Server broadcasts the change.
9. Other users receive the update instantly.
10. Server saves the document after editing.

---

# Folder Structure

```
project/

│
├── client/
│
│   ├── public/
│   │      index.html
│   │      style.css
│   │
│   ├── js/
│          editor.js
│          socket.js
│   
│
├── server/
│
│   ├── documents/
│   │      document.txt
│   │
│   ├── socket/
│   │      socketHandler.js
│   │
│   ├── services/
│   │      documentService.js
│   │
│   ├── utils/
│   │      fileHandler.js
│   │
│   ├── server.js
│   └
│
└── README.md
```

---

# Socket Events

## Client → Server

```
join-document
leave-document
text-change
save-document
```

## Server → Client

```
load-document
receive-change
document-saved
user-joined
user-left
```

---

# Race Condition Example

Suppose two users edit the same document simultaneously.

```
User A types:
Hello

User B types:
World
```

Both edits reach the server almost at the same time.

Instead of clients communicating directly, the server becomes the **single source of truth**.

Workflow:

```
Client A
    |
    |
 Server
    |
    |
Client B
```

The server processes edits sequentially and broadcasts the updated document to every connected client.

---

# Future Enhancements

* JWT Authentication
* Multiple documents
* Cursor positions
* Colored cursors
* User presence
* Version history
* Undo/Redo
* Export as TXT
* Export as PDF
* Database storage
* Cloud deployment

---

# Learning Outcomes

By completing this project, you will learn:

* Socket.IO
* Real-time communication
* Event-driven programming
* Client-server architecture
* Quill.js integration
* File handling with Node.js
* Document synchronization
* Race condition handling
* Debouncing
* Room management
* Full-stack application development

---

# Recommended Development Order

1. Create the Quill editor.
2. Build the Express server.
3. Connect Socket.IO.
4. Synchronize edits between two browser windows.
5. Test on two different computers connected to the same router.
6. Add document rooms.
7. Load documents from disk.
8. Implement auto-save.
9. Handle concurrent edits using Quill Delta operations.
10. Add optional advanced features such as authentication, cursor tracking, and version history.