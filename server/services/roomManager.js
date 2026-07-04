// server/services/roomManager.js

const rooms = {};

/*
Join Room
*/

function joinRoom(roomId, socketId, username) {

    if (!rooms[roomId]) {

        rooms[roomId] = [];

    }

    const exists = rooms[roomId].find(user => user.socketId === socketId);

    if (!exists) {

        rooms[roomId].push({

            socketId,

            username

        });

    }

}

/*
Leave Room
*/

function leaveRoom(roomId, socketId) {

    if (!rooms[roomId]) return;

    rooms[roomId] = rooms[roomId].filter(

        user => user.socketId !== socketId

    );

    if (rooms[roomId].length === 0) {

        delete rooms[roomId];

    }

}

/*
Get Users
*/

function getUsers(roomId) {

    if (!rooms[roomId]) {

        return [];

    }

    return rooms[roomId];

}

/*
Get User Count
*/

function getUserCount(roomId) {

    if (!rooms[roomId]) {

        return 0;

    }

    return rooms[roomId].length;

}

module.exports = {

    joinRoom,

    leaveRoom,

    getUsers,

    getUserCount

};