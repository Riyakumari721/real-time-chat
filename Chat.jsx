import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Chat({ username }){
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join', username);

    socket.on('message_history', (history) => {
      setChat(history);
    });

    socket.on('user_list', (list) => setUsers(list));

    socket.on('receive_message', (data) => {
      setChat(prev => [...prev, data]);
    });

    socket.on('show_typing', (user) => {
      if(user !== username) setTypingUser(`${user} is typing...`);
    });

    socket.on('hide_typing', () => setTypingUser(''));

    return () => {
      socket.off('message_history');
      socket.off('user_list');
      socket.off('receive_message');
      socket.off('show_typing');
      socket.off('hide_typing');
    };
  }, [username]);

  useEffect(() => {
    if(messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = async () => {
    if(message.trim() === '') return;
    const msg = { user: username, text: message };
    socket.emit('send_message', msg);
    setMessage('');
    socket.emit('stop_typing');
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit('typing', username);
    if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(()=> socket.emit('stop_typing'), 700);
    if(e.target.value === '') {
      if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.emit('stop_typing');
    }
  };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') sendMessage();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md w-full max-w-4xl flex">
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Welcome, <span className="text-blue-600">{username}</span></h2>
          <div className="text-sm text-gray-500">{new Date().toLocaleString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-3 bg-gray-50">
          {chat.map((c, i) => (
            <div key={i} className={`max-w-md ${c.user === username ? 'ml-auto text-right' : ''}`}>
              <div className="text-sm font-semibold">{c.user}</div>
              <div className="bg-white inline-block p-2 rounded-lg shadow-sm mt-1">{c.text}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(c.timestamp || Date.now()).toLocaleTimeString()}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {typingUser && <div className="text-sm text-gray-500 italic mt-2">{typingUser}</div>}

        <div className="mt-3 flex gap-2">
          <input value={message} onChange={handleTyping} onKeyDown={handleKeyDown}
                 className="flex-1 border rounded-lg p-2" placeholder="Type a message..." />
          <button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Send</button>
        </div>
      </div>

      <div className="w-56 border-l p-4">
        <h3 className="font-semibold mb-3">Online Users</h3>
        <ul className="space-y-2">
          {users.map((user,i)=>(
            <li key={i} className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${user===username ? 'bg-green-600' : 'bg-green-400'}`}></span>
              <span className={`${user===username ? 'font-semibold text-blue-600' : ''}`}>{user}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
