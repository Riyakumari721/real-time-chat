// const socket = io('http://localhost:8000');
// const form = document.getElementById('send-container');
// const messageInput = document.getElementById('messageInp');
// const messageContainer = document.querySelector(".container");
// const append = (messag, position) => {
//     const messageElement = document.createElement('div');
//     messageElement.innerText = messag;
//     messageElement.classList.add('message');
//     messageElement.classList.add(position);
//     messageContainer.append(messageElement);
// }

// const name = prompt("Enter your name to join");
// socket.emit('new-user-joined', name);

// socket.on('user-joined', name => {
//     appendMessage(`${name} joined the chat`);
// })

const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.getElementById('container');
const usersList = document.getElementById('users');
const typingDiv = document.getElementById('typing');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('p-2', 'my-1', 'rounded', 'max-w-xs');
    if (position === 'right') {
        messageElement.classList.add('bg-blue-600', 'ml-auto');
    } else {
        messageElement.classList.add('bg-gray-700');
    }
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Ask user name
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// Events
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});

socket.on('update-user-list', users => {
    usersList.innerHTML = '';
    users.forEach(u => {
        const li = document.createElement('li');
        li.textContent = u;
        usersList.append(li);
    });
});

form.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
    socket.emit('stop-typing');
});

messageInput.addEventListener('input', () => {
    if (messageInput.value.trim() !== '') {
        socket.emit('typing', name);
    } else {
        socket.emit('stop-typing');
    }
});

socket.on('show-typing', name => {
    typingDiv.innerText = `${name} is typing...`;
});

socket.on('hide-typing', () => {
    typingDiv.innerText = '';
});

