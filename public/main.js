// --- DOM ELEMENT SELECTORS ---
const joinContainer = document.querySelector('.join-container');
const chatContainer = document.querySelector('.chat-container');
const joinForm = document.getElementById('join-form');
const roomInput = document.getElementById('room');
const usernameInput = document.getElementById('username');
const roomListElement = document.getElementById('room-list');

// Chat UI Elements
const chatHeader = document.querySelector('.chat-header');
const chatFormContainer = document.querySelector('.chat-form-container');
const chatMessages = document.querySelector('.chat-messages');
const chatSidebar = document.querySelector('.chat-sidebar');
const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('msg');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Buttons
const leaveBtn = document.getElementById('leave-btn');
const emojiBtn = document.getElementById('emoji-btn');
const usersBtn = document.getElementById('users-btn');

// Other
const emojiPicker = document.querySelector('emoji-picker');
const themeCheckboxJoin = document.getElementById('theme-checkbox-join');
const themeCheckboxChat = document.getElementById('theme-checkbox-chat');
const socket = io({
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5
});

// --- DYNAMIC LAYOUT ---
function setAppHeight() {
    const vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    if(chatContainer.style.display !== 'none') {
        chatContainer.style.height = `${vh}px`;
    }
}
window.addEventListener('resize', setAppHeight);
window.addEventListener('load', setAppHeight);

// --- THEME SWITCHER ---
function applyTheme(isDark) {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    // Sync both checkboxes
    themeCheckboxJoin.checked = isDark;
    themeCheckboxChat.checked = isDark;
}

function setupTheme() {
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark');

    themeCheckboxJoin.addEventListener('change', (e) => applyTheme(e.target.checked));
    themeCheckboxChat.addEventListener('change', (e) => applyTheme(e.target.checked));
}
document.addEventListener('DOMContentLoaded', setupTheme);


// --- EVENT LISTENERS ---
joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const room = roomInput.value;
    const user = { username, room };
    sessionStorage.setItem('openWindowUser', JSON.stringify(user));
    socket.emit('joinRoom', user);
});

chatForm.addEventListener('submit', e => {
    e.preventDefault();
    if (msgInput.value) {
        socket.emit('chatMessage', msgInput.value);
        msgInput.value = '';
        msgInput.focus();
    }
});

leaveBtn.addEventListener('click', () => {
    sessionStorage.removeItem('openWindowUser');
    location.reload();
});

roomListElement.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (li && li.dataset.room) roomInput.value = li.dataset.room;
});

usersBtn.addEventListener('click', () => chatSidebar.classList.toggle('sidebar-open'));
emojiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
});
emojiPicker.addEventListener('emoji-click', event => {
    msgInput.value += event.detail.emoji.unicode;
});

document.addEventListener('click', (e) => {
    if (emojiPicker.style.display === 'block' && !emojiBtn.contains(e.target) && !emojiPicker.contains(e.target)) {
        emojiPicker.style.display = 'none';
    }
    if (chatSidebar.classList.contains('sidebar-open') && !chatSidebar.contains(e.target) && !usersBtn.contains(e.target)) {
        chatSidebar.classList.remove('sidebar-open');
    }
});


// --- SOCKET EVENT HANDLERS ---
socket.on('connect', () => {
    console.log('Connected to server.');
    const storedUser = sessionStorage.getItem('openWindowUser');
    if (storedUser) {
        socket.emit('joinRoom', JSON.parse(storedUser));
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from server. Attempting to reconnect...');
});

socket.on('roomList', (rooms) => outputRoomList(rooms));

socket.on('joinSuccess', () => {
    joinContainer.style.display = 'none';
    chatContainer.style.display = 'flex';
    emojiPicker.style.display = 'none';
    setAppHeight();
});

socket.on('usernameError', (error) => {
    alert(error);
    sessionStorage.removeItem('openWindowUser');
    location.reload();
});

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// --- DOM MANIPULATION ---
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p><p class="text">${message.text}</p>`;
    chatMessages.appendChild(div);
}
function outputRoomName(room) { roomName.innerText = room; }
function outputUsers(users) { userList.innerHTML = users.map(user => `<li>${user.username}</li>`).join(''); }
function outputRoomList(rooms) {
    roomListElement.innerHTML = rooms.length ? 
        rooms.map(room => `<li data-room="${room.name}">${room.name} <span class="participants"><i class="fas fa-users"></i> ${room.userCount}</span></li>`).join('') :
        `<li style="cursor: default;">No active rooms</li>`;
}