# real-time-chat-app (React + Tailwind + Node + Socket.IO + MongoDB)

## What you get
- server/ -> Node.js + Express + Socket.IO + MongoDB (Mongoose)
- client/ -> React (Vite) + Tailwind CSS + Socket.IO client

## Quick start (local)
1. Make sure MongoDB is running locally, or set the MONGODB_URI environment variable.
   Example local: mongodb://127.0.0.1:27017/realtime-chat-app

2. Start server
   cd server
   npm install
   npm run start

3. Start client
   cd client
   npm install
   npm run dev

4. Open http://localhost:5173 in two tabs and join with different usernames.

## Notes
- Messages stored in MongoDB; history (last 50) is sent on join.
- For production add authentication and environment variable management.
