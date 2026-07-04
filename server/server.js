const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const socketHandler = require("./socket/socketHandler");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 3000;

// Serve client files
app.use(
    express.static(
        path.join(__dirname, "../client/public")
    )
);
// Health Check
app.get("/api/health", (req, res) => {
    res.json({
        status: "Server Running"
    });
});

// Register all socket events
socketHandler(io);

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});