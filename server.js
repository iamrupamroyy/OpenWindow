const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getActiveRooms,
    isUsernameTaken
} = require('./utils/users');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'OpenWindow';

// Run when client connects
io.on('connection', socket => {
    // Send active rooms list
    socket.emit('roomList', getActiveRooms());

    socket.on('joinRoom', ({ username, room }) => {
        if (isUsernameTaken(username, room)) {
            return socket.emit('usernameError', `Username '${username}' is already taken in room '${room}'.`);
        }
        
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Signal successful join to client
        socket.emit('joinSuccess');

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to OpenWindow!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );
        
        // Broadcast updated room list
        io.emit('roomList', getActiveRooms());

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(user.username, msg));
        }
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Broadcast updated room list if room is now empty
            io.emit('roomList', getActiveRooms());

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));