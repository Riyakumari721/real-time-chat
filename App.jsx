import React, { useState } from 'react';
import Chat from './Chat';

export default function App(){
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if(username.trim() !== '') setJoined(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {!joined ? (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-4">Join Chat</h1>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Enter your name"
                 className="border rounded-lg w-full p-2 mb-4" />
          <button onClick={handleJoin} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full">Join</button>
        </div>
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
}
