const users = [];
const rooms = new Set();

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    rooms.add(room);
    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        const user = users.splice(index, 1)[0];
        const roomUsers = getRoomUsers(user.room);
        if (roomUsers.length === 0) {
            rooms.delete(user.room);
        }
        return user;
    }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

// Check if username is taken in a room
function isUsernameTaken(username, room) {
    const usersInRoom = getRoomUsers(room);
    return usersInRoom.some(user => user.username.toLowerCase() === username.toLowerCase());
}

// Get active rooms
function getActiveRooms() {
    return Array.from(rooms).map(room => {
        return {
            name: room,
            userCount: getRoomUsers(room).length
        }
    });
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getActiveRooms,
    isUsernameTaken
};
